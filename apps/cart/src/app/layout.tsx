import type { Metadata } from "next";
import "./globals.css";
import CartNavbar from "@/components/CartNavbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Sepetim | TrendSphere Cart Mikro Frontend Servisi",
  description: "Next.js App Router ile izole geliştirilmiş bağımsız Cart mikro frontend servisi.",
  icons: {
    icon: "/cart/icon.svg",
    shortcut: "/cart/icon.svg",
    apple: "/cart/icon.svg",
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <CartNavbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
