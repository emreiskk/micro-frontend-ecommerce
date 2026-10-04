"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Check, X, AlertCircle, Bell } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open to avoid background shifts & hairline artifacts
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const { product } = item;
  const attributes = product.attributes || getProductAttributes(product);

  const [tempAttributes, setTempAttributes] = useState<SelectedAttributes>(() => {
    const map: SelectedAttributes = {};
    attributes.forEach((attr) => {
      map[attr.name] = item.selectedAttributes?.[attr.name] || attr.defaultValue || attr.options[0];
    });
    return map;
  });

  if (!isOpen || !mounted) return null;

  const isSelectedVariantInStock = isVariantInStock(product, tempAttributes);
  const currentUnitPrice = calculateProductPrice(product, tempAttributes);
  const originalUnitPrice = product.originalPrice
    ? calculateProductPrice({ ...product, price: product.originalPrice }, tempAttributes)
    : undefined;
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

  const modalContent = (
    <div className="fixed -inset-4 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 transform animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Ürünü Düzenle
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Sepetinizdeki ürün tercihlerini güncelleyin
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Card: Fixed Top-Right Stock Badge + Price Row with Original Strikethrough & Non-Pink Discount */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6">
          <div className="flex items-start gap-3">
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
              <div className="flex items-start justify-between gap-2">
                <h4
                  className={`text-xs sm:text-sm font-bold truncate pr-1 ${
                    !isSelectedVariantInStock ? "line-through text-slate-400" : "text-slate-900"
                  }`}
                >
                  {product.title}
                </h4>
                {/* Fixed Top-Right Stock Badge */}
                {isSelectedVariantInStock ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Stokta Mevcut
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    Tükendi
                  </span>
                )}
              </div>

              {/* Price Row */}
              <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                <span
                  className={`text-sm sm:text-base font-black ${
                    !isSelectedVariantInStock ? "line-through text-slate-400" : "text-slate-900"
                  }`}
                >
                  ${currentUnitPrice.toFixed(2)}
                </span>
                {originalUnitPrice && originalUnitPrice > currentUnitPrice && (
                  <>
                    <span className="text-xs text-slate-400 line-through font-medium">
                      ${originalUnitPrice.toFixed(2)}
                    </span>
                    {product.discountRate && (
                      <span className="text-xs text-slate-400 font-medium">
                        (-%{product.discountRate})
                      </span>
                    )}
                  </>
                )}
                {priceDelta !== 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-50/80 text-indigo-600 border border-indigo-200/70">
                    <span>{priceDelta > 0 ? `+$${priceDelta.toFixed(2)}` : `-$${Math.abs(priceDelta).toFixed(2)}`}</span>
                    <span className="text-[9px] font-medium text-indigo-500/80">opsiyon</span>
                  </span>
                )}
                <span className="text-[11px] text-slate-400 font-medium">
                  (Adet: {item.quantity} • Toplam: <strong className="text-slate-700 font-bold">${currentTotal}</strong>)
                </span>
              </div>
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
                        disabled={!isOptInStock}
                        onClick={() => {
                          if (!isOptInStock) return;
                          handleSelect(attr.name, opt);
                        }}
                        className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          opt.length <= 3 ? "min-w-[42px]" : ""
                        } ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-102 border-2 border-indigo-600 cursor-pointer"
                            : isOptInStock
                            ? "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 cursor-pointer"
                            : "bg-slate-50/80 text-slate-400 border border-slate-200 cursor-not-allowed opacity-60"
                        }`}
                        title={!isOptInStock ? "Tükendi - Bu seçenek seçilemez" : undefined}
                      >
                        <span className="relative z-10">{opt}</span>

                        {/* Diagonal Out-of-Stock Line (Trendyol Style) */}
                        {!isOptInStock && (
                          <svg
                            className="absolute inset-0 w-full h-full pointer-events-none rounded-xl overflow-hidden"
                            style={{ width: "100%", height: "100%" }}
                          >
                            <line
                              x1="0%"
                              y1="100%"
                              x2="100%"
                              y2="0%"
                              stroke="currentColor"
                              strokeWidth={isSelected ? "1.5" : "1.2"}
                              className={isSelected ? "text-indigo-200" : "text-slate-300"}
                            />
                          </svg>
                        )}

                        {/* Top-Right Notification Bell Icon (Trendyol Style) */}
                        {!isOptInStock && (
                          <span
                            className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center shadow-xs transition-transform z-20 ${
                              isSelected
                                ? "bg-indigo-600 text-white ring-2 ring-white scale-110"
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
                            className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-lg transition-colors ${
                              isSelected
                                ? "bg-indigo-700/80 text-white border border-indigo-500/50"
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
            <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/70 text-rose-700 text-xs font-medium flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
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

  return createPortal(modalContent, document.body);
}

