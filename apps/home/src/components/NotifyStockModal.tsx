"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Bell, X, CheckCircle2, Mail, Phone, Sparkles } from "lucide-react";
import type { Product, SelectedAttributes } from "@repo/shared-types";

interface NotifyStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedAttributes: SelectedAttributes;
  onSuccessToast?: (msg: string) => void;
}

export default function NotifyStockModal({
  isOpen,
  onClose,
  product,
  selectedAttributes,
  onSuccessToast,
}: NotifyStockModalProps) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const variantSummary = Object.entries(selectedAttributes)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" • ");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Lütfen geçerli bir e-posta adresi girin.");
      return;
    }

    setError("");
    // Save to local storage for persistence
    try {
      const stored = localStorage.getItem("stock_notifications") || "[]";
      const list = JSON.parse(stored);
      list.push({
        productId: product.id,
        title: product.title,
        attributes: selectedAttributes,
        email,
        phone,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("stock_notifications", JSON.stringify(list));
    } catch {}

    setIsSubmitted(true);
    if (onSuccessToast) {
      onSuccessToast("Bildirim talebiniz alındı! Ürün stoğa girdiğinde bilgilendirileceksiniz.");
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setEmail("");
    setPhone("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/25">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Gelince Haber Ver</h3>
              <p className="text-xs text-slate-500">Stok yenilendiğinde ilk siz haberdar olun</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* Selected Product & Variant Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3.5 mb-5">
            <div className="relative w-16 h-16 rounded-xl bg-white p-1.5 flex-shrink-0 border border-slate-100 flex items-center justify-center overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-1"
                sizes="64px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{product.title}</h4>
              {variantSummary && (
                <span className="inline-block mt-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {variantSummary}
                </span>
              )}
              <span className="block text-[11px] font-bold text-rose-500 mt-1">
                • Şu anda stoklarımızda tükenmiştir
              </span>
            </div>
          </div>

          {isSubmitted ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-black text-slate-900">Talebiniz Başarıyla Alındı!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  <span className="font-bold text-slate-700">{email}</span> adresine bu varyant stoğa girdiği an özel bildirim gönderilecektir.
                </p>
              </div>
              <button
                onClick={handleClose}
                className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
              >
                Anladım / Kapat
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  E-Posta Adresiniz <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@trendsphere.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Telefon Numaranız <span className="text-slate-400 font-normal">(Opsiyonel - SMS için)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold">
                  {error}
                </div>
              )}

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Bildirim talebi oluşturarak, bu ürün tekrar stoğa girdiğinde bilgilendirme e-postası ve SMS almayı kabul etmiş olursunuz.
              </p>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25 active:scale-98 cursor-pointer"
                >
                  <Bell className="w-4 h-4" />
                  <span>Bildirim Talebini Kaydet</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
