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

  const defaultAttrs = React.useMemo(() => {
    const map: Record<string, string> = {};
    if (product.attributes && product.attributes.length > 0) {
      product.attributes.forEach((attr) => {
        map[attr.name] = attr.defaultValue || attr.options[0];
      });
    }
    return map;
  }, [product.attributes]);

  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>(defaultAttrs);

  const handleAdd = () => {
    setIsAdding(true);
    addItem(product, quantity, selectedAttributes, false);
    setToastVisible(true);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="mt-6">
      {/* Variant Selector (Beden, Boyut, Kapasite vs.) */}
      {product.attributes && product.attributes.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
          {product.attributes.map((attr) => (
            <div key={attr.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  {attr.name} Seçimi:{" "}
                  <span className="text-indigo-600 font-extrabold ml-1">
                    {selectedAttributes[attr.name] || attr.defaultValue}
                  </span>
                </span>
                <span className="text-[11px] font-semibold text-emerald-600">Stokta Var</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {attr.options.map((opt) => {
                  const isSelected = (selectedAttributes[attr.name] || attr.defaultValue) === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setSelectedAttributes((prev) => ({ ...prev, [attr.name]: opt }))
                      }
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-105 border-2 border-indigo-600"
                          : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

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
