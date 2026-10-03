"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import type { CartItem } from "@repo/shared-types";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  const { product, quantity } = item;
  const itemTotal = (product.price * quantity).toFixed(2);
  const [imgSrc, setImgSrc] = React.useState(product.image);

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-5 transition-all hover:shadow-md">
      {/* Product Image */}
      <Link
        href={`/products/${product.id}`}
        className="relative w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-2xl p-3 flex-shrink-0 flex items-center justify-center border border-slate-100"
      >
        <Image
          src={imgSrc}
          alt={product.title}
          fill
          unoptimized
          onError={() => setImgSrc("/images/fallback/placeholder.svg")}
          sizes="112px"
          className="object-contain p-2"
        />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block mb-1">
          {product.category}
        </span>
        <Link href={`/products/${product.id}`} className="block">
          <h4 className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-indigo-600 transition-colors">
            {product.title}
          </h4>
        </Link>
        <div className="mt-1 text-xs text-slate-500 font-medium">
          Birim Fiyat: <span className="font-semibold text-slate-700">${product.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Quantity & Controls */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
        {/* Quantity Stepper */}
        <div className="flex items-center border border-slate-200 rounded-2xl bg-slate-50 p-1">
          <button
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
            aria-label="Azalt"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-8 text-center text-xs font-bold text-slate-800">
            {quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors"
            aria-label="Artır"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total & Trash */}
        <div className="flex items-center gap-3">
          <span className="text-base font-black text-slate-900 tracking-tight">
            ${itemTotal}
          </span>
          <button
            onClick={() => onRemove(product.id)}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            title="Ürünü sepetten kaldır"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
