"use client";

import { useState, useEffect, useCallback } from "react";
import {
  type CartItem,
  type LeanCartItem,
  type CartTotals,
  type CartSyncMessage,
  type CartActionType,
  type Product,
  type SelectedAttributes,
  type AppliedCoupon,
  AVAILABLE_COUPONS,
  calculateProductPrice,
  calculateProductOriginalPrice,
  CANONICAL_PRODUCT_TITLES,
  getCartItemId,
  toLeanCartItem,
  hydrateCartItem,
  isVariantInStock,
} from "@repo/shared-types";

export const CART_STORAGE_KEY = "ecommerce_cart_v1";
export const COUPON_STORAGE_KEY = "ecommerce_coupon_v1";
export const CART_CHANNEL_NAME = "ecommerce_cart_channel";
export const FREE_SHIPPING_THRESHOLD = 75;
export const TAX_RATE = 0.08;

export function getStoredCoupon(): AppliedCoupon | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(COUPON_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredCoupon(coupon: AppliedCoupon | null) {
  if (typeof window === "undefined") return;
  try {
    if (coupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(coupon));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  } catch (e) {
    console.warn("Failed to save coupon to storage", e);
  }
}

export interface StoredCartPayload {
  items: LeanCartItem[];
  timestamp: number;
}

let globalChannel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!globalChannel && "BroadcastChannel" in window) {
    try {
      globalChannel = new BroadcastChannel(CART_CHANNEL_NAME);
    } catch (e) {
      console.warn("BroadcastChannel not supported", e);
    }
  }
  return globalChannel;
}

// Cookie helpers to bridge isolation across different ports on localhost (:3000 and :3001)
// Uses LeanCartItem payload (<500 bytes) to stay safely within RFC 6265 4KB cookie hard limits
function setCookieCart(items: LeanCartItem[], timestamp: number): void {
  if (typeof document === "undefined") return;
  try {
    const payload: StoredCartPayload = { items, timestamp };
    const serialized = encodeURIComponent(JSON.stringify(payload));
    if (serialized.length < 3900) {
      document.cookie = `${CART_STORAGE_KEY}=${serialized}; path=/; max-age=604800; SameSite=Lax`;
    } else {
      console.warn("Cart cookie exceeds safe size limit, dropping non-essential data");
    }
  } catch (e) {
    console.error("Failed to save cart to cookie", e);
  }
}

