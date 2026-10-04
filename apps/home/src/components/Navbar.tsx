"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Layers } from "lucide-react";
import { useCartSync } from "@repo/cart-sync";

export default function Navbar() {
  const { totals, isHydrated } = useCartSync("home");
  const count = isHydrated ? totals.totalCount : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
              TrendSphere
              <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200/50">
                Home MFE
              </span>
            </span>
            <span className="text-[11px] font-medium text-slate-500 block">
              Mikro Frontend Ana Servisi (Port: 3000)
            </span>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Multi-Zone: Next.js App Router</span>
          </div>

          {/* Cart Button */}
          <Link
            href="/cart"
            id="cart-button"
            className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white transition-all duration-200 shadow-md hover:shadow-indigo-500/25 group"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {count > 0 && (
                <span
                  id="cart-count-badge"
                  className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full text-xs font-bold flex items-center justify-center border-2 border-slate-900 shadow-sm animate-bounce"
                >
                  {count}
                </span>
              )}
            </div>
            <div className="hidden md:flex flex-col items-start leading-none">
              <span className="text-[10px] text-slate-400 group-hover:text-indigo-200 font-medium">Sepetim</span>
              <span className="text-xs font-bold mt-0.5">
                ${isHydrated ? totals.subtotal.toFixed(2) : "0.00"}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
