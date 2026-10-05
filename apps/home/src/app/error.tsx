"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Home MFE runtime error:", error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-rose-50 text-rose-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-rose-500/10 mb-6">
          <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider inline-block mb-3">
          Bir Sorun Oluştu
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Sayfa Yüklenirken Hata Oluştu
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
          Beklenmeyen bir durum meydana geldi. Lütfen sayfayı yenilemeyi deneyin veya ana sayfaya dönün.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Yeniden Dene</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Ana Sayfa</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
