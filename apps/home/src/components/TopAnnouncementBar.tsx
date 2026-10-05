"use client";

import React from "react";
import { Tag, Truck, Sparkles } from "lucide-react";

export interface AnnouncementItem {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  prefix: string;
  highlight: string;
  suffix: string;
  isCode?: boolean;
}

const ANNOUNCEMENT_ITEMS: AnnouncementItem[] = [
  {
    id: "coupon",
    icon: Tag,
    iconColor: "text-amber-400",
    prefix: "Sepetinizde",
    highlight: "TREND10",
    suffix: "kupon kodu ile anında %10 indirim kazanın!",
    isCode: true,
  },
  {
    id: "shipping",
    icon: Truck,
    iconColor: "text-emerald-400",
    prefix: "TrendSphere'de",
    highlight: "$75 ve üzeri",
    suffix: "tüm siparişlerde Kargo Bedava!",
    isCode: false,
  },
  {
    id: "discount",
    icon: Sparkles,
    iconColor: "text-indigo-400",
    prefix: "Seçili sezon ürünlerinde",
    highlight: "%30'a varan",
    suffix: "Mağaza İndirimi fırsatını kaçırmayın!",
    isCode: false,
  },
];

export default function TopAnnouncementBar() {
  return (
    <div
      role="region"
      aria-label="Öne Çıkan Kampanyalar ve Duyurular"
      className="relative overflow-hidden bg-slate-950 text-white text-[11px] sm:text-xs py-2 border-b border-slate-800/80 select-none group"
    >
      {/* Left Fade Gradient Mask */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-slate-950 to-transparent z-10" />

      {/* Scrolling Track (2x copies for seamless infinite loop on any screen width) */}
      <div className="flex animate-marquee cursor-default">
        {/* Set 1 */}
        <div className="flex items-center flex-shrink-0">
          {ANNOUNCEMENT_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={`set1-${item.id}`} className="flex items-center px-4 sm:px-6">
                <Icon className={`w-3.5 h-3.5 mr-2 flex-shrink-0 ${item.iconColor}`} />
                <span className="whitespace-nowrap font-medium text-slate-300">
                  {item.prefix}{" "}
                  {item.isCode ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 mx-1 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 font-mono font-bold tracking-wider text-[11px]">
                      {item.highlight}
                    </span>
                  ) : (
                    <strong className="text-white font-semibold">{item.highlight}</strong>
                  )}{" "}
                  {item.suffix}
                </span>
                <span className="text-slate-600 ml-4 sm:ml-6 select-none font-bold text-[10px]">
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
                <Icon className={`w-3.5 h-3.5 mr-2 flex-shrink-0 ${item.iconColor}`} />
                <span className="whitespace-nowrap font-medium text-slate-300">
                  {item.prefix}{" "}
                  {item.isCode ? (
                    <span className="inline-flex items-center px-1.5 py-0.5 mx-1 rounded bg-amber-400/15 text-amber-300 border border-amber-400/30 font-mono font-bold tracking-wider text-[11px]">
                      {item.highlight}
                    </span>
                  ) : (
                    <strong className="text-white font-semibold">{item.highlight}</strong>
                  )}{" "}
                  {item.suffix}
                </span>
                <span className="text-slate-600 ml-4 sm:ml-6 select-none font-bold text-[10px]">
                  ✦
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Fade Gradient Mask */}
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-slate-950 to-transparent z-10" />
    </div>
  );
}
