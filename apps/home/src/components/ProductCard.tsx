"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart, Check, Eye } from "lucide-react";
import type { Product } from "@repo/shared-types";
import { getCategoryDisplayName } from "@repo/shared-types";
import { useCartSync } from "@repo/cart-sync";

interface ProductCardProps {
  product: Product;
  onAddedToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddedToCart }: ProductCardProps) {
  const { addItem } = useCartSync("home");
  const [isAdding, setIsAdding] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    const hasAttributes = Boolean(product.attributes && product.attributes.length > 0);
    const defaultAttrs: Record<string, string> = {};
    if (hasAttributes && product.attributes) {
      product.attributes.forEach((attr) => {
        defaultAttrs[attr.name] = attr.defaultValue || attr.options[0];
      });
    }
    addItem(product, 1, defaultAttrs, hasAttributes);
    if (onAddedToCart) {
      onAddedToCart(product);
    }
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Category Pill */}
      <div className="absolute top-4 left-4 z-10">
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-white/90 backdrop-blur-md text-slate-700 shadow-sm border border-slate-100">
          {getCategoryDisplayName(product.category)}
        </span>
      </div>

      {/* Discount Badge */}
      {product.discountRate && (
        <div className="absolute top-4 right-4 z-10">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-50/95 backdrop-blur-md text-rose-700 border border-rose-200/80 shadow-2xs">
            %{product.discountRate} İndirim
          </span>
        </div>
      )}

      {/* Product Image Container */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square w-full bg-slate-50/50 p-6 flex items-center justify-center overflow-hidden border-b border-slate-100"
      >
        <Image
          src={imgSrc}
          alt={product.title}
          fill
          unoptimized
          onError={() => setImgSrc("/images/fallback/placeholder.svg")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
            <Eye className="w-3.5 h-3.5" /> İncele
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 text-amber-500 mb-2">
            <Star className="w-4 h-4 fill-amber-400 stroke-amber-400" />
            <span className="text-xs font-bold text-slate-800">{product.rating?.rate ?? 4.5}</span>
            <span className="text-xs text-slate-400">({product.rating?.count ?? 120})</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 hover:text-indigo-600 transition-colors">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            {product.originalPrice ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 leading-none mb-1">
                  <span className="text-xs text-slate-400 line-through font-medium">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200/80 px-1.5 py-0.5 rounded leading-none">
                    (-%{product.discountRate})
                  </span>
                </div>
                <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 block font-medium leading-none mb-1">Fiyat</span>
                <span className="text-lg font-black text-slate-900 tracking-tight leading-none">
                  ${product.price.toFixed(2)}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex-shrink-0 inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-2xl font-semibold text-xs transition-all duration-200 shadow-sm cursor-pointer ${
              isAdding
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/25 active:scale-95"
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 animate-in zoom-in" />
                <span>Eklendi</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Sepete Ekle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
