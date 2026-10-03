"use client";

import React from "react";
import Image from "next/image";
import { Trash2, Plus, Minus, AlertCircle, Tag } from "lucide-react";
import type { CartItem, SelectedAttributes } from "@repo/shared-types";
import { getProductAttributes } from "@repo/shared-types";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
  onUpdateAttributes?: (productId: number, selectedAttributes: SelectedAttributes, needsConfirmation?: boolean) => void;
}

export default function CartItemCard({ item, onUpdateQuantity, onRemove, onUpdateAttributes }: CartItemCardProps) {
  const { product, quantity } = item;
  const unitPrice = item.unitPrice ?? product.price;
  const itemTotal = (unitPrice * quantity).toFixed(2);
  const [imgSrc, setImgSrc] = React.useState(product.image);

  const handleNavigateToProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      if (window.location.port === "3001") {
        window.location.href = `http://localhost:3000/products/${product.id}`;
      } else {
        window.location.href = `/products/${product.id}`;
      }
    }
  };

  const attributes = product.attributes || getProductAttributes(product);
  const selectedAttrsSummary = item.selectedAttributes
    ? Object.entries(item.selectedAttributes)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" • ")
    : null;

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center gap-5 transition-all hover:shadow-md">
      {/* Product Image */}
      <a
        href={`/products/${product.id}`}
        onClick={handleNavigateToProduct}
        className="relative w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-2xl p-3 flex-shrink-0 flex items-center justify-center border border-slate-100 group/img cursor-pointer"
        title={`${product.title} detayını incele`}
      >
        <Image
          src={imgSrc}
          alt={product.title}
          fill
          unoptimized
          onError={() => setImgSrc("/images/fallback/placeholder.svg")}
          sizes="112px"
          className="object-contain p-2 group-hover/img:scale-105 transition-transform duration-200"
        />
      </a>

      {/* Info */}
      <div className="flex-1 min-w-0 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
            {product.category}
          </span>
          {item.needsAttributeConfirmation ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full animate-pulse">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              Lütfen Seçim Yapınız
            </span>
          ) : (
            selectedAttrsSummary && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                <Tag className="w-3 h-3 text-indigo-500" />
                {selectedAttrsSummary}
              </span>
            )
          )}
        </div>

        <a
          href={`/products/${product.id}`}
          onClick={handleNavigateToProduct}
          className="block group/title cursor-pointer"
        >
          <h4 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover/title:text-indigo-600 transition-colors">
            {product.title}
          </h4>
        </a>

        {/* Inline Attribute Picker */}
        {attributes && attributes.length > 0 && (
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {attributes.map((attr) => (
              <div key={attr.name} className="flex items-center gap-1.5 text-xs">
                <span className="font-bold text-slate-500 text-[11px]">{attr.name}:</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {attr.options.map((opt) => {
                    const currentVal = item.selectedAttributes?.[attr.name] || attr.defaultValue;
                    const isSelected = currentVal === opt && !item.needsAttributeConfirmation;
                    const detail = attr.optionDetails?.find((d) => d.label === opt);
                    const delta = detail?.priceDelta;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          onUpdateAttributes?.(
                            product.id,
                            { ...item.selectedAttributes, [attr.name]: opt },
                            false
                          )
                        }
                        className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                        }`}
                        title={`${attr.name}: ${opt}`}
                      >
                        <span>{opt}</span>
                        {delta !== undefined && delta !== 0 && (
                          <span
                            className={`text-[9px] ${
                              isSelected ? "text-indigo-100" : "text-slate-500 font-semibold"
                            }`}
                          >
                            {delta > 0 ? `+$${delta}` : `-$${Math.abs(delta)}`}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-2 text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-2">
          <span>
            Birim Fiyat: <strong className="text-slate-800">${unitPrice.toFixed(2)}</strong>
          </span>
          {item.unitPrice && Math.abs(item.unitPrice - product.price) > 0.001 && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                item.unitPrice > product.price
                  ? "text-indigo-700 bg-indigo-50 border border-indigo-200"
                  : "text-emerald-700 bg-emerald-50 border border-emerald-200"
              }`}
            >
              {item.unitPrice > product.price
                ? `+$${(item.unitPrice - product.price).toFixed(2)} opsiyon`
                : `-$${(product.price - item.unitPrice).toFixed(2)} indirim`}
            </span>
          )}
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
