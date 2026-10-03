"use client";

import { useState, useEffect, useCallback } from "react";
import {
  type CartItem,
  type CartTotals,
  type CartSyncMessage,
  type CartActionType,
  type Product,
  type SelectedAttributes,
  calculateProductPrice,
  CANONICAL_PRODUCT_TITLES,
  getCartItemId,
} from "@repo/shared-types";

export const CART_STORAGE_KEY = "ecommerce_cart_v1";
export const CART_CHANNEL_NAME = "ecommerce_cart_channel";
export const FREE_SHIPPING_THRESHOLD = 75;
export const TAX_RATE = 0.08;

export interface StoredCartPayload {
  items: CartItem[];
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
function setCookieCart(items: CartItem[], timestamp: number): void {
  if (typeof document === "undefined") return;
  try {
    const payload: StoredCartPayload = { items, timestamp };
    const serialized = encodeURIComponent(JSON.stringify(payload));
    document.cookie = `${CART_STORAGE_KEY}=${serialized}; path=/; max-age=604800; SameSite=Lax`;
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
    return {
      ...item,
      cartItemId,
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

    // If both exist, the newer timestamp wins (resolves deletions/clear cart resurrection)
    if (local && cookie) {
      if (local.timestamp >= cookie.timestamp) {
        if (local.timestamp > cookie.timestamp) {
          setCookieCart(normalizeCartItems(local.items), local.timestamp);
        }
        return normalizeCartItems(local.items);
      } else {
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cookie));
        } catch {}
        return normalizeCartItems(cookie.items);
      }
    }

    if (local) {
      setCookieCart(normalizeCartItems(local.items), local.timestamp);
      return normalizeCartItems(local.items);
    }

    if (cookie) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cookie));
      } catch {}
      return normalizeCartItems(cookie.items);
    }

    return [];
  } catch {
    return [];
  }
}

export function saveStoredCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    const timestamp = Date.now();
    const payload: StoredCartPayload = { items, timestamp };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
    setCookieCart(items, timestamp);
    window.dispatchEvent(new CustomEvent("local-cart-updated", { detail: items }));
  } catch (e) {
    console.error("Failed to save cart to storage", e);
  }
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce(
    (acc, item) => acc + (item.unitPrice ?? item.product.price) * item.quantity,
    0
  );
  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 9.99;
  const total = Number((subtotal + tax + shipping).toFixed(2));
  const remainingForFreeShipping = Math.max(0, Number((FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)));

  return {
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    shipping,
    total,
    totalCount,
    freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
    remainingForFreeShipping,
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
    };

    setItems(getStoredCart());
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
        setItems(event.data.items);
      }
    };

    if (channel) {
      channel.addEventListener("message", handleChannelMessage);
    }

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === CART_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          } else if (parsed && Array.isArray(parsed.items)) {
            setItems(parsed.items);
          }
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageEvent);

    const handleLocalUpdate = (e: Event) => {
      const custom = e as CustomEvent<CartItem[]>;
      if (custom.detail) {
        setItems(custom.detail);
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
          selectedAttributes,
          unitPrice,
          needsAttributeConfirmation,
        },
      ];
    }
    setItems(next);
    broadcastCart(next, source, "ADD_ITEM");
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

  const clearCart = useCallback(() => {
    setItems([]);
    saveStoredCart([]);
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

  const totals = calculateCartTotals(items);

  return {
    items,
    totals,
    addItem,
    removeItem,
    updateQuantity,
    updateItemAttributes,
    clearCart,
    isHydrated,
  };
}
