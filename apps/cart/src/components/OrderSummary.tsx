"use client";

import React, { useState } from "react";
import { ShieldCheck, Truck, ArrowRight, Trash2, Tag } from "lucide-react";
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
        <label htmlFor="coupon-code-input" className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
          <Tag className="w-3.5 h-3.5 text-indigo-600" />
          <span>İndirim Kodu</span>
        </label>

        {appliedCoupon ? (
          <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between gap-2 transition-all">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                %
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs text-emerald-950 uppercase tracking-wide truncate">
                    {appliedCoupon.code}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                    -%{appliedCoupon.discountRate}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 font-medium block truncate">
                  {appliedCoupon.description}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveCoupon}
              className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors cursor-pointer flex-shrink-0"
            >
              Kaldır
            </button>
          </div>
        ) : (
          <div>
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                id="coupon-code-input"
                type="text"
                value={couponInput}
                onChange={(e) => {
                  setCouponInput(e.target.value);
                  if (couponFeedback) setCouponFeedback(null);
                }}
                placeholder="Kupon Kodu (Örn: TREND10)"
                className={`flex-1 min-w-0 px-3 py-2 text-xs rounded-xl border transition-all uppercase placeholder:normal-case font-medium focus:outline-none ${
                  couponFeedback?.type === "error"
                    ? "border-rose-300 bg-rose-50/30 text-rose-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    : "border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-slate-800"
                }`}
              />
              <button
                type="submit"
                disabled={!couponInput.trim()}
                className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-slate-900 hover:bg-slate-800 text-white cursor-pointer active:scale-95 flex-shrink-0"
              >
                Uygula
              </button>
            </form>

            {couponFeedback && (
              <p
                className={`mt-1.5 text-[11px] font-medium transition-all ${
                  couponFeedback.type === "success" ? "text-emerald-600" : "text-rose-600"
                }`}
              >
                {couponFeedback.message}
              </p>
            )}

            {/* Quick Coupon Chip Suggestions */}
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-[10px] text-slate-400">
              <span className="font-medium text-slate-500">Mevcut Kuponlar:</span>
              <button
                type="button"
                onClick={() => {
                  setCouponInput("TREND10");
                  if (couponFeedback) setCouponFeedback(null);
                }}
                className="px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200/60 transition-colors cursor-pointer"
                title="TrendSphere %10 Kuponu"
              >
                TREND10 (%10)
              </button>
              <button
                type="button"
                onClick={() => {
                  setCouponInput("TREND20");
                  if (couponFeedback) setCouponFeedback(null);
                }}
                className="px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200/60 transition-colors cursor-pointer"
                title="TrendSphere %20 Kuponu"
              >
                TREND20 (%20)
              </button>
            </div>
          </div>
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
