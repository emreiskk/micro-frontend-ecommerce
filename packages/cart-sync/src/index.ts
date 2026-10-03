"use client";

import { useState, useEffect, useCallback } from "react";
import type { CartItem, CartTotals, CartSyncMessage, CartActionType, Product } from "@repo/shared-types";

export const CART_STORAGE_KEY = "ecommerce_cart_v1";
export const CART_CHANNEL_NAME = "ecommerce_cart_channel";
export const FREE_SHIPPING_THRESHOLD = 75;
export const TAX_RATE = 0.08;

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
function setCookieCart(items: CartItem[]): void {
  if (typeof document === "undefined") return;
  try {
    const serialized = encodeURIComponent(JSON.stringify(items));
    document.cookie = `${CART_STORAGE_KEY}=${serialized}; path=/; max-age=604800; SameSite=Lax`;
  } catch (e) {
    console.error("Failed to save cart to cookie", e);
  }
}

function getCookieCart(): CartItem[] | null {
  if (typeof document === "undefined") return null;
  try {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${CART_STORAGE_KEY})=([^;]*)`));
    if (match && match[3]) {
      const decoded = decodeURIComponent(match[3]);
      const parsed = JSON.parse(decoded);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error("Failed to read cart from cookie", e);
  }
  return null;
}

export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    // 1. Try LocalStorage
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setCookieCart(parsed);
        return parsed;
      }
    }

    // 2. Try Shared Cookie (Shared across :3000 and :3001)
    const cookieData = getCookieCart();
    if (cookieData && Array.isArray(cookieData) && cookieData.length > 0) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cookieData));
      } catch {}
      return cookieData;
    }
    return [];
  } catch {
    return [];
  }
}

export function saveStoredCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    setCookieCart(items);
    window.dispatchEvent(new CustomEvent("local-cart-updated", { detail: items }));
  } catch (e) {
    console.error("Failed to save cart to storage", e);
  }
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
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
        // Only update state if serialized data actually changed to prevent re-renders
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
          setItems(JSON.parse(e.newValue));
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

  const addItem = useCallback((product: Product, quantity = 1) => {
    const current = getStoredCart();
    const existingIndex = current.findIndex((i) => i.product.id === product.id);
    let next: CartItem[];
    if (existingIndex > -1) {
      next = current.map((item, idx) =>
        idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item
      );
    } else {
      next = [...current, { product, quantity }];
    }
    setItems(next);
    broadcastCart(next, source, "ADD_ITEM");
  }, [source]);

  const removeItem = useCallback((productId: number) => {
    const current = getStoredCart();
    const next = current.filter((i) => i.product.id !== productId);
    setItems(next);
    broadcastCart(next, source, "REMOVE_ITEM");
  }, [source]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    const current = getStoredCart();
    if (quantity <= 0) {
      const next = current.filter((i) => i.product.id !== productId);
      setItems(next);
      broadcastCart(next, source, "REMOVE_ITEM");
      return;
    }
    const next = current.map((i) =>
      i.product.id === productId ? { ...i, quantity } : i
    );
    setItems(next);
    broadcastCart(next, source, "UPDATE_QUANTITY");
  }, [source]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof document !== "undefined") {
      document.cookie = `${CART_STORAGE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    }
    broadcastCart([], source, "CLEAR_CART");
  }, [source]);

  const totals = calculateCartTotals(items);

  return {
    items,
    totals,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isHydrated,
  };
}
