"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ArrowRight, X, Bell } from "lucide-react";
import type { CartItem, SelectedAttributes } from "@repo/shared-types";
import {
  getProductAttributes,
  calculateProductPrice,
  isVariantInStock,
  getOptionStockDetail,
} from "@repo/shared-types";

interface AttributePromptModalProps {
  isOpen: boolean;
  unconfirmedItems: CartItem[];
  onConfirm: (updatedItems: { productId: number; attributes: SelectedAttributes }[]) => void;
  onClose: () => void;
}

export default function AttributePromptModal({
  isOpen,
  unconfirmedItems,
  onConfirm,
  onClose,
}: AttributePromptModalProps) {
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

  // Temporary state for the choices in the modal
  const [selections, setSelections] = useState<Record<number, SelectedAttributes>>(() => {
    const initial: Record<number, SelectedAttributes> = {};
    unconfirmedItems.forEach((item) => {
      const attrs = item.product.attributes || getProductAttributes(item.product);
      const itemMap: SelectedAttributes = {};
      attrs.forEach((attr) => {
        let chosen = item.selectedAttributes?.[attr.name] || attr.defaultValue || attr.options[0];
        // Ensure default choice is in stock if possible
        const stock = getOptionStockDetail(attr, chosen);
        if (!stock.inStock) {
          const firstInStock = attr.options.find((opt) => getOptionStockDetail(attr, opt).inStock);
          if (firstInStock) {
            chosen = firstInStock;
          }
        }
        itemMap[attr.name] = chosen;
      });
      initial[item.product.id] = itemMap;
    });
    return initial;
  });

  // Keep selections synced if unconfirmedItems change
  useEffect(() => {
    setSelections((prev) => {
      const next = { ...prev };
      unconfirmedItems.forEach((item) => {
        if (!next[item.product.id]) {
          const attrs = item.product.attributes || getProductAttributes(item.product);
          const itemMap: SelectedAttributes = {};
          attrs.forEach((attr) => {
            let chosen = item.selectedAttributes?.[attr.name] || attr.defaultValue || attr.options[0];
            const stock = getOptionStockDetail(attr, chosen);
            if (!stock.inStock) {
              const firstInStock = attr.options.find((opt) => getOptionStockDetail(attr, opt).inStock);
              if (firstInStock) {
                chosen = firstInStock;
              }
            }
            itemMap[attr.name] = chosen;
          });
          next[item.product.id] = itemMap;
        }
      });
      return next;
    });
  }, [unconfirmedItems]);

  if (!isOpen || !mounted || unconfirmedItems.length === 0) return null;

  const handleSelect = (productId: number, attrName: string, value: string) => {
    setSelections((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [attrName]: value,
      },
    }));
  };

  const hasAnyOutOfStock = unconfirmedItems.some((item) => {
    const currentAttrs = selections[item.product.id] || {};
    return !isVariantInStock(item.product, currentAttrs);
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAnyOutOfStock) return;
    const result = unconfirmedItems.map((item) => ({
      productId: item.product.id,
      attributes: selections[item.product.id] || {},
    }));
    onConfirm(result);
  };

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full p-4 sm:p-8 shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col transform animate-in zoom-in-95 duration-200">
        {/* Header - Clean with no icon as requested */}
        <div className="flex items-start justify-between mb-4 sm:mb-5">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Sipariş Öncesi Seçim Onayı
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Siparişinizi doğru hazırlayabilmemiz için lütfen ürün beden/boyut tercihinizi belirleyin.
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

        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1 mb-6">
            {unconfirmedItems.map((item) => {
              const attrs = item.product.attributes || getProductAttributes(item.product);
              const currentAttrs = selections[item.product.id] || {};
              const unitPrice = calculateProductPrice(item.product, currentAttrs);
              const originalUnitPrice = item.product.originalPrice
                ? calculateProductPrice({ ...item.product, price: item.product.originalPrice }, currentAttrs)
                : undefined;
              const priceDelta = Number((unitPrice - item.product.price).toFixed(2));
              const itemSubtotal = (unitPrice * item.quantity).toFixed(2);
              const inStock = isVariantInStock(item.product, currentAttrs);

              return (
                <div
                  key={item.product.id}
                  className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                    !inStock
                      ? "bg-rose-50/40 border-rose-200/80"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  {/* Product Card Top: Image + Title + Fixed Top-Right Stock Badge */}
                  <div className="flex items-start gap-3">
                    <div className="relative w-12 h-12 bg-white rounded-xl p-1.5 border border-slate-200/80 flex-shrink-0 flex items-center justify-center">
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        unoptimized
                        className={`object-contain p-1 ${!inStock ? "grayscale-[0.5]" : ""}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`text-xs font-bold truncate pr-1 ${
                            !inStock ? "line-through text-slate-400" : "text-slate-900"
                          }`}
                        >
                          {item.product.title}
                        </h4>
                        {/* Stock Badge - Fixed on Top Right */}
                        {inStock ? (
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

                      {/* Price Row: Current Price, Original Strikethrough, Discount % (-%30), Option Delta Badge */}
                      <div className="mt-1.5 flex items-baseline gap-2 flex-wrap">
                        <span
                          className={`text-sm font-black ${
                            !inStock ? "line-through text-slate-400" : "text-slate-900"
                          }`}
                        >
                          ${unitPrice.toFixed(2)}
                        </span>
                        {originalUnitPrice && originalUnitPrice > unitPrice && (
                          <>
                            <span className="text-xs text-slate-400 line-through font-medium">
                              ${originalUnitPrice.toFixed(2)}
                            </span>
                            {item.product.discountRate && (
                              <span className="text-xs text-slate-400 font-medium">
                                (-%{item.product.discountRate})
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
                          (Adet: {item.quantity} • Toplam: <strong className="text-slate-700 font-bold">${itemSubtotal}</strong>)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Attributes Selection */}
                  {attrs.map((attr) => (
                    <div key={attr.name} className="pt-2 border-t border-slate-200/60">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-700">
                          {attr.name} Seçiniz:
                        </span>
                        <span className="font-extrabold text-indigo-600 text-xs">
                          {currentAttrs[attr.name] || attr.defaultValue}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2.5">
                        {attr.options.map((opt) => {
                          const isSelected = (currentAttrs[attr.name] || attr.defaultValue) === opt;
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
                                handleSelect(item.product.id, attr.name, opt);
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
              );
            })}
          </div>

          {/* Out of Stock Warning if any */}
          {hasAnyOutOfStock && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
              <span>Seçilen seçeneklerden bazıları tükenmiştir. Lütfen mevcut bir varyant belirleyin.</span>
            </div>
          )}

          {/* Modal Footer - Single Arrow Icon as Requested */}
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
              disabled={hasAnyOutOfStock}
              className={`group inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all ${
                hasAnyOutOfStock
                  ? "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
                  : "bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white shadow-indigo-500/25 cursor-pointer"
              }`}
            >
              <span>{hasAnyOutOfStock ? "Tükenen Seçim Bulunuyor" : "Seçimleri Onayla ve Siparişi Tamamla"}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

