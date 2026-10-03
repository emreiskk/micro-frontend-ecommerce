import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Sparkles } from "lucide-react";
import { enrichProductWithSpecs } from "@repo/shared-types";
import ProductDetailInteractive from "./ProductDetailInteractive";
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
  const rawProduct = await fetchProductById(params.id);

  if (!rawProduct) {
    notFound();
  }

  const product = enrichProductWithSpecs(rawProduct);

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

            {/* Interactive Dynamic Price, Variants, Actions, and Specifications */}
            <ProductDetailInteractive product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
