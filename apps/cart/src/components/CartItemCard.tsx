"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2, Plus, Minus, AlertCircle, Tag, SlidersHorizontal, Check } from "lucide-react";
import type { CartItem, SelectedAttributes } from "@repo/shared-types";
import { getProductAttributes, getCartItemId, getCategoryDisplayName } from "@repo/shared-types";
import EditVariantModal from "./EditVariantModal";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
  onUpdateAttributes?: (cartItemId: string, selectedAttributes: SelectedAttributes, needsConfirmation?: boolean) => void;
  onToggleSelect?: (cartItemId: string) => void;
}

export default function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
  onUpdateAttributes,
  onToggleSelect,
}: CartItemCardProps) {
  const { product, quantity } = item;
  const isSelected = item.selected !== false;
  const unitPrice = item.unitPrice ?? product.price;
  const itemTotal = (unitPrice * quantity).toFixed(2);
  const [imgSrc, setImgSrc] = useState(product.image);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const itemKey = item.cartItemId || getCartItemId(product.id, item.selectedAttributes);

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
    <>
      {isEditOpen && (
        <EditVariantModal
          isOpen={isEditOpen}
          item={item}
          onSave={(newAttrs) => onUpdateAttributes?.(itemKey, newAttrs, false)}
          onClose={() => setIsEditOpen(false)}
        />
      )}

      <div
        className={`rounded-3xl p-5 sm:p-6 border transition-all duration-300 flex flex-col sm:flex-row items-center gap-5 ${
          isSelected
            ? "bg-white border-slate-200/80 shadow-sm hover:shadow-md"
            : "bg-slate-50/70 border-slate-200/60 opacity-60 grayscale-[0.45] hover:opacity-85 shadow-none"
        }`}
      >
        {/* Selection Checkbox & Product Image */}
        <div className="flex items-start gap-3 sm:gap-3.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => onToggleSelect?.(itemKey)}
            className={`mt-1 w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all cursor-pointer border ${
              isSelected
                ? "bg-indigo-600 border-indigo-600 text-white shadow-2xs hover:bg-indigo-700"
                : "bg-white border-slate-300 hover:border-indigo-400 text-transparent hover:bg-slate-50"
            }`}
            aria-label={isSelected ? "Ürünü siparişten çıkar" : "Ürünü siparişe dahil et"}
            title={isSelected ? "Siparişten çıkar (sepette kalır)" : "Siparişe dahil et"}
          >
            <Check className={`w-3 h-3 stroke-[3] transition-transform ${isSelected ? "scale-100" : "scale-0"}`} />
          </button>

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
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block">
              {getCategoryDisplayName(product.category)}
            </span>
            {!isSelected && (
              <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full inline-block">
                Siparişe Dahil Değil
              </span>
            )}
            {item.needsAttributeConfirmation && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full animate-pulse">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                Lütfen Seçim Yapınız
              </span>
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

          {/* Clean Selected Attributes Badge & Dedicated Edit Button */}
          <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            {selectedAttrsSummary && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-100/90 border border-slate-200 px-3 py-1 rounded-xl">
                <Tag className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                <span className="truncate max-w-xs">{selectedAttrsSummary}</span>
              </span>
            )}

            {attributes && attributes.length > 0 && (
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/60 px-3 py-1 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                title="Ürün varyantını düzenle"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Düzenle</span>
              </button>
            )}
          </div>

          {/* Unit Price */}
          <div className="mt-2.5 text-xs text-slate-500 font-medium flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <div className="flex items-baseline gap-1.5">
              <span>Birim Fiyat:</span>
              <strong className="text-slate-900 font-bold">${unitPrice.toFixed(2)}</strong>
              {item.originalUnitPrice && item.originalUnitPrice > unitPrice && (
                <>
                  <span className="line-through text-slate-400 font-medium">
                    ${item.originalUnitPrice.toFixed(2)}
                  </span>
                  {product.discountRate && (
                    <span className="text-slate-400 font-medium">
                      (-%{product.discountRate})
                    </span>
                  )}
                </>
              )}
            </div>
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
              onClick={() => onUpdateQuantity(itemKey, quantity - 1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors cursor-pointer"
              aria-label="Azalt"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-800">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(itemKey, quantity + 1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors cursor-pointer"
              aria-label="Artır"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Line Item Total & Trash */}
          <div className="flex items-center gap-3">
            <span className="text-base font-black text-slate-900 tracking-tight">
              ${itemTotal}
            </span>
            <button
              onClick={() => onRemove(itemKey)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Ürünü sepetten kaldır"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
