"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCartSync } from "@repo/cart-sync";
import type { CartTotals, CartItem, SelectedAttributes } from "@repo/shared-types";
import CartItemCard from "@/components/CartItemCard";
import OrderSummary from "@/components/OrderSummary";
import CheckoutModal from "@/components/CheckoutModal";
import AttributePromptModal from "@/components/AttributePromptModal";

export default function CartPage() {
  const {
    items,
    totals,
    updateQuantity,
    updateItemAttributes,
    removeItem,
    clearCart,
    isHydrated,
  } = useCartSync("cart");

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAttributePromptOpen, setIsAttributePromptOpen] = useState(false);
  const [completedOrderTotals, setCompletedOrderTotals] = useState<CartTotals | null>(null);
  const [completedOrderItems, setCompletedOrderItems] = useState<CartItem[]>([]);

  const proceedWithCheckout = (finalItems: CartItem[]) => {
    setCompletedOrderTotals({ ...totals });
    setCompletedOrderItems([...finalItems]);
    setIsCheckoutOpen(true);
    clearCart();
  };

  const handleInitiateCheckout = () => {
    const unconfirmed = items.filter((i) => i.needsAttributeConfirmation);
    if (unconfirmed.length > 0) {
      setIsAttributePromptOpen(true);
      return;
    }
    proceedWithCheckout(items);
  };

  const handleConfirmAttributes = (
    updated: { productId: number; attributes: SelectedAttributes }[]
  ) => {
    updated.forEach(({ productId, attributes }) => {
      updateItemAttributes(productId, attributes, false);
    });

    const updatedList = items.map((item) => {
      const match = updated.find((u) => u.productId === item.product.id);
      if (match) {
        return {
          ...item,
          selectedAttributes: { ...item.selectedAttributes, ...match.attributes },
          needsAttributeConfirmation: false,
        };
      }
      return item;
    });

    setIsAttributePromptOpen(false);
    proceedWithCheckout(updatedList);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutOpen(false);
    setCompletedOrderTotals(null);
    setCompletedOrderItems([]);
  };

  if (!isHydrated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-500">Sepet verisi senkronize ediliyor...</p>
      </div>
    );
  }

  const unconfirmedItems = items.filter((i) => i.needsAttributeConfirmation);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <CheckoutModal
        isOpen={isCheckoutOpen}
        totals={completedOrderTotals || totals}
        items={completedOrderItems}
        onClose={handleCloseCheckout}
      />

      <AttributePromptModal
        isOpen={isAttributePromptOpen}
        unconfirmedItems={unconfirmedItems}
        onConfirm={handleConfirmAttributes}
        onClose={() => setIsAttributePromptOpen(false)}
      />

      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-950 tracking-tight">
          Alışveriş Sepeti
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          {items.length > 0
            ? `Sepetinizde toplam ${totals.totalCount} adet ürün bulunmaktadır.`
            : "Sepetiniz henüz boş."}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemCard
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onUpdateAttributes={updateItemAttributes}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Sticky Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              totals={totals}
              onCheckout={handleInitiateCheckout}
              onClearCart={clearCart}
            />
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 sm:p-16 border border-slate-200/80 shadow-sm text-center max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/10 mb-6">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sepetinizde Hiç Ürün Yok
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            TrendSphere ana mağazasındaki yüzlerce kaliteli ürünü keşfedin ve beğendiklerinizi sepetinize ekleyin.
          </p>
          <div className="mt-8">
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  if (window.location.port === "3001") {
                    window.location.href = "http://localhost:3000/";
                  } else {
                    window.location.href = "/";
                  }
                }
              }}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Alışverişe Başla</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
