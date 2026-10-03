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

export function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("local-cart-updated", { detail: items }));
  } catch (e) {
    console.error("Failed to save cart to localStorage", e);
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
    setItems(getStoredCart());
    setIsHydrated(true);

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
