"use client";

import React from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Layers, ShieldCheck } from "lucide-react";
import { useCartSync } from "@repo/cart-sync";

export default function CartNavbar() {
  const { totals, isHydrated } = useCartSync("cart");
  const count = isHydrated ? totals.totalCount : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                if (window.location.port === "3001") {
                  window.location.href = "http://localhost:3000/";
                } else {
                  window.location.href = "/";
                }
              }
            }}
            className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <ShoppingBag className="w-6 h-6" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-slate-900">
                TrendSphere
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Cart MFE
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500 block">
              Bağımsız Sepet Servisi (Port: 3001 | basePath: /cart)
            </span>
          </div>
        </div>

        {/* Back Link & Info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>Senkronizasyon: Real-Time Broadcast</span>
          </div>

          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                if (window.location.port === "3001") {
                  window.location.href = "http://localhost:3000/";
                } else {
                  window.location.href = "/";
                }
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Alışverişe Dön</span>
          </button>
        </div>
      </div>
    </header>
  );
}
