"use client";

import React, { useState } from "react";
import { ShieldCheck, Truck, ArrowRight, Trash2, Check, X } from "lucide-react";
import type { CartTotals, AppliedCoupon } from "@repo/shared-types";

interface OrderSummaryProps {
  totals: CartTotals;
  appliedCoupon?: AppliedCoupon | null;
  onApplyCoupon?: (code: string) => { success: boolean; message: string };
  onRemoveCoupon?: () => void;
  onCheckout: () => void;
  onClearCart: () => void;
}

export default function OrderSummary({
  totals,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onCheckout,
  onClearCart,
}: OrderSummaryProps) {
  const [couponInput, setCouponInput] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    if (totals.selectedCount === 0) {
      setCouponFeedback({
        type: "error",
        message: "Kupon uygulamak için lütfen sepette en az 1 ürün seçin.",
      });
      return;
    }
    if (!onApplyCoupon) return;
    const res = onApplyCoupon(couponInput);
    if (res.success) {
      setCouponFeedback({ type: "success", message: res.message });
      setCouponInput("");
    } else {
      setCouponFeedback({ type: "error", message: res.message });
    }
  };

  const handleRemoveCoupon = () => {
    onRemoveCoupon?.();
    setCouponFeedback(null);
    setCouponInput("");
  };

  const freeShippingProgress = Math.min(
    100,
    (totals.subtotal / totals.freeShippingThreshold) * 100
  );

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/80 shadow-sm sticky top-28">
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
            <span>Mağaza İndirimi:</span>
            <span className="font-bold">-${totals.totalSavings.toFixed(2)}</span>
          </div>
        )}
        {totals.couponDiscount && totals.couponDiscount > 0 ? (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Kupon İndirimi ({totals.couponCode}):</span>
            <span className="font-bold">-${totals.couponDiscount.toFixed(2)}</span>
          </div>
        ) : null}
        <div className="flex justify-between items-center">
          <span>Kargo:</span>
          {totals.selectedCount === 0 ? (
            <span className="text-slate-400 font-medium">$0.00</span>
          ) : totals.shipping === 0 ? (
            <span className="text-emerald-600 font-semibold">
              Ücretsiz
            </span>
          ) : (
            <span className="font-semibold text-slate-900">${totals.shipping.toFixed(2)}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span>Vergi (%8 KDV):</span>
          <span className="font-semibold text-slate-900">${totals.tax.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon Code Section */}
      <div className="py-4 border-b border-slate-100">
        <label htmlFor="coupon-code-input" className="block text-xs font-bold text-slate-800 mb-2">
          İndirim Kodu
        </label>

        <form
          onSubmit={appliedCoupon ? (e) => { e.preventDefault(); handleRemoveCoupon(); } : handleApplyCoupon}
          className="flex gap-2"
        >
          <div className="relative flex-1 min-w-0">
            <input
              id="coupon-code-input"
              type="text"
              readOnly={!!appliedCoupon}
              value={appliedCoupon ? appliedCoupon.code : couponInput}
              onChange={(e) => {
                if (appliedCoupon) return;
                setCouponInput(e.target.value);
                if (couponFeedback) setCouponFeedback(null);
              }}
              placeholder="TrendSphere Kupon Kodu"
              className={`w-full px-3.5 py-2.5 text-xs rounded-xl border transition-all duration-200 uppercase placeholder:normal-case font-medium focus:outline-none placeholder:text-slate-400 ${
                appliedCoupon
                  ? "border-emerald-300 bg-emerald-50/40 text-emerald-950 font-bold pr-8"
                  : couponFeedback?.type === "error"
                  ? "border-rose-300 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10"
                  : "border-slate-200 bg-slate-50/60 hover:border-slate-300 focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 text-slate-800"
              }`}
            />
            {appliedCoupon && (
              <button
                type="button"
                onClick={handleRemoveCoupon}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer p-0.5"
                title="Kuponu Kaldır"
                aria-label="Kuponu Kaldır"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {appliedCoupon ? (
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-all duration-200 cursor-pointer flex items-center gap-1.5 flex-shrink-0 group/btn shadow-xs"
              title="Kuponu kaldırmak için tıklayın"
            >
              <Check className="w-3.5 h-3.5 group-hover/btn:hidden text-emerald-600" />
              <X className="w-3.5 h-3.5 hidden group-hover/btn:inline text-rose-600" />
              <span className="group-hover/btn:hidden">Uygulandı</span>
              <span className="hidden group-hover/btn:inline">Kaldır</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={!couponInput.trim()}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white shadow-xs cursor-pointer flex-shrink-0"
            >
              Uygula
            </button>
          )}
        </form>

        {couponFeedback?.type === "error" && (
          <p className="mt-1.5 text-[11px] font-medium text-rose-600 animate-in fade-in">
            {couponFeedback.message}
          </p>
        )}
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
