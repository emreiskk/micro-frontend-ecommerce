"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SlidersHorizontal, Check, X, Tag } from "lucide-react";
import type { CartItem, SelectedAttributes } from "@repo/shared-types";
import { getProductAttributes, calculateProductPrice } from "@repo/shared-types";

interface EditVariantModalProps {
  isOpen: boolean;
  item: CartItem;
  onSave: (newAttributes: SelectedAttributes) => void;
  onClose: () => void;
}

export default function EditVariantModal({
  isOpen,
  item,
  onSave,
  onClose,
}: EditVariantModalProps) {
  const { product } = item;
  const attributes = product.attributes || getProductAttributes(product);

  const [tempAttributes, setTempAttributes] = useState<SelectedAttributes>(() => {
    const map: SelectedAttributes = {};
    attributes.forEach((attr) => {
      map[attr.name] = item.selectedAttributes?.[attr.name] || attr.defaultValue || attr.options[0];
    });
    return map;
  });

  if (!isOpen) return null;

  const currentUnitPrice = calculateProductPrice(product, tempAttributes);
  const currentTotal = (currentUnitPrice * item.quantity).toFixed(2);
  const priceDelta = Number((currentUnitPrice - product.price).toFixed(2));

  const handleSelect = (attrName: string, value: string) => {
    setTempAttributes((prev) => ({
      ...prev,
      [attrName]: value,
    }));
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(tempAttributes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 transform animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Varyantı Düzenle
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sepetinizdeki ürün tercihlerini güncelleyin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Preview & Dynamic Price */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3 mb-6">
          <div className="relative w-14 h-14 bg-white rounded-xl p-1.5 border border-slate-200/80 flex-shrink-0 flex items-center justify-center">
            <Image
              src={product.image}
              alt={product.title}
              fill
              unoptimized
              className="object-contain p-1"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">
              {product.title}
            </h4>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-sm font-black text-slate-900">
                ${currentUnitPrice.toFixed(2)}
              </span>
              {priceDelta !== 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    priceDelta > 0
                      ? "text-indigo-700 bg-indigo-50 border border-indigo-200"
                      : "text-emerald-700 bg-emerald-50 border border-emerald-200"
                  }`}
                >
                  {priceDelta > 0 ? `+$${priceDelta.toFixed(2)}` : `-$${Math.abs(priceDelta).toFixed(2)}`}
                </span>
              )}
              <span className="text-[11px] text-slate-400 font-medium">
                ({item.quantity} adet: ${currentTotal})
              </span>
            </div>
          </div>
        </div>

        {/* Attributes Form */}
        <form onSubmit={handleConfirm} className="space-y-4">
          <div className="max-h-[50vh] overflow-y-auto space-y-4 pr-1">
            {attributes.map((attr) => (
              <div key={attr.name} className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">
                    {attr.name}:
                  </span>
                  <span className="font-extrabold text-indigo-600">
                    {tempAttributes[attr.name] || attr.defaultValue}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {attr.options.map((opt) => {
                    const isSelected = (tempAttributes[attr.name] || attr.defaultValue) === opt;
                    const detail = attr.optionDetails?.find((d) => d.label === opt);
                    const delta = detail?.priceDelta;

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelect(attr.name, opt)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-102 border-2 border-indigo-600"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <span>{opt}</span>
                        {delta !== undefined && delta !== 0 && (
                          <span
                            className={`text-[10px] ${
                              isSelected ? "text-indigo-100" : "text-slate-500 font-normal"
                            }`}
                          >
                            {delta > 0 ? `+$${delta}` : `-$${Math.abs(delta)}`}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Seçimi Kaydet</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
