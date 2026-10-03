import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Sparkles } from "lucide-react";
import ProductDetailActions from "./ProductDetailActions";
import { fetchProductById, fetchProducts } from "@/services/productService";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await fetchProducts();
  return products.slice(0, 10).map((p) => ({ id: String(p.id) }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await fetchProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kataloga Geri Dön
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-square max-h-[480px] w-full bg-slate-50/50 rounded-3xl p-8 flex items-center justify-center border border-slate-100 overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-contain p-6"
            />
          </div>

          {/* Details */}
          <div>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-indigo-50 text-indigo-600 border border-indigo-200/50 inline-block mb-3">
              {product.category}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                <span className="ml-1 text-sm font-bold text-slate-800">
                  {product.rating?.rate ?? 4.5}
                </span>
              </div>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium">
                {product.rating?.count ?? 120} kullanıcı değerlendirmesi
              </span>
            </div>

            {/* Price */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-emerald-600 font-semibold">Stokta Var</span>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ürün Açıklaması</h3>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Client Add to Cart Action */}
            <ProductDetailActions product={product} />

            {/* Guarantees */}
            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Hızlı Kargo</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>Orijinal Ürün</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span>30 Gün İade</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specifications Section */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="mt-10 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Ürün Özellikleri & Teknik Detaylar
              </h2>
              <p className="text-xs text-slate-500">
                Bu ürün için doğrulanmış teknik spesifikasyonlar, materyal ve standartlar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.specifications.map((spec) => (
              <div
                key={spec.label}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 hover:border-indigo-200 transition-colors"
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {spec.label}
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
