"use client";

import React, { useState } from "react";
import { ShoppingCart, Check, Plus, Minus } from "lucide-react";
import type { Product } from "@repo/shared-types";
import { useCartSync } from "@repo/cart-sync";
import Toast from "@/components/Toast";

export default function ProductDetailActions({ product }: { product: Product }) {
  const { addItem } = useCartSync("home");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    addItem(product, quantity);
    setToastVisible(true);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="mt-6">
      <Toast product={toastVisible ? product : null} onClose={() => setToastVisible(false)} />

      <div className="flex items-center gap-4">
        {/* Quantity selector */}
        <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
            aria-label="Azalt"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-10 text-center font-bold text-sm text-slate-800">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
            aria-label="Artır"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAdd}
          disabled={isAdding}
          className={`flex-1 inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg transition-all ${
            isAdding
              ? "bg-emerald-600 text-white shadow-emerald-500/20"
              : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 active:scale-98"
          }`}
        >
          {isAdding ? (
            <>
              <Check className="w-5 h-5 animate-in zoom-in" />
              <span>Sepete Eklendi!</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              <span>Sepete Ekle (${(product.price * quantity).toFixed(2)})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
