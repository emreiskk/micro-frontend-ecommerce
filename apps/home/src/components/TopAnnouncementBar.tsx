"use client";

import React from "react";
import { Truck, Sparkles, Bell } from "lucide-react";

export interface AnnouncementItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  text: string;
  iconColor: string;
}

const ANNOUNCEMENT_ITEMS: AnnouncementItem[] = [
  {
    id: "shipping",
    icon: Truck,
    text: "Tüm siparişlerde $75 üzeri Ücretsiz Kargo",
    iconColor: "text-amber-300",
  },
  {
    id: "discount",
    icon: Sparkles,
    text: "Seçili koleksiyonlarda %30'a varan indirimler",
    iconColor: "text-indigo-300",
  },
  {
    id: "stock",
    icon: Bell,
    text: "Tükenen seçeneklerde \"Gelince Haber Ver\" ile anında stok bildirimi",
    iconColor: "text-amber-300",
  },
];

export default function TopAnnouncementBar() {
  return (
    <div
      role="region"
      aria-label="Öne Çıkan Duyurular"
      className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-indigo-900 to-indigo-950 text-white text-[11px] sm:text-xs py-2 border-b border-indigo-800/40 select-none group"
    >
      {/* Left Fade Gradient Mask */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-indigo-950 to-transparent z-10" />

      {/* Scrolling Track (2x copies for seamless infinite loop on any screen width) */}
      <div className="flex animate-marquee cursor-default">
        {/* Set 1 */}
        <div className="flex items-center flex-shrink-0">
          {ANNOUNCEMENT_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={`set1-${item.id}`} className="flex items-center px-4 sm:px-6">
                <Icon className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 ${item.iconColor}`} />
                <span className="whitespace-nowrap font-medium text-slate-100">
                  {item.text}
                </span>
                <span className="text-indigo-400/60 ml-4 sm:ml-6 select-none font-bold text-[10px]">
                  ✦
                </span>
              </div>
            );
          })}
        </div>

        {/* Set 2 (Identical mirror for infinite loop) */}
        <div className="flex items-center flex-shrink-0" aria-hidden="true">
          {ANNOUNCEMENT_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={`set2-${item.id}`} className="flex items-center px-4 sm:px-6">
                <Icon className={`w-3.5 h-3.5 mr-1.5 flex-shrink-0 ${item.iconColor}`} />
                <span className="whitespace-nowrap font-medium text-slate-100">
                  {item.text}
                </span>
                <span className="text-indigo-400/60 ml-4 sm:ml-6 select-none font-bold text-[10px]">
                  ✦
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Fade Gradient Mask */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-indigo-950 to-transparent z-10" />
    </div>
  );
}
