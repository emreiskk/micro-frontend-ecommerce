import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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
      {/* Breadcrumb Navigation */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kataloga Geri Dön
        </Link>
      </div>

      {/* Main Product Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10">
        <ProductDetailInteractive product={product} />
      </div>
    </div>
  );
}
