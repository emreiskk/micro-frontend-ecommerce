import React from "react";
import ProductCatalog from "@/components/ProductCatalog";
import { Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { fetchProducts } from "@/services/productService";

export const revalidate = 3600;

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/50 via-white to-slate-50 py-10 sm:py-16 md:py-20 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold mb-3 sm:mb-4 border border-indigo-200/50 shadow-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Modern Mikro-Frontend Mimarisi</span>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-950 tracking-tight leading-[1.15] sm:leading-[1.1]">
              Yeni Nesil E-Ticaret Deneyimi,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Ayrık Mikro Servisler.
              </span>
            </h1>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed font-normal">
              Bu ana uygulama (Port 3000), ürün kataloğunu ve detaylarını ISR önbellekleme ile sunar.
              Sepet işlemleriniz ise bağımsız port 3001&apos;deki Cart mikro servisiyle anlık senkronize çalışır.
            </p>
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <a
                href="#catalog"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:scale-[1.02] active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                Ürünleri Keşfet
              </a>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-200 shadow-sm transition-all"
              >
                <span>Sepet MFE&apos;ye Git</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog */}
      <section id="catalog">
        <ProductCatalog initialProducts={products} />
      </section>
    </div>
  );
}
