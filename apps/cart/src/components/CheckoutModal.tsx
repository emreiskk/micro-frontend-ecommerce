"use client";

import React from "react";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import type { CartTotals, CartItem } from "@repo/shared-types";

interface CheckoutModalProps {
  isOpen: boolean;
  totals: CartTotals;
  items?: CartItem[];
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, totals, items, onClose }: CheckoutModalProps) {
  if (!isOpen) return null;

  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center transform animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-4">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200/50 inline-block mb-2">
          Sipariş No: #{orderNumber}
        </span>

        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          Siparişiniz Başarıyla Alındı!
        </h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">
          Tebrikler! Toplam <strong>${totals.total.toFixed(2)}</strong> tutarındaki siparişiniz hazırlanıyor.
          Sepetiniz sıfırlandı ve tüm mikro-frontend servisleri ile senkronize edildi.
        </p>

        {/* Purchased Items with Attributes */}
        {items && items.length > 0 && (
          <div className="mt-5 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs max-h-36 overflow-y-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Satın Alınan Ürünler & Tercihler:
            </span>
            {items.map((i) => {
              const attrStr = i.selectedAttributes
                ? Object.entries(i.selectedAttributes)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")
                : null;
              return (
                <div key={i.product.id} className="flex justify-between items-center text-slate-700 pb-1.5 border-b border-slate-200/50 last:border-b-0 last:pb-0">
                  <div className="truncate pr-2">
                    <span className="font-semibold text-slate-900 block truncate">{i.product.title}</span>
                    {attrStr && <span className="text-[11px] text-indigo-600 font-semibold">{attrStr}</span>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="font-bold block text-slate-800">{i.quantity} Adet</span>
                    <span className="text-[11px] text-slate-500 font-semibold">${((i.unitPrice ?? i.product.price) * i.quantity).toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2.5 text-slate-600">
          <div className="flex justify-between">
            <span>Ürün Adedi:</span>
            <span className="font-semibold text-slate-900">{totals.totalCount} Adet</span>
          </div>
          <div className="flex justify-between">
            <span>Ara Toplam:</span>
            <span className="font-semibold text-slate-900">${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Kargo Durumu:</span>
            <span className={`font-semibold ${totals.shipping === 0 ? "text-emerald-600" : "text-slate-900"}`}>
              {totals.shipping === 0 ? "Ücretsiz Kargo ($0.00)" : "Standart Ücretli Kargo ($9.99)"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Vergi (%8):</span>
            <span className="font-semibold text-slate-900">${totals.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-200">
            <span className="font-bold text-slate-900">Toplam Ödenen Tutar:</span>
            <span className="font-black text-indigo-600 text-sm">${totals.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (typeof window !== "undefined") {
                if (window.location.port === "3001") {
                  window.location.href = "http://localhost:3000/";
                } else {
                  window.location.href = "/";
                }
              }
            }}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Alışverişe Devam Et</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
