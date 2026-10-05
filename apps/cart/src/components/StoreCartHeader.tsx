"use client";

import React from "react";
import { Check, Minus, BadgeCheck, ChevronRight } from "lucide-react";

interface StoreCartHeaderProps {
  sellerName?: string;
  totalInStockCount: number;
  selectedInStockCount: number;
  allSelected: boolean;
  isPartiallySelected: boolean;
  onToggleAll: (selectAll: boolean) => void;
}

export default function StoreCartHeader({
  sellerName = "TrendSphere",
  totalInStockCount,
  selectedInStockCount,
  allSelected,
  isPartiallySelected,
  onToggleAll,
}: StoreCartHeaderProps) {
  const isInteractive = totalInStockCount > 0;

  const handleToggle = () => {
    if (!isInteractive) return;
    // If all are selected, uncheck all. Otherwise (partial or none), select all.
    onToggleAll(!allSelected);
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs px-3.5 py-2.5 sm:px-5 sm:py-3.5 flex items-center justify-between gap-2.5 sm:gap-4 transition-all">
      {/* Left: Checkbox, Label, Store Name, Official Badge, Chevron */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        {/* Selection Checkbox */}
        <button
          type="button"
          disabled={!isInteractive}
          onClick={handleToggle}
          className={`w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-all border ${
            !isInteractive
              ? "bg-slate-100 border-slate-300 text-slate-400 cursor-not-allowed opacity-60"
              : allSelected
              ? "bg-indigo-600 border-indigo-600 text-white shadow-2xs hover:bg-indigo-700 cursor-pointer"
              : isPartiallySelected
              ? "bg-indigo-600 border-indigo-600 text-white shadow-2xs hover:bg-indigo-700 cursor-pointer"
              : "bg-white border-slate-300 hover:border-indigo-400 text-transparent hover:bg-slate-50 cursor-pointer"
          }`}
          aria-label={allSelected ? "Tüm ürünlerin seçimini kaldır" : "Tüm mağaza ürünlerini seç"}
          title={allSelected ? "Tüm ürünlerin seçimini kaldır" : "Tüm mağaza ürünlerini seç"}
        >
          {allSelected ? (
            <Check className="w-3.5 h-3.5 stroke-[3] transition-transform scale-100" />
          ) : isPartiallySelected ? (
            <Minus className="w-3.5 h-3.5 stroke-[3] transition-transform scale-100" />
          ) : (
            <Check className="w-3.5 h-3.5 stroke-[3] transition-transform scale-0" />
          )}
        </button>

        {/* Store Title Group */}
        <div
          onClick={isInteractive ? handleToggle : undefined}
          className={`flex items-center gap-1.5 sm:gap-2 min-w-0 ${
            isInteractive ? "cursor-pointer select-none" : ""
          }`}
        >
          <span className="text-xs sm:text-sm font-medium text-slate-600">
            Mağaza
          </span>
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
              {sellerName}
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex-shrink-0">
              <BadgeCheck className="w-3 h-3 text-indigo-600" />
              <span className="hidden xs:inline sm:inline">Resmi Satıcı</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Right: Selected Status Indicator */}
      <div className="flex items-center gap-1.5 flex-shrink-0 text-[11px] sm:text-xs">
        {totalInStockCount === 0 ? (
          <span className="text-rose-500 font-medium">Stokta Ürün Yok</span>
        ) : allSelected ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
            Tümü Seçili
          </span>
        ) : (
          <span className="text-slate-500 font-medium">
            <strong className="font-semibold text-slate-700">{selectedInStockCount}</strong>
            <span className="text-slate-400">/{totalInStockCount}</span>
            <span className="hidden sm:inline ml-1">seçildi</span>
          </span>
        )}
      </div>
    </div>
  );
}
