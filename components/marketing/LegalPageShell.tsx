import type { ReactNode } from "react";
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
        <article className="max-w-3xl mx-auto px-4 pt-6 pb-10 sm:pt-8 sm:pb-14">
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
