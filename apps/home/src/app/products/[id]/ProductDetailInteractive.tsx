"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  ShoppingCart,
  Check,
  Plus,
  Minus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Star,
  Bell,
  BadgeCheck,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import type { Product, SelectedAttributes } from "@repo/shared-types";
import {
  calculateProductPrice,
  calculateProductOriginalPrice,
  calculateDynamicSpecifications,
  getProductAttributes,
  isVariantInStock,
  getOptionStockDetail,
  getCategoryDisplayName,
  getVariantMaxStock,
  DEFAULT_MAX_ORDER_QUANTITY,
  getCartItemId,
} from "@repo/shared-types";
import { useCartSync } from "@repo/cart-sync";
import Toast from "@/components/Toast";
import StockNotifyToast from "@/components/StockNotifyToast";

interface ProductDetailInteractiveProps {
  product: Product;
}

export default function ProductDetailInteractive({ product }: ProductDetailInteractiveProps) {
  const { items, addItem } = useCartSync("home");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [notifyToastVisible, setNotifyToastVisible] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  // Compute attributes list
  const attributes = useMemo(() => {
    return product.attributes && product.attributes.length > 0
      ? product.attributes
      : getProductAttributes(product);
  }, [product]);

  // Initial default attributes
  const initialAttributes = useMemo(() => {
    const map: SelectedAttributes = {};
    attributes.forEach((attr) => {
      map[attr.name] = attr.defaultValue || attr.options[0];
    });
    return map;
  }, [attributes]);

  const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttributes>(initialAttributes);

  // Check if current selection is in stock
  const inStock = useMemo(() => {
    return isVariantInStock(product, selectedAttributes);
  }, [product, selectedAttributes]);

  // Compute maximum allowed order quantity (capped at 50 or variant stock)
  const maxStock = useMemo(() => {
    return getVariantMaxStock(product, selectedAttributes);
  }, [product, selectedAttributes]);

  // Track how many units of this exact variant are already in the cart
  const currentCartKey = useMemo(() => {
    return getCartItemId(product.id, selectedAttributes);
  }, [product.id, selectedAttributes]);

  const existingCartItem = useMemo(() => {
    return items.find(
      (i) => (i.cartItemId || getCartItemId(i.product.id, i.selectedAttributes)) === currentCartKey
    );
  }, [items, currentCartKey]);

  const inCartQuantity = existingCartItem ? existingCartItem.quantity : 0;
  const remainingStockAllowed = Math.max(0, maxStock - inCartQuantity);
  const isMaxInCart = inStock && maxStock > 0 && inCartQuantity >= maxStock;

  // Clamp selected quantity to remaining available stock or maxStock
  React.useEffect(() => {
    if (isMaxInCart) {
      setQuantity(1);
    } else if (remainingStockAllowed > 0 && quantity > remainingStockAllowed) {
      setQuantity(remainingStockAllowed);
    } else if (maxStock > 0 && quantity > maxStock) {
      setQuantity(maxStock);
    }
  }, [isMaxInCart, remainingStockAllowed, maxStock, quantity]);

  // Dynamically computed price and specifications based on selected variant
  const currentUnitPrice = useMemo(() => {
    return calculateProductPrice(product, selectedAttributes);
  }, [product, selectedAttributes]);

  const currentOriginalPrice = useMemo(() => {
    return calculateProductOriginalPrice(product, selectedAttributes);
  }, [product, selectedAttributes]);

  const dynamicSpecs = useMemo(() => {
    return calculateDynamicSpecifications(product, selectedAttributes);
  }, [product, selectedAttributes]);

  const priceDelta = Number((currentUnitPrice - product.price).toFixed(2));

  const handleAdd = () => {
    if (!inStock) return;
    setIsAdding(true);
    addItem(product, quantity, selectedAttributes, false);
    setToastVisible(true);
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleNotify = () => {
    try {
      const stored = localStorage.getItem("stock_notifications") || "[]";
      const list = JSON.parse(stored);
      list.push({
        productId: product.id,
        title: product.title,
        attributes: selectedAttributes,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("stock_notifications", JSON.stringify(list));
    } catch {}

    setIsNotified(true);
    setNotifyToastVisible(true);
    setTimeout(() => {
      setIsNotified(false);
    }, 3000);
  };

  return (
    <>
      <Toast product={toastVisible ? product : null} onClose={() => setToastVisible(false)} />

      {/* Top 2-Column Section: Left Image, Right Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 items-start">
        {/* Left Column: Product Image (Top-aligned, zero empty top gap, sticky on large screens) */}
        <div className="relative aspect-square w-full max-h-[360px] sm:max-h-[500px] bg-slate-50/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex items-center justify-center border border-slate-100 overflow-hidden lg:sticky lg:top-24">
          <Image
            src={product.image}
            alt={product.title}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
            className="object-contain p-3 sm:p-6 hover:scale-105 transition-transform duration-300 ease-out"
          />
        </div>

        {/* Right Column: Title, Category, Rating, Price, Variants, Actions, Guarantees */}
        <div className="flex flex-col justify-start">
          {/* Category Pill */}
          <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/60 inline-block w-fit mb-2 sm:mb-3">
            {getCategoryDisplayName(product.category)}
          </span>

          {/* Product Title */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {product.title}
          </h1>

          {/* Rating */}
          <div className="mt-2.5 sm:mt-3 flex items-center gap-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 stroke-amber-400" />
              <span className="ml-1 text-xs sm:text-sm font-bold text-slate-800">
                {product.rating?.rate ?? 4.5}
              </span>
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
              {product.rating?.count ?? 120} değerlendirme
            </span>
          </div>

          {/* Dynamic Price Display & Stock Badge */}
          <div className="mt-4 sm:mt-6 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-2">
            {/* Header: Fiyat Title & Stock Status */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">Fiyat</span>
              {inStock ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Stokta Mevcut
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Tükendi
                </span>
              )}
            </div>

            {/* Price Values Row */}
            <div className="flex items-baseline gap-2 sm:gap-2.5 flex-wrap">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight transition-all">
                ${currentUnitPrice.toFixed(2)}
              </span>
              {currentOriginalPrice && (
                <>
                  <span className="text-sm sm:text-base font-medium text-slate-400 line-through">
                    ${currentOriginalPrice.toFixed(2)}
                  </span>
                  {product.discountRate && (
                    <span className="text-sm sm:text-base font-medium text-slate-400">
                      (-%{product.discountRate})
                    </span>
                  )}
                </>
              )}
              {priceDelta !== 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-indigo-50/80 text-indigo-600 border border-indigo-200/70">
                  <span>{priceDelta > 0 ? `+$${priceDelta.toFixed(2)}` : `-$${Math.abs(priceDelta).toFixed(2)}`}</span>
                  <span className="text-[9px] font-medium text-indigo-500/80">opsiyon</span>
                </span>
              )}
            </div>
          </div>

          {/* Corporate Seller Trust Box (Trendyol-style Responsive Card) */}
          <div className="mt-3.5 sm:mt-4 p-2.5 sm:p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex items-center gap-2.5 sm:gap-3.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs flex-shrink-0">
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <div className="flex flex-col min-w-0 justify-center">
              <div className="flex items-center gap-1.5 flex-nowrap min-w-0">
                <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                  {product.seller?.name || "TrendSphere"}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex-shrink-0">
                  <BadgeCheck className="w-3 h-3 text-indigo-600" />
                  <span>Resmi Satıcı</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex-shrink-0">
                  <Star className="w-3 h-3 fill-indigo-600 text-indigo-600" />
                  <span>{product.seller?.rating ? product.seller.rating.toFixed(1) : "9.8"}</span>
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium truncate mt-0.5">
                TrendSphere Express ile 24 saatte kargoda
              </span>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-4 sm:mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ürün Açıklaması</h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variant Selector (Beden, Ekran Boyutu, Depolama vs.) */}
          {attributes && attributes.length > 0 && (
            <div className="mt-4 sm:mt-6 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-4">
              {attributes.map((attr) => (
                <div key={attr.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex-shrink-0">
                        {attr.name}:
                      </span>
                      <span
                        className="text-xs text-indigo-600 font-extrabold truncate"
                        title={selectedAttributes[attr.name] || attr.defaultValue}
                      >
                        {selectedAttributes[attr.name] || attr.defaultValue}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400 flex-shrink-0 whitespace-nowrap">
                      {attr.options.length} Seçenek
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:gap-2.5 pt-1 sm:pt-1.5">
                    {attr.options.map((opt) => {
                      const isSelected = (selectedAttributes[attr.name] || attr.defaultValue) === opt;
                      const detail = attr.optionDetails?.find((d) => d.label === opt);
                      const delta = detail?.priceDelta;
                      const stockDetail = getOptionStockDetail(attr, opt);
                      const isOptInStock = stockDetail.inStock;

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setSelectedAttributes((prev) => ({ ...prev, [attr.name]: opt }))
                          }
                          className={`relative px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            opt.length <= 3 ? "min-w-[38px] sm:min-w-[42px]" : ""
                          } ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-102 border-2 border-indigo-600"
                              : isOptInStock
                              ? "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                              : "bg-slate-50/80 text-slate-400 border border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                          }`}
                        >
                          <span className="relative z-10">{opt}</span>

                          {/* Diagonal Out-of-Stock Line (Trendyol Style) */}
                          {!isOptInStock && (
                            <svg
                              className="absolute inset-0 w-full h-full pointer-events-none rounded-xl overflow-hidden"
                              style={{ width: "100%", height: "100%" }}
                            >
                              <line
                                x1="0%"
                                y1="100%"
                                x2="100%"
                                y2="0%"
                                stroke="currentColor"
                                strokeWidth={isSelected ? "1.5" : "1.2"}
                                className={isSelected ? "text-indigo-200" : "text-slate-300"}
                              />
                            </svg>
                          )}

                          {/* Top-Right Notification Bell Icon (Trendyol Style) */}
                          {!isOptInStock && (
                            <span
                              className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center shadow-xs transition-transform z-20 ${
                                isSelected
                                  ? "bg-indigo-600 text-white ring-2 ring-white scale-110"
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                              }`}
                              title="Tükendi - Gelince Haber Ver"
                            >
                              <Bell className="w-2.5 h-2.5" />
                            </span>
                          )}

                          {/* Price Delta Badge */}
                          {delta !== undefined && delta !== 0 && (
                            <span
                              className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-lg transition-colors ${
                                isSelected
                                  ? "bg-indigo-700/80 text-white border border-indigo-500/50"
                                  : delta > 0
                                  ? "bg-indigo-50 text-indigo-600 border border-indigo-100"
                                  : "bg-emerald-50 text-emerald-600 border border-emerald-100"
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

          {/* Add to Cart Actions */}
          <div className="mt-6 sm:mt-7 flex flex-col">
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Quantity selector */}
              <div
                className={`flex items-center h-[48px] sm:h-[52px] border border-slate-200 rounded-2xl bg-slate-50 p-1 sm:p-1.5 transition-opacity ${
                  !inStock || isMaxInCart ? "opacity-40 cursor-not-allowed" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={!inStock || isMaxInCart || quantity <= 1}
                  className="w-8 sm:w-9 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  aria-label="Azalt"
                >
                  <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="w-8 sm:w-10 text-center font-bold text-xs sm:text-sm text-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(remainingStockAllowed, q + 1))}
                  disabled={!inStock || isMaxInCart || quantity >= remainingStockAllowed}
                  className="w-8 sm:w-9 h-full flex items-center justify-center text-slate-600 hover:text-slate-900 rounded-xl hover:bg-white transition-colors disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  aria-label="Artır"
                  title={
                    !inStock
                      ? "Ürün tükendi"
                      : isMaxInCart
                      ? `Maksimum adet sepetinizde (${maxStock} adet)`
                      : quantity >= remainingStockAllowed
                      ? `Kalan limit ${remainingStockAllowed} adet`
                      : "Artır"
                  }
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Action button: Sepete Ekle, Bu Ürün Zaten Sepetinizde or Gelince Haber Ver */}
              {isMaxInCart ? (
                <button
                  type="button"
                  disabled
                  aria-label="Bu ürün zaten sepetinizde (Maksimum adede ulaşıldı)"
                  className="flex-1 h-[48px] sm:h-[52px] inline-flex items-center justify-center gap-2 sm:gap-2.5 px-3 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/20 bg-indigo-600 text-white cursor-not-allowed transition-all"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-white flex-shrink-0" />
                  <span className="truncate">
                    <span className="sm:hidden">Zaten Sepetinizde</span>
                    <span className="hidden sm:inline">Bu Ürün Zaten Sepetinizde</span>
                  </span>
                </button>
              ) : inStock ? (
                <button
                  onClick={handleAdd}
                  disabled={isAdding}
                  aria-label={`Sepete Ekle - ${product.title}`}
                  data-testid="add-to-cart-button"
                  className={`flex-1 h-[48px] sm:h-[52px] inline-flex items-center justify-center gap-2 sm:gap-2.5 px-3 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all ${
                    isAdding
                      ? "bg-emerald-600 text-white shadow-emerald-500/20"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 active:scale-98 cursor-pointer"
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 animate-in zoom-in flex-shrink-0" />
                      <span className="truncate">Sepete Eklendi!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="truncate">Sepete Ekle (${(currentUnitPrice * quantity).toFixed(2)})</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNotify}
                  disabled={isNotified}
                  className={`flex-1 h-[48px] sm:h-[52px] inline-flex items-center justify-center gap-2 sm:gap-2.5 px-3 sm:px-6 rounded-2xl font-bold text-xs sm:text-sm shadow-lg transition-all ${
                    isNotified
                      ? "bg-emerald-600 text-white shadow-emerald-500/20"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/25 active:scale-98 cursor-pointer"
                  }`}
                >
                  {isNotified ? (
                    <>
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 animate-in zoom-in flex-shrink-0" />
                      <span className="truncate">Talebiniz Alındı!</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                      <span className="truncate">Gelince Haber Ver</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Full-width Centered Max Order Limit Warning Box */}
            {inStock && maxStock > 0 && (quantity >= maxStock || isMaxInCart) && (
              <div className="mt-3 sm:mt-3.5 w-full p-2.5 sm:p-3 rounded-2xl bg-amber-50/90 border border-amber-200/80 text-amber-800 flex items-center justify-center gap-2 text-xs font-bold shadow-2xs animate-in fade-in slide-in-from-top-1 duration-200 text-center">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>Maksimum sipariş adedine ulaşıldı (Maks. {maxStock} adet)</span>
              </div>
            )}
          </div>

          {/* Guarantees */}
          <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-100 grid grid-cols-3 gap-2 sm:gap-3 text-[11px] sm:text-xs text-slate-600">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 flex-shrink-0" />
              <span className="font-medium">Hızlı Kargo</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 flex-shrink-0" />
              <span className="font-medium">Orijinal Ürün</span>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-1.5 sm:gap-2">
              <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 flex-shrink-0" />
              <span className="font-medium">30 Gün İade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Horizontal Section: Technical Specifications */}
      {dynamicSpecs && dynamicSpecs.length > 0 && (
        <div className="mt-8 sm:mt-14 pt-6 sm:pt-10 border-t border-slate-100">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Ürün Özellikleri & Teknik Detaylar
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Seçilen varyanta göre otomatik güncellenen doğrulanmış teknik özellikler
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {dynamicSpecs.map((spec) => (
              <div
                key={spec.label}
                className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-100 hover:border-indigo-200 transition-colors"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5 sm:mb-1">
                  {spec.label}
                </span>
                <span className="text-xs font-bold text-slate-800 leading-snug">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Bottom CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 p-3 px-4 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium">Toplam</span>
          <span className="text-lg font-black text-slate-900 leading-tight">
            ${(currentUnitPrice * quantity).toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {isMaxInCart ? (
            <button
              type="button"
              disabled
              aria-label="Bu ürün zaten sepetinizde"
              className="h-11 px-5 rounded-xl font-bold text-xs text-white shadow-md bg-indigo-600 transition-all flex items-center gap-2 cursor-not-allowed"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              <span>Sepetinizde</span>
            </button>
          ) : inStock ? (
            <button
              onClick={handleAdd}
              disabled={isAdding}
              aria-label={`Sepete Ekle - ${product.title}`}
              data-testid="add-to-cart-sticky-button"
              className={`h-11 px-5 rounded-xl font-bold text-xs text-white shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                isAdding
                  ? "bg-emerald-600 shadow-emerald-500/20"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25"
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
          ) : (
            <button
              type="button"
              onClick={handleNotify}
              disabled={isNotified}
              className={`h-11 px-5 rounded-xl font-bold text-xs text-white shadow-md transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                isNotified
                  ? "bg-emerald-600 shadow-emerald-500/20"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25"
              }`}
            >
              {isNotified ? (
                <>
                  <Check className="w-4 h-4 animate-in zoom-in" />
                  <span>Alındı</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" />
                  <span>Haber Ver</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Out of Stock Toast Notification */}
      <StockNotifyToast
        product={notifyToastVisible ? product : null}
        selectedAttributes={selectedAttributes}
        onClose={() => setNotifyToastVisible(false)}
      />
    </>
  );
}