function getCookiePayload(): StoredCartPayload | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${CART_STORAGE_KEY})=([^;]*)`));
    if (match && match[3]) {
      const decoded = decodeURIComponent(match[3]);
      const parsed = JSON.parse(decoded);
      if (Array.isArray(parsed)) {
        return { items: parsed, timestamp: 0 };
      }
      if (parsed && Array.isArray(parsed.items)) {
        return { items: parsed.items, timestamp: parsed.timestamp || 0 };
      }
    }
  } catch (e) {
    console.error("Failed to read cart from cookie", e);
  }
  return null;
}

function getLocalPayload(): StoredCartPayload | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { items: parsed, timestamp: 0 };
    }
    if (parsed && Array.isArray(parsed.items)) {
      return { items: parsed.items, timestamp: parsed.timestamp || 0 };
    }
  } catch {
    return null;
  }
  return null;
}

export function normalizeCartItems(items: CartItem[]): CartItem[] {
  return items.map((item) => {
    const canonical = CANONICAL_PRODUCT_TITLES[item.product.id] || item.product.title;
    const cartItemId = item.cartItemId || getCartItemId(item.product.id, item.selectedAttributes);
    const inStock = isVariantInStock(item.product, item.selectedAttributes);
    return {
      ...item,
      cartItemId,
      // If item variant is out of stock, it cannot be selected for order
      selected: inStock ? item.selected !== false : false,
      product: {
        ...item.product,
        title: canonical,
      },
    };
  });
}

export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const local = getLocalPayload();
    const cookie = getCookiePayload();

    let chosenRawItems: any[] = [];
    let chosenTimestamp = 0;

    // Cross-Port synchronization: newer timestamp wins
    if (local && cookie) {
      if (local.timestamp >= cookie.timestamp) {
        chosenRawItems = local.items;
        chosenTimestamp = local.timestamp;
        if (local.timestamp > cookie.timestamp) {
          const lean = local.items.map((i: any) => (i.productId ? i : toLeanCartItem(hydrateCartItem(i))));
          setCookieCart(lean, local.timestamp);
        }
      } else {
        chosenRawItems = cookie.items;
        chosenTimestamp = cookie.timestamp;
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cookie));
        } catch {}
      }
    } else if (local) {
      chosenRawItems = local.items;
      chosenTimestamp = local.timestamp;
      const lean = local.items.map((i: any) => (i.productId ? i : toLeanCartItem(hydrateCartItem(i))));
      setCookieCart(lean, local.timestamp);
    } else if (cookie) {
      chosenRawItems = cookie.items;
      chosenTimestamp = cookie.timestamp;
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cookie));
      } catch {}
    }

    if (!Array.isArray(chosenRawItems)) {
      return [];
    }

    return normalizeCartItems(chosenRawItems.map(hydrateCartItem));
  } catch {
    return [];
  }
}

export function saveStoredCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const timestamp = Date.now();
    const leanItems = items.map(toLeanCartItem);
    const payload: StoredCartPayload = { items: leanItems, timestamp };
    
    // Save lean representation to localStorage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
    
    // Save lean representation to shared cross-port cookie (<500 bytes)
    setCookieCart(leanItems, timestamp);
    
    // Notify same window
    window.dispatchEvent(new CustomEvent("local-cart-updated", { detail: normalizeCartItems(items) }));
  } catch (e) {
    console.error("Failed to save cart to storage", e);
  }
}

export function calculateCartTotals(
  items: CartItem[],
  appliedCoupon?: AppliedCoupon | null
): CartTotals {
  // Only items that are selected AND in stock are active for checkout & calculation
  const activeItems = items.filter(
    (i) => i.selected !== false && isVariantInStock(i.product, i.selectedAttributes)
  );
  const subtotal = activeItems.reduce(
    (acc, item) => acc + (item.unitPrice ?? item.product.price) * item.quantity,
    0
  );

  const originalSubtotal = activeItems.reduce((acc, item) => {
    const orig =
      item.originalUnitPrice ??
      item.product.originalPrice ??
      item.unitPrice ??
      item.product.price;
    return acc + orig * item.quantity;
  }, 0);

  const rawSavings = originalSubtotal - subtotal;
  const totalSavings = rawSavings > 0.01 ? Number(rawSavings.toFixed(2)) : 0;

  // Coupon discount calculation:
  let couponDiscount = 0;
  if (appliedCoupon && subtotal > 0 && appliedCoupon.discountRate > 0) {
    couponDiscount = Number(((subtotal * appliedCoupon.discountRate) / 100).toFixed(2));
  }
  const discountedSubtotal = Math.max(0, Number((subtotal - couponDiscount).toFixed(2)));

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const selectedCount = activeItems.reduce((acc, item) => acc + item.quantity, 0);
  const tax = Number((discountedSubtotal * TAX_RATE).toFixed(2));
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || activeItems.length === 0 ? 0 : 9.99;
  const total = Number((discountedSubtotal + tax + shipping).toFixed(2));
  const remainingForFreeShipping = Math.max(0, Number((FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    originalSubtotal: Number(originalSubtotal.toFixed(2)),
    totalSavings,
    tax,
    shipping,
    total,
    totalCount,
    selectedCount,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    remainingForFreeShipping,
    couponCode: appliedCoupon?.code ?? null,
    couponDiscountRate: appliedCoupon?.discountRate ?? undefined,
    couponDiscount,
  };
}

export function broadcastCart(items: CartItem[], source: "home" | "cart", type: CartActionType = "SYNC") {
  saveStoredCart(items);
  const channel = getChannel();
  if (channel) {
    const msg: CartSyncMessage = {
      type,
      items,
      timestamp: Date.now(),
      source,
    };
    channel.postMessage(msg);
  }
}

export function useCartSync(source: "home" | "cart" = "home") {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const syncCurrent = () => {
      const current = getStoredCart();
      setItems((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(current)) {
          return current;
        }
        return prev;
      });
      const currentCoupon = getStoredCoupon();
      setCoupon((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(currentCoupon)) {
          return currentCoupon;
        }
        return prev;
      });
    };

    setItems(getStoredCart());
    setCoupon(getStoredCoupon());
    setIsHydrated(true);

    // Cross-Tab and Cross-Port listeners
    window.addEventListener("focus", syncCurrent);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        syncCurrent();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Periodic sync (every 1s) for side-by-side cross-port browser windows
    const intervalId = setInterval(syncCurrent, 1000);

    const channel = getChannel();
    const handleChannelMessage = (event: MessageEvent<CartSyncMessage>) => {
      if (event.data && Array.isArray(event.data.items)) {
        setItems(normalizeCartItems(event.data.items.map(hydrateCartItem)));
      }
    };

    if (channel) {
      channel.addEventListener("message", handleChannelMessage);
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          const rawItems = Array.isArray(parsed) ? parsed : parsed.items;
          if (Array.isArray(rawItems)) {
            setItems(normalizeCartItems(rawItems.map(hydrateCartItem)));
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageEvent);

    const handleLocalUpdate = (e: Event) => {
      const custom = e as CustomEvent<CartItem[]>;
      if (custom.detail && Array.isArray(custom.detail)) {
        setItems(normalizeCartItems(custom.detail.map(hydrateCartItem)));
      }
    };
    window.addEventListener("local-cart-updated", handleLocalUpdate);

    return () => {
      window.removeEventListener("focus", syncCurrent);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(intervalId);
      if (channel) {
        channel.removeEventListener("message", handleChannelMessage);
      }
      window.removeEventListener("storage", handleStorageEvent);
      window.removeEventListener("local-cart-updated", handleLocalUpdate);
    };
  }, []);

  const addItem = useCallback((
    product: Product,
    quantity = 1,
    selectedAttributes?: SelectedAttributes,
    needsAttributeConfirmation?: boolean
  ) => {
    const current = getStoredCart();
    const unitPrice = calculateProductPrice(product, selectedAttributes);
    const originalUnitPrice = calculateProductOriginalPrice(product, selectedAttributes);
    const targetKey = getCartItemId(product.id, selectedAttributes);

    const existingIndex = current.findIndex(
      (i) => (i.cartItemId || getCartItemId(i.product.id, i.selectedAttributes)) === targetKey
    );

    let next: CartItem[];
    if (existingIndex > -1) {
      next = current.map((item, idx) => {
        if (idx === existingIndex) {
          return {
            ...item,
            quantity: item.quantity + quantity,
            unitPrice,
            originalUnitPrice: originalUnitPrice ?? item.originalUnitPrice,
            needsAttributeConfirmation:
              needsAttributeConfirmation !== undefined
                ? needsAttributeConfirmation
                : item.needsAttributeConfirmation,
          };
        }
        return item;
      });
    } else {
      next = [
        ...current,
        {
          cartItemId: targetKey,
          product,
          quantity,
          selected: true,
          selectedAttributes,
          unitPrice,
          originalUnitPrice,
          needsAttributeConfirmation,
        },
      ];
    }
    setItems(next);
    broadcastCart(next, source, "ADD_ITEM");
  }, [source]);

  const toggleItemSelection = useCallback((
    cartItemIdOrProductId: string | number,
    selected?: boolean
  ) => {
    const current = getStoredCart();
    const key = String(cartItemIdOrProductId);
    const isTarget = (i: CartItem) =>
      (i.cartItemId || getCartItemId(i.product.id, i.selectedAttributes)) === key ||
      String(i.product.id) === key;

    const next = current.map((i) => {
      if (isTarget(i)) {
        // Out of stock items can never be selected for purchase
        if (!isVariantInStock(i.product, i.selectedAttributes)) {
          return { ...i, selected: false };
        }
        const nextVal = selected !== undefined ? selected : i.selected === false ? true : false;
        return { ...i, selected: nextVal };
      }
      return i;
    });

    setItems(next);
    broadcastCart(next, source, "TOGGLE_ITEM_SELECTED" as CartActionType);
  }, [source]);

  const toggleAllSelection = useCallback((selectAll: boolean) => {
    const current = getStoredCart();
    const next = current.map((i) => {
      const inStock = isVariantInStock(i.product, i.selectedAttributes);
      return { ...i, selected: inStock ? selectAll : false };
    });
    setItems(next);
    broadcastCart(next, source, "TOGGLE_ALL_SELECTION" as CartActionType);
  }, [source]);

  const updateItemAttributes = useCallback((
    cartItemIdOrProductId: string | number,
    selectedAttributes: SelectedAttributes,
    needsAttributeConfirmation = false
  ) => {
    const current = getStoredCart();
    const key = String(cartItemIdOrProductId);
    const targetIndex = current.findIndex(
      (i) =>
        (i.cartItemId || getCartItemId(i.product.id, i.selectedAttributes)) === key ||
        String(i.product.id) === key
    );

    if (targetIndex === -1) return;

    const oldItem = current[targetIndex];
    const nextAttrs = { ...oldItem.selectedAttributes, ...selectedAttributes };
    const newCartItemId = getCartItemId(oldItem.product.id, nextAttrs);
    const unitPrice = calculateProductPrice(oldItem.product, nextAttrs);
    const originalUnitPrice = calculateProductOriginalPrice(oldItem.product, nextAttrs);

    // Smart Merge: If an item already exists with this newCartItemId, merge quantities
    const mergeIndex = current.findIndex(
      (i, idx) =>
        idx !== targetIndex &&
        (i.cartItemId || getCartItemId(i.product.id, i.selectedAttributes)) === newCartItemId
    );

    let next: CartItem[];
    if (mergeIndex > -1) {
      next = current
        .map((item, idx) => {
          if (idx === mergeIndex) {
            return {
              ...item,
              quantity: item.quantity + oldItem.quantity,
              unitPrice,
              originalUnitPrice,
              needsAttributeConfirmation,
            };
          }
          return item;
        })
        .filter((_, idx) => idx !== targetIndex);
    } else {
      next = current.map((item, idx) => {
        if (idx === targetIndex) {
          return {
            ...item,
            cartItemId: newCartItemId,
            selectedAttributes: nextAttrs,
            unitPrice,
            originalUnitPrice,
            needsAttributeConfirmation,
          };
        }
        return item;
      });
    }

    setItems(next);
    broadcastCart(next, source, "UPDATE_ATTRIBUTES");
  }, [source]);

  const removeItem = useCallback((cartItemIdOrProductId: string | number) => {
    const current = getStoredCart();
    const key = String(cartItemIdOrProductId);
    const next = current.filter(
      (i) =>
        (i.cartItemId || getCartItemId(i.product.id, i.selectedAttributes)) !== key &&
        String(i.product.id) !== key
    );
    setItems(next);
    broadcastCart(next, source, "REMOVE_ITEM");
  }, [source]);

  const updateQuantity = useCallback((cartItemIdOrProductId: string | number, quantity: number) => {
    const current = getStoredCart();
    const key = String(cartItemIdOrProductId);
    const isTarget = (i: CartItem) =>
      (i.cartItemId || getCartItemId(i.product.id, i.selectedAttributes)) === key ||
      String(i.product.id) === key;

    if (quantity <= 0) {
      const next = current.filter((i) => !isTarget(i));
      setItems(next);
      broadcastCart(next, source, "REMOVE_ITEM");
      return;
    }
    const next = current.map((i) => (isTarget(i) ? { ...i, quantity } : i));
    setItems(next);
    broadcastCart(next, source, "UPDATE_QUANTITY");
  }, [source]);

  const applyCoupon = useCallback((code: string): { success: boolean; message: string } => {
    const normalized = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS[normalized];
    if (!found) {
      return {
        success: false,
        message: "Geçersiz kupon kodu. (Örn: TREND10, TREND20, HOSGELDIN15)",
      };
    }
    const newCoupon: AppliedCoupon = {
      code: normalized,
      discountRate: found.discountRate,
      description: found.description,
    };
    setCoupon(newCoupon);
    saveStoredCoupon(newCoupon);
    return {
      success: true,
      message: `${newCoupon.code} kuponu başarıyla uygulandı! (${found.description})`,
    };
  }, []);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    saveStoredCoupon(null);
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    saveStoredCart([]);
    setCoupon(null);
    saveStoredCoupon(null);
    const channel = getChannel();
    if (channel) {
      const msg: CartSyncMessage = {
        type: "CLEAR_CART",
        items: [],
        timestamp: Date.now(),
        source,
      };
      channel.postMessage(msg);
    }
  }, [source]);

  const totals = calculateCartTotals(items, coupon);

  return {
    items,
    totals,
    coupon,
    applyCoupon,
    removeCoupon,
    addItem,
    removeItem,
    updateQuantity,
    updateItemAttributes,
    toggleItemSelection,
    toggleAllSelection,
    clearCart,
    isHydrated,
  };
}
