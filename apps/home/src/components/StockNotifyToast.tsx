"use client";

import React, { useEffect } from "react";
import { Bell, CheckCircle2, X } from "lucide-react";
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
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white rounded-2xl shadow-2xl border border-amber-200 p-4 transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl shadow-md shadow-amber-500/25 flex-shrink-0">
          <Bell className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h4 className="text-sm font-bold text-slate-900">Stok Bildirimi Oluşturuldu!</h4>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Aktif
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-700 truncate mt-0.5">{product.title}</p>
          {variantSummary && (
            <p className="text-[11px] text-amber-600 font-semibold truncate mt-0.5">
              {variantSummary}
            </p>
          )}
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            Bu ürün stoklarımıza girdiği an bilgilendirileceksiniz.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg border border-amber-200 transition-colors cursor-pointer"
            >
              Tamam, Anladım
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
