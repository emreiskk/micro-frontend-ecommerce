import React from "react";
import { Terminal, ShieldCheck, Cpu } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-950 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800 text-sm">
          <div>
            <h4 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              Mikro Frontend Mimarisi
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Bu sistem, Next.js Multi-Zone mimarisiyle izole iki bağımsız frontend servisinden oluşur.
              Ana katalog <code>:3000</code> portunda, sepet servisi ise <code>:3001</code> portunda bağımsız çalışır.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-400" />
              Veri Senkronizasyonu
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Uygulamalar arası durum, <code>BroadcastChannel API</code> ve yerel depolama reaktif katmanıyla
              tablar ve mikro servisler arasında gerçek zamanlı ve kayıpsız iletilir.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold text-base mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              DevOps & Containerization
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Her mikro uygulama bağımsız multi-stage <code>Dockerfile</code> ve ortak <code>docker-compose.yml</code>
              ile prodüksiyon ortamında minimal Alpine imajlarıyla orkestre edilmiştir.
            </p>
          </div>
        </div>
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <p>© 2026 TrendSphere — Frontend Developer Task Projesi.</p>
          <div className="flex flex-wrap justify-center sm:justify-end items-center gap-2 sm:gap-4">
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 font-mono text-[11px]">
              Next.js 14 App Router
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 font-mono text-[11px]">
              Tailwind CSS
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 font-mono text-[11px]">
              Docker Compose
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
