"use client";

import Link from "next/link";

export default function MarketingPageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="bg-[#FDF8F5] border-b border-rose-100/80">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-12 text-center">
        <nav className="text-sm text-[#6B5F63] mb-3">
          <Link href="/" className="text-[#D97894] font-medium hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-300">/</span>
          <span className="text-[#3D3438]">{title}</span>
        </nav>
        <h1
          className="text-3xl sm:text-4xl font-bold text-[#3D3438] tracking-tight"
          style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        ) : null}
      </div>
    </header>
  );
}
