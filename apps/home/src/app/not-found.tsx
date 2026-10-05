import React from "react";
import Link from "next/link";
import { SearchX, ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-50 text-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/10 mb-6">
          <SearchX className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider inline-block mb-3">
          404 • Sayfa Bulunamadı
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Aradığınız Sayfaya Ulaşılamadı
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
          Görüntülemeye çalıştığınız ürün veya sayfa mevcut olmayabilir, taşınmış ya da bağlantısı değişmiş olabilir.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kataloğa Dön</span>
          </Link>
          <Link
            href="/cart"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Sepetimi Görüntüle</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
