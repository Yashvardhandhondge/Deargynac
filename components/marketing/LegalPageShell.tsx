import type { ReactNode } from "react";
import Link from "next/link";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export default function LegalPageShell({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-16 min-h-screen bg-[#FDF8F5]">
        <article className="max-w-3xl mx-auto px-4 py-10 sm:py-14 pb-20">
          <nav className="text-sm text-[#6B5F63] mb-6">
            <Link href="/" className="text-[#D97894] font-medium hover:underline">
              Home
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-[#3D3438]">{title}</span>
          </nav>
          <h1
            className="font-serif text-3xl sm:text-4xl font-bold text-[#3D3438] tracking-tight"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            {title}
          </h1>
          <p className="text-xs text-gray-500 mt-2 mb-10">Last updated: {lastUpdated}</p>
          <div className="space-y-8 text-sm sm:text-[0.9375rem] text-[#4B5563] leading-relaxed">
            {children}
          </div>
        </article>
      </div>
      <Footer />
    </>
  );
}
