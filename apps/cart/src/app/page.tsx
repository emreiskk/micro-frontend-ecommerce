"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCartSync, calculateCartTotals, saveStoredCart, broadcastCart } from "@repo/cart-sync";
import type { CartTotals, CartItem, SelectedAttributes } from "@repo/shared-types";
import { calculateProductPrice, isVariantInStock } from "@repo/shared-types";
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
    toggleItemSelection,
    removeItem,
    clearCart,
    isHydrated,
  } = useCartSync("cart");

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAttributePromptOpen, setIsAttributePromptOpen] = useState(false);
  const [completedOrderTotals, setCompletedOrderTotals] = useState<CartTotals | null>(null);
  const [completedOrderItems, setCompletedOrderItems] = useState<CartItem[]>([]);

  const proceedWithCheckout = (finalItems: CartItem[]) => {
    // Only in-stock and selected items can be purchased
    const selectedFinal = finalItems.filter(
      (i) => i.selected !== false && isVariantInStock(i.product, i.selectedAttributes)
    );
    if (selectedFinal.length === 0) return;

    // Remaining items that stay in cart (unselected or out of stock)
    const remainingItems = finalItems.filter(
      (i) => i.selected === false || !isVariantInStock(i.product, i.selectedAttributes)
    );
    const freshTotals = calculateCartTotals(selectedFinal);
    setCompletedOrderTotals(freshTotals);
    setCompletedOrderItems([...selectedFinal]);
    setIsCheckoutOpen(true);

    if (remainingItems.length > 0) {
      saveStoredCart(remainingItems);
      broadcastCart(remainingItems, "cart", "SYNC");
    } else {
      clearCart();
    }
  };

  const handleInitiateCheckout = () => {
    const selectedInStockItems = items.filter(
      (i) => i.selected !== false && isVariantInStock(i.product, i.selectedAttributes)
    );
    if (selectedInStockItems.length === 0) return;

    const unconfirmed = selectedInStockItems.filter((i) => i.needsAttributeConfirmation);
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
        const nextAttrs = { ...item.selectedAttributes, ...match.attributes };
        return {
          ...item,
          selectedAttributes: nextAttrs,
          needsAttributeConfirmation: false,
          unitPrice: calculateProductPrice(item.product, nextAttrs),
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

  const unconfirmedItems = items.filter((i) => i.needsAttributeConfirmation && i.selected !== false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 lg:pb-10">
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

      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
          Alışveriş Sepetim
          {items.length > 0 && (
            <span className="ml-2 font-bold text-slate-500 text-xl sm:text-2xl">
              ({totals.selectedCount} ürün)
            </span>
          )}
        </h1>
        {items.length > 0 && totals.totalCount !== totals.selectedCount && (
          <p className="text-xs text-slate-400 mt-1">
            Sepetinizde kayıtlı toplam {totals.totalCount} adet ürün bulunmaktadır.
          </p>
        )}
      </div>

      {items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-3.5 sm:space-y-4">
              {items.map((item) => (
                <CartItemCard
                  key={item.cartItemId || `${item.product.id}-${JSON.stringify(item.selectedAttributes)}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onUpdateAttributes={updateItemAttributes}
                  onToggleSelect={toggleItemSelection}
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

          {/* Mobile Sticky Checkout Action Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 font-medium">
                Ödenecek Tutar ({totals.selectedCount} ürün)
              </span>
              <span className="text-lg font-black text-slate-900 leading-tight">
                ${totals.total.toFixed(2)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleInitiateCheckout}
              disabled={totals.selectedCount === 0}
              className="h-11 px-5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/25 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Siparişi Tamamla</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </>
      ) : (
        /* Frameless Natural Empty State */
        <div className="py-14 sm:py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-xs mb-5">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Sepetinizde Hiç Ürün Yok
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
            TrendSphere ana mağazasındaki yüzlerce kaliteli ürünü keşfedin ve beğendiklerinizi sepetinize ekleyin.
          </p>
          <div className="mt-6">
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
              className="inline-flex items-center gap-2 h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
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
