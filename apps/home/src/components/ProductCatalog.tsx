"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Check,
  SearchX,
  RotateCcw,
  X,
} from "lucide-react";
import type { Product } from "@repo/shared-types";
import { getCategoryDisplayName } from "@repo/shared-types";
import ProductCard from "./ProductCard";
import Toast from "./Toast";

interface ProductCatalogProps {
  initialProducts: Product[];
}

const SORT_OPTIONS = [
  {
    id: "featured" as const,
    label: "Öne Çıkanlar",
  },
  {
    id: "price-asc" as const,
    label: "Fiyat: Düşükten Yükseğe",
  },
  {
    id: "price-desc" as const,
    label: "Fiyat: Yüksekten Düşüğe",
  },
  {
    id: "rating" as const,
    label: "En Çok Değerlendirilenler",
  },
];

export default function ProductCatalog({ initialProducts }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [toastProduct, setToastProduct] = useState<Product | null>(null);

  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const activeSort = SORT_OPTIONS.find((s) => s.id === sortBy) || SORT_OPTIONS[0];

  const truncatedSearchQuery = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length > 24) {
      return `${trimmed.slice(0, 24)}...`;
    }
    return trimmed;
  }, [searchQuery]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(initialProducts.map((p) => p.category)));
    return ["all", ...list];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts
      .filter((p) => {
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
        const matchesSearch =
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        if (sortBy === "rating") return (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0);
        return 0; // featured (default)
      });
  }, [initialProducts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Toast product={toastProduct} onClose={() => setToastProduct(null)} />

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm mb-10">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Ürün adı veya açıklama ile ara..."
              value={searchQuery}
              maxLength={50}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-11 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/60 transition-colors cursor-pointer"
                title="Aramayı temizle"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Custom Sort Selection */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 flex-shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Sırala:</span>
            </div>

            <div className="relative w-full sm:w-56 md:w-60 flex-shrink-0" ref={sortRef}>
              <button
                type="button"
                onClick={() => setIsSortOpen((prev) => !prev)}
                className={`w-full h-12 px-4 rounded-2xl border text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  isSortOpen
                    ? "bg-white border-indigo-500 ring-2 ring-indigo-500/20 shadow-md text-slate-900"
                    : "bg-slate-50 hover:bg-slate-100/80 border-slate-200 text-slate-800 shadow-xs"
                }`}
                aria-haspopup="listbox"
                aria-expanded={isSortOpen}
              >
                <span className="font-semibold text-slate-800 truncate text-left">
                  {activeSort.label}
                </span>
                {isSortOpen ? (
                  <ChevronUp className="w-4 h-4 text-indigo-600 transition-colors flex-shrink-0 ml-2 animate-in zoom-in-75 duration-150" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 transition-colors flex-shrink-0 ml-2 animate-in zoom-in-75 duration-150" />
                )}
              </button>

              {/* Custom Dropdown Menu */}
              {isSortOpen && (
                <div
                  className="absolute left-0 right-0 top-full mt-2 w-full bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150"
                  role="listbox"
                >
                  {SORT_OPTIONS.map((opt) => {
                    const isSelected = sortBy === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsSortOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer text-left ${
                          isSelected
                            ? "bg-indigo-50 text-indigo-700 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                        }`}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-indigo-600 flex-shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mr-2 flex-shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span>Kategoriler:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-100 hover:bg-slate-200/80 text-slate-600"
              }`}
            >
              {getCategoryDisplayName(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex-shrink-0">
          Katalog ({filteredProducts.length} Ürün)
        </h2>
        {searchQuery.trim() && (
          <span className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-md text-right">
            &ldquo;<span className="font-semibold text-slate-700">{truncatedSearchQuery}</span>&rdquo; için arama sonuçları
          </span>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddedToCart={(p) => setToastProduct(p)}
            />
          ))}
        </div>
      ) : (
        /* Frameless Natural Empty State */
        <div className="py-14 sm:py-20 text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-xs mb-5">
            <SearchX className="w-8 h-8" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Eşleşen Ürün Bulunamadı
          </h3>
          <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto break-words">
            {searchQuery.trim()
              ? `"${truncatedSearchQuery}" araması için uygun ürün bulunamadı. Filtreleri sıfırlayarak tüm kataloğa göz atabilirsiniz.`
              : "Seçilen filtre ve kategori kriterlerine uygun ürün bulunamadı."}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Filtreleri Sıfırla</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
