"use client";

import React, { useState } from "react";
import Image from "next/image";
import { SlidersHorizontal, Check, X, Tag, AlertCircle, Bell } from "lucide-react";
import type { CartItem, SelectedAttributes } from "@repo/shared-types";
import {
  getProductAttributes,
  calculateProductPrice,
  isVariantInStock,
  getOptionStockDetail,
} from "@repo/shared-types";

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

  const isSelectedVariantInStock = isVariantInStock(product, tempAttributes);
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
    if (!isSelectedVariantInStock) return;
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
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm font-black text-slate-900">
                ${currentUnitPrice.toFixed(2)}
              </span>
              {priceDelta !== 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
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
                <div className="flex flex-wrap gap-2.5 pt-1.5">
                  {attr.options.map((opt) => {
                    const isSelected = (tempAttributes[attr.name] || attr.defaultValue) === opt;
                    const detail = attr.optionDetails?.find((d) => d.label === opt);
                    const delta = detail?.priceDelta;
                    const stockDetail = getOptionStockDetail(attr, opt);
                    const isOptInStock = stockDetail.inStock;

                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleSelect(attr.name, opt)}
                        className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                          opt.length <= 3 ? "min-w-[42px]" : ""
                        } ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-102 border-2 border-indigo-600"
                            : isOptInStock
                            ? "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                            : "bg-slate-50/80 text-slate-400 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                        }`}
                      >
                        <span className="relative z-10">{opt}</span>

                        {/* Diagonal Out-of-Stock Line (Trendyol Style) */}
                        {!isOptInStock && (
                          <svg
                            className="absolute inset-0 w-full h-full pointer-events-none rounded-xl overflow-hidden"
                            preserveAspectRatio="none"
                            viewBox="0 0 100 100"
                          >
                            <line
                              x1="0"
                              y1="100"
                              x2="100"
                              y2="0"
                              stroke="currentColor"
                              strokeWidth={isSelected ? "2" : "1.5"}
                              className={isSelected ? "text-white/40" : "text-slate-300"}
                            />
                          </svg>
                        )}

                        {/* Top-Right Notification Bell Icon (Trendyol Style) */}
                        {!isOptInStock && (
                          <span
                            className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center shadow-xs transition-transform z-20 ${
                              isSelected
                                ? "bg-amber-500 text-white ring-2 ring-white scale-110"
                                : "bg-slate-100 text-slate-500 border border-slate-200"
                            }`}
                            title="Tükendi"
                          >
                            <Bell className="w-2.5 h-2.5" />
                          </span>
                        )}

                        {/* Price Delta Badge */}
                        {delta !== undefined && delta !== 0 && (
                          <span
                            className={`relative z-10 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md transition-colors ${
                              isSelected
                                ? "bg-white/20 text-white border border-white/20"
                                : delta > 0
                                ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                                : "bg-emerald-50 text-emerald-600 border border-emerald-100"
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

          {/* Out of Stock Warning */}
          {!isSelectedVariantInStock && (
            <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>
                Seçtiğiniz bu varyant şu anda stoklarımızda tükenmiştir. Lütfen mevcut bir seçenek belirleyin.
              </span>
            </div>
          )}

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
              disabled={!isSelectedVariantInStock}
              className={`inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all ${
                isSelectedVariantInStock
                  ? "bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white shadow-indigo-500/25 cursor-pointer"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
              }`}
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
