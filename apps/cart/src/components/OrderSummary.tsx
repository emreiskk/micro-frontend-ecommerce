"use client";

import React from "react";
import { ShieldCheck, Truck, ArrowRight, Trash2 } from "lucide-react";
import type { CartTotals } from "@repo/shared-types";

interface OrderSummaryProps {
  totals: CartTotals;
  onCheckout: () => void;
  onClearCart: () => void;
}

export default function OrderSummary({ totals, onCheckout, onClearCart }: OrderSummaryProps) {
  const freeShippingProgress = Math.min(
    100,
    (totals.subtotal / totals.freeShippingThreshold) * 100
  );

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm sticky top-28">
      <h3 className="text-lg font-black text-slate-900 tracking-tight mb-4">
        Sipariş Özeti
      </h3>

      {/* Free Shipping Progress - Clean & Minimal Inline */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1.5 text-slate-600 font-medium">
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            {totals.selectedCount === 0 ? (
              <span className="text-slate-500">Siparişe dahil ürün seçilmedi</span>
            ) : totals.shipping === 0 ? (
              <span className="font-semibold text-emerald-600">Kargonuz ücretsiz!</span>
            ) : (
              <span>
                Kargo bedava için <strong className="font-bold text-slate-900">${totals.remainingForFreeShipping.toFixed(2)}</strong> kaldı
              </span>
            )}
          </span>
          <span className="text-[11px] font-medium text-slate-400">
            %{totals.selectedCount === 0 ? 0 : Math.round(freeShippingProgress)}
          </span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              totals.selectedCount === 0
                ? "bg-slate-300"
                : totals.shipping === 0
                ? "bg-emerald-500"
                : "bg-indigo-600"
            }`}
            style={{ width: `${totals.selectedCount === 0 ? 0 : freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-3 text-xs text-slate-600 pb-5 border-b border-slate-100">
        <div className="flex justify-between">
          <span>Ara Toplam ({totals.selectedCount} ürün):</span>
          <span className="font-semibold text-slate-900">${totals.subtotal.toFixed(2)}</span>
        </div>
        {totals.totalSavings > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Kampanya Tasarrufu:</span>
            <span className="font-bold">-${totals.totalSavings.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span>Kargo:</span>
          <span className="font-semibold">
            {totals.selectedCount === 0 ? (
              <span className="text-slate-400 font-medium">$0.00</span>
            ) : totals.shipping === 0 ? (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200/60 font-semibold uppercase text-[10px] px-2 py-0.5 rounded-lg">
                Ücretsiz
              </span>
            ) : (
              `$${totals.shipping.toFixed(2)}`
            )}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Vergi (%8 KDV):</span>
          <span className="font-semibold text-slate-900">${totals.tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}
      <div className="py-5 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 block font-medium">Genel Toplam</span>
          <span className="text-xs text-slate-400">Vergiler ve kargo dahil</span>
        </div>
        <span className="text-2xl font-black text-slate-950 tracking-tight">
          ${totals.total.toFixed(2)}
        </span>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button
          onClick={onCheckout}
          disabled={totals.selectedCount === 0}
          className={`w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm transition-all ${
            totals.selectedCount === 0
              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
              : "bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white shadow-lg shadow-indigo-500/25 cursor-pointer"
          }`}
        >
          <span>{totals.selectedCount === 0 ? "Lütfen Ürün Seçiniz" : "Siparişi Tamamla"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onClearCart}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-slate-400 hover:text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Sepeti Boşalt</span>
        </button>
      </div>

      {/* Safe badge */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span>256-Bit SSL Güvenli Ödeme Altyapısı</span>
      </div>
    </div>
  );
}
