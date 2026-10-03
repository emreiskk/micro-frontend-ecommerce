"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { CartTotals } from "@repo/shared-types";

interface CheckoutModalProps {
  isOpen: boolean;
  totals: CartTotals;
  onClose: () => void;
}

export default function CheckoutModal({ isOpen, totals, onClose }: CheckoutModalProps) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn("Confetti triggered", e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const orderNumber = Math.floor(100000 + Math.random() * 900000);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-slate-100 text-center transform animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-5">
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

        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left text-xs space-y-2 text-slate-600">
          <div className="flex justify-between">
            <span>Ürün Adedi:</span>
            <span className="font-semibold text-slate-900">{totals.totalCount} Adet</span>
          </div>
          <div className="flex justify-between">
            <span>Ödenen Tutar:</span>
            <span className="font-bold text-slate-900">${totals.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Kargo Durumu:</span>
            <span className="font-semibold text-emerald-600">
              {totals.shipping === 0 ? "Ücretsiz Kargo" : "$9.99 Standart Kargo"}
            </span>
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
