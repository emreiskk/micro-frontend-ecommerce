"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AlertCircle, Check, ArrowRight, X } from "lucide-react";
import type { CartItem, SelectedAttributes } from "@repo/shared-types";
import { getProductAttributes, calculateProductPrice } from "@repo/shared-types";

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
  // Temporary state for the choices in the modal
  const [selections, setSelections] = useState<Record<number, SelectedAttributes>>(() => {
    const initial: Record<number, SelectedAttributes> = {};
    unconfirmedItems.forEach((item) => {
      const attrs = item.product.attributes || getProductAttributes(item.product);
      const itemMap: SelectedAttributes = {};
      attrs.forEach((attr) => {
        itemMap[attr.name] = item.selectedAttributes?.[attr.name] || attr.defaultValue || attr.options[0];
      });
      initial[item.product.id] = itemMap;
    });
    return initial;
  });

  if (!isOpen || unconfirmedItems.length === 0) return null;

  const handleSelect = (productId: number, attrName: string, value: string) => {
    setSelections((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [attrName]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = unconfirmedItems.map((item) => ({
      productId: item.product.id,
      attributes: selections[item.product.id] || {},
    }));
    onConfirm(result);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 transform animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-sm">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Sipariş Öncesi Seçim Onayı
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Siparişinizi doğru hazırlayabilmemiz için lütfen ürün beden/boyut tercihinizi belirleyin.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[60vh] overflow-y-auto space-y-4 pr-1 mb-6">
            {unconfirmedItems.map((item) => {
              const attrs = item.product.attributes || getProductAttributes(item.product);
              const currentAttrs = selections[item.product.id] || {};

              return (
                <div
                  key={item.product.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 bg-white rounded-xl p-1.5 border border-slate-200/80 flex-shrink-0 flex items-center justify-center">
                      <Image
                        src={item.product.image}
                        alt={item.product.title}
                        fill
                        unoptimized
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {item.product.title}
                      </h4>
                      {(() => {
                        const unitPrice = calculateProductPrice(item.product, currentAttrs);
                        const itemSubtotal = (unitPrice * item.quantity).toFixed(2);
                        return (
                          <span className="text-[11px] text-slate-500 font-medium">
                            Adet: {item.quantity} • Birim: <strong className="text-slate-800">${unitPrice.toFixed(2)}</strong> • Toplam: <strong className="text-indigo-600">${itemSubtotal}</strong>
                          </span>
                        );
                      })()}
                    </div>
                  </div>

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
                      <div className="flex flex-wrap gap-1.5">
                        {attr.options.map((opt) => {
                          const isSelected = (currentAttrs[attr.name] || attr.defaultValue) === opt;
                          const detail = attr.optionDetails?.find((d) => d.label === opt);
                          const delta = detail?.priceDelta;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleSelect(item.product.id, attr.name, opt)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                isSelected
                                  ? "bg-indigo-600 text-white shadow-sm scale-105 border-2 border-indigo-600"
                                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              <span>{opt}</span>
                              {delta !== undefined && delta !== 0 && (
                                <span
                                  className={`text-[10px] ${
                                    isSelected ? "text-indigo-100" : "text-slate-500 font-semibold"
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Seçimleri Onayla ve Siparişi Tamamla</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
