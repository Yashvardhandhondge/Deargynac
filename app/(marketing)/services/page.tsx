"use client";

import Link from "next/link";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import MarketingPageHeader from "@/components/marketing/MarketingPageHeader";
import { useLang } from "@/context/LanguageContext";
import { serviceCategories, categoryTitle } from "@/lib/services";

export default function ServicesDirectoryPage() {
  const { lang } = useLang();

  return (
    <MarketingSubPage>
      <MarketingPageHeader
        title="Our services"
        subtitle="Book online women&apos;s health care across consultations, hormone health, fertility, integrative programs, and more."
      />
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <Link
            href="/patient/book"
            className="inline-block bg-[#D97894] text-white rounded-full px-8 py-3 text-sm font-semibold hover:bg-[#C45F7E] transition-colors"
          >
            Book a consultation
          </Link>
        </div>

        <div className="space-y-16 pb-12 sm:pb-16">
          {serviceCategories.map((cat) => (
              <section key={cat.id} id={cat.id} className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: cat.bgColor }}
                  >
                    {cat.icon}
                  </div>
                  <h2
                    className="text-2xl font-bold text-[#3D3438] font-serif"
                    style={{ color: cat.color }}
                  >
                    {categoryTitle(cat, lang)}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.services.map((s) => (
                    <div
                      key={s.id}
                      className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col"
                    >
                      {s.featured && (
                        <span className="self-start text-xs font-bold uppercase tracking-wide text-rose-600 mb-2">
                          Featured
                        </span>
                      )}
                      <h3 className="font-bold text-[#3D3438] text-lg">
                        {s.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2 flex-1">
                        {s.desc}
                      </p>
                      <div className="mt-4 flex items-center justify-between gap-2 flex-wrap">
                        <span className="inline-flex rounded-full bg-rose-50 text-[#C2185B] px-3 py-1 text-sm font-bold">
                          ₹{s.price}
                        </span>
                        <Link
                          href="/patient/book"
                          className="inline-flex items-center rounded-full bg-[#D97894] text-white px-4 py-2 text-sm font-semibold hover:bg-[#C45F7E] transition-colors"
                        >
                          Book →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
          ))}
        </div>
      </div>
    </MarketingSubPage>
  );
}
