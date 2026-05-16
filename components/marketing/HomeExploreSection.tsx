"use client";

import Link from "next/link";
import {
  HeartPulse,
  LayoutGrid,
  ListOrdered,
  UserRound,
  IndianRupee,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const tiles: {
  href: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
}[] = [
  {
    href: "/why-deargynac",
    title: "Why DearGynac",
    blurb: "The gap in women’s health access — context in plain language.",
    icon: HeartPulse,
  },
  {
    href: "/services",
    title: "Care & services",
    blurb: "Consultations, hormones, fertility, diagnostics, and more.",
    icon: LayoutGrid,
  },
  {
    href: "/how-it-works",
    title: "How it works",
    blurb: "From anonymous signup to follow-up — step by step.",
    icon: ListOrdered,
  },
  {
    href: "/doctors",
    title: "Our doctors",
    blurb: "NMC-aligned specialists you’ll see on the platform.",
    icon: UserRound,
  },
  {
    href: "/pricing",
    title: "Plans & pricing",
    blurb: "Transparent fees and what each plan includes.",
    icon: IndianRupee,
  },
  {
    href: "/trust",
    title: "Privacy & trust",
    blurb: "DPDP-aligned practices — no sale of your health data.",
    icon: Shield,
  },
];

export default function HomeExploreSection() {
  return (
    <section className="bg-white py-14 sm:py-20 border-t border-rose-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#D97894] border border-rose-200/80 bg-rose-50/50">
            Explore
          </span>
          <h2
            className="mt-4 text-3xl sm:text-4xl font-bold text-[#3D3438]"
            style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
          >
            Everything in one place — at your pace
          </h2>
          <p className="mt-3 text-gray-600 text-sm sm:text-base leading-relaxed">
            The homepage stays short. Open a topic below for detail, stories, and pricing — then book when
            you&apos;re ready.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="group flex flex-col rounded-2xl border border-gray-100 bg-[#FFFBFC] p-5 sm:p-6 shadow-sm hover:border-[#D97894]/40 hover:shadow-md transition-all text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-[#D97894]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-[#3D3438] text-lg group-hover:text-[#D97894] transition-colors">
                      {t.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-gray-600 leading-snug">{t.blurb}</p>
                    <span className="mt-4 inline-flex items-center text-sm font-semibold text-[#D97894]">
                      Learn more
                      <span className="ml-1 transition-transform group-hover:translate-x-0.5" aria-hidden>
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-gray-500">
          Patient stories:{" "}
          <Link href="/stories" className="font-semibold text-[#D97894] hover:underline">
            Read real experiences
          </Link>
        </p>
      </div>
    </section>
  );
}
