"use client";

import React, { useEffect } from "react";
import { Bell, Check, X } from "lucide-react";
import type { Product, SelectedAttributes } from "@repo/shared-types";

interface StockNotifyToastProps {
  product: Product | null;
  selectedAttributes?: SelectedAttributes;
  onClose: () => void;
}

export default function StockNotifyToast({
  product,
  selectedAttributes,
  onClose,
}: StockNotifyToastProps) {
  useEffect(() => {
    if (!product) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [product, onClose]);

  if (!product) return null;

  const variantSummary = selectedAttributes
    ? Object.entries(selectedAttributes)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" • ")
    : null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-auto sm:max-w-md z-50 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3.5 sm:p-4 transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0">
          <Bell className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900">Stok Bildirimi Talebi Alındı!</h4>
          <p className="text-xs text-slate-500 truncate mt-0.5">{product.title}</p>
          {variantSummary && (
            <p className="text-[11px] text-slate-400 truncate mt-0.5">
              Seçilen: {variantSummary}
            </p>
          )}
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              Anladım
            </button>
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
            >
              Alışverişe Devam Et
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
