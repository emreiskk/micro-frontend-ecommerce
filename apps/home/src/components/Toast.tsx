"use client";

import React, { useEffect } from "react";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import type { Product } from "@repo/shared-types";

interface ToastProps {
  product: Product | null;
  onClose: () => void;
}

export default function Toast({ product, onClose }: ToastProps) {
  useEffect(() => {
    if (!product) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl flex-shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900">Ürün Sepete Eklendi!</h4>
          <p className="text-xs text-slate-500 truncate mt-0.5">{product.title}</p>
          <div className="mt-3 flex items-center gap-3">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Sepete Git
            </Link>
            <button
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-700 font-medium"
            >
              Alışverişe Devam Et
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          aria-label="Kapat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
