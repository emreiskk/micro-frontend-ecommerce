"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Trash2, Plus, Minus, AlertCircle, Tag, SlidersHorizontal, Check, X } from "lucide-react";
import type { CartItem, SelectedAttributes } from "@repo/shared-types";
import {
  getProductAttributes,
  getCartItemId,
  getCategoryDisplayName,
  isVariantInStock,
} from "@repo/shared-types";
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
  const isInStock = isVariantInStock(product, item.selectedAttributes);
  const isSelected = isInStock && item.selected !== false;
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
          !isInStock
            ? "bg-slate-50/90 border-rose-200/70 opacity-80"
            : isSelected
            ? "bg-white border-slate-200/80 shadow-sm hover:shadow-md"
            : "bg-slate-50/70 border-slate-200/60 opacity-60 grayscale-[0.45] hover:opacity-85 shadow-none"
        }`}
      >
        {/* Selection Checkbox & Product Image */}
        <div className="flex items-start gap-3 sm:gap-3.5 flex-shrink-0">
          <button
            type="button"
            disabled={!isInStock}
            onClick={() => {
              if (!isInStock) return;
              onToggleSelect?.(itemKey);
            }}
            className={`mt-1 w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all border ${
              !isInStock
                ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed opacity-60"
                : isSelected
                ? "bg-indigo-600 border-indigo-600 text-white shadow-2xs hover:bg-indigo-700 cursor-pointer"
                : "bg-white border-slate-300 hover:border-indigo-400 text-transparent hover:bg-slate-50 cursor-pointer"
            }`}
            aria-label={
              !isInStock
                ? "Ürün tükendi, sipariş verilemez"
                : isSelected
                ? "Ürünü siparişten çıkar"
                : "Ürünü siparişe dahil et"
            }
            title={
              !isInStock
                ? "Bu ürün tükendiği için sipariş verilemez"
                : isSelected
                ? "Siparişten çıkar (sepette kalır)"
                : "Siparişe dahil et"
            }
          >
            {!isInStock ? (
              <X className="w-3 h-3 stroke-[2.5] text-slate-400" />
            ) : (
              <Check className={`w-3 h-3 stroke-[3] transition-transform ${isSelected ? "scale-100" : "scale-0"}`} />
            )}
          </button>

          <a
            href={`/products/${product.id}`}
            onClick={handleNavigateToProduct}
            className="relative w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-2xl p-3 flex-shrink-0 flex items-center justify-center border border-slate-100 group/img cursor-pointer overflow-hidden"
            title={`${product.title} detayını incele`}
          >
            <Image
              src={imgSrc}
              alt={product.title}
              fill
              unoptimized
              onError={() => setImgSrc("/images/fallback/placeholder.svg")}
              sizes="112px"
              className={`object-contain p-2 group-hover/img:scale-105 transition-transform duration-200 ${
                !isInStock ? "grayscale-[0.6]" : ""
              }`}
            />
            {!isInStock && (
              <div className="absolute inset-0 bg-slate-900/40 rounded-2xl flex items-center justify-center backdrop-blur-[0.5px]">
                <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                  Tükendi
                </span>
              </div>
            )}
          </a>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-center sm:text-left sm:pr-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg inline-block">
              {getCategoryDisplayName(product.category)}
            </span>
            {!isInStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-lg">
                <AlertCircle className="w-3 h-3 text-rose-600" />
                Tükendi - Sipariş Verilemez
              </span>
            ) : !isSelected ? (
              <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-lg inline-block">
                Siparişe Dahil Değil
              </span>
            ) : item.needsAttributeConfirmation ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg">
                <AlertCircle className="w-3 h-3 text-amber-600" />
                Lütfen Seçim Yapınız
              </span>
            ) : null}
          </div>

          <a
            href={`/products/${product.id}`}
            onClick={handleNavigateToProduct}
            className="block group/title cursor-pointer"
          >
            <h4
              className={`text-sm font-bold line-clamp-2 transition-colors ${
                !isInStock
                  ? "line-through text-slate-400"
                  : "text-slate-900 group-hover/title:text-indigo-600"
              }`}
            >
              {product.title}
            </h4>
          </a>

          {/* Clean Selected Attributes Badge & Dedicated Edit Button - Fixed single line with ellipsis */}
          <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2 max-w-full">
            {selectedAttrsSummary && (
              <span
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100/90 border border-slate-200/80 px-2.5 py-1 rounded-lg min-w-0 max-w-[170px] sm:max-w-[190px] md:max-w-[220px]"
                title={selectedAttrsSummary}
              >
                <Tag className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                <span className="truncate">{selectedAttrsSummary}</span>
              </span>
            )}

            {attributes && attributes.length > 0 && (
              <button
                type="button"
                onClick={() => setIsEditOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/60 px-2.5 py-1 rounded-lg transition-all cursor-pointer shadow-xs active:scale-95 flex-shrink-0"
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
              <strong className={!isInStock ? "line-through text-slate-400 font-semibold" : "text-slate-900 font-black"}>
                ${unitPrice.toFixed(2)}
              </strong>
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
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-50/80 text-indigo-600 border border-indigo-200/70">
                <span>{item.unitPrice > product.price ? `+$${(item.unitPrice - product.price).toFixed(2)}` : `-$${(product.price - item.unitPrice).toFixed(2)}`}</span>
                <span className="text-[9px] font-medium text-indigo-500/80">opsiyon</span>
              </span>
            )}
          </div>
        </div>

        {/* Quantity & Controls */}
        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 flex-shrink-0 sm:min-w-[130px]">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
            <button
              onClick={() => onUpdateQuantity(itemKey, quantity - 1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors cursor-pointer"
              aria-label="Azalt"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-800">
              {quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(itemKey, quantity + 1)}
              disabled={!isInStock}
              className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Artır"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Line Item Total & Trash */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end leading-none">
              {item.originalUnitPrice && item.originalUnitPrice > unitPrice && (
                <span className="text-xs text-slate-400 line-through font-medium mb-1">
                  ${(item.originalUnitPrice * quantity).toFixed(2)}
                </span>
              )}
              <span
                className={`text-base sm:text-lg tracking-tight ${
                  !isInStock ? "line-through text-slate-400 font-semibold" : "font-black text-slate-900"
                }`}
              >
                ${itemTotal}
              </span>
            </div>
            <button
              onClick={() => onRemove(itemKey)}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
