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
    <div className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Product Image Container */}
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square w-full bg-slate-50/50 p-3 sm:p-6 flex items-center justify-center overflow-hidden border-b border-slate-100"
      >
        <Image
          src={imgSrc}
          alt={product.title}
          fill
          unoptimized
          onError={() => setImgSrc("/images/fallback/placeholder.svg")}
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-300 ease-out"
        />
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/5 transition-colors hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-800 text-xs font-semibold shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all">
            <Eye className="w-3.5 h-3.5" /> İncele
          </span>
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
            <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/60 truncate max-w-[85px] sm:max-w-none">
              {getCategoryDisplayName(product.category)}
            </span>
            <div className="flex items-center gap-1 text-amber-500 flex-shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 stroke-amber-400" />
              <span className="text-[11px] sm:text-xs font-bold text-slate-800">{product.rating?.rate ?? 4.5}</span>
              <span className="text-[10px] sm:text-xs text-slate-400 hidden xs:inline sm:inline">({product.rating?.count ?? 120})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug hover:text-indigo-600 transition-colors">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="mt-3 sm:mt-5 pt-2.5 sm:pt-4 border-t border-slate-100 flex flex-col gap-2 sm:gap-3">
          <div>
            <span className="text-[10px] sm:text-xs text-slate-400 block font-medium mb-0.5 sm:mb-1">Fiyat</span>
            <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-[10px] sm:text-xs text-slate-400 line-through font-medium">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium">
                    (-%{product.discountRate})
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            aria-label={`Sepete Ekle - ${product.title}`}
            data-testid="add-to-cart-button"
            className={`w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2.5 sm:px-4 rounded-xl sm:rounded-2xl font-semibold text-xs transition-all duration-200 shadow-sm cursor-pointer ${
              isAdding
                ? "bg-emerald-600 text-white shadow-emerald-500/20"
                : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/25 active:scale-[0.98]"
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-in zoom-in" />
                <span>Eklendi</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Sepete Ekle</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
