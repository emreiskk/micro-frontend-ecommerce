"use client";

import React from "react";
import { ShieldCheck, Truck, ArrowRight, Trash2, Check } from "lucide-react";
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

      {/* Free Shipping Progress & Status */}
      {totals.shipping === 0 ? (
        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-center gap-3 text-xs mb-6 animate-in fade-in duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
            <Check className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-emerald-950 leading-tight">
              Tebrikler! Kargo Ücretsiz
            </p>
            <p className="text-[11px] text-emerald-700 mt-0.5 leading-snug">
              ${totals.freeShippingThreshold} barajını aştınız, bu siparişinizde kargo bedava.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 mb-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="flex items-center gap-1.5 font-bold text-slate-800">
              <Truck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ücretsiz Kargo</span>
            </span>
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              ${totals.remainingForFreeShipping.toFixed(2)} kaldı
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Sepetinize <strong className="text-slate-800 font-semibold">${totals.remainingForFreeShipping.toFixed(2)}</strong> değerinde ürün daha ekleyin, kargo bedava olsun!
          </p>
        </div>
      )}

      {/* Line Items */}
      <div className="space-y-3 text-xs text-slate-600 pb-5 border-b border-slate-100">
        <div className="flex justify-between">
          <span>Ara Toplam ({totals.totalCount} ürün):</span>
          <span className="font-semibold text-slate-900">${totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Kargo:</span>
          <span className="font-semibold">
            {totals.shipping === 0 ? (
              <span className="text-emerald-600 font-bold uppercase text-[11px]">Ücretsiz</span>
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
          className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all"
        >
          <span>Siparişi Tamamla</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onClearCart}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-slate-400 hover:text-rose-600 text-xs font-semibold transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Sepeti Boşalt</span>
        </button>
      </div>

      {/* Safe badge */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
        <ShieldCheck className="w-4 h-4 text-emerald-500" />
        <span>256-Bit SSL Güvenli Ödeme Altyapısı</span>
      </div>
    </div>
  );
}
