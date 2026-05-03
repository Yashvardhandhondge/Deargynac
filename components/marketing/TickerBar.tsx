"use client";

import { useState, useEffect } from "react";

const items = [
  "Market CAGR: 23%",
  "57% of Indian women are anaemic",
  "70% have never paid for an online medical service",
  "Diagnostics Market: $28B by 2034",
  "300M+ women aged 15–55 in India",
  "India Women's Health market growing rapidly",
];

/** After this scroll offset, the bar switches to the “floating” glass style. */
const SCROLL_THRESHOLD = 56;

export default function TickerBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "sticky top-16 z-40 w-full overflow-hidden transition-[padding,box-shadow,background-color,border-color] duration-500 ease-out",
        scrolled
          ? "py-1.5 bg-white/70 backdrop-blur-xl border-b border-rose-200/70 shadow-[0_10px_40px_-12px_rgba(217,120,148,0.35)] ring-1 ring-rose-100/60"
          : "py-2 bg-[#F5D0DC] border-b border-rose-200/60 shadow-none",
      ].join(" ")}
      style={{ width: "100%", maxWidth: "100vw" }}
    >
      {/* Accent only when scrolled — makes the stuck state feel intentional */}
      {scrolled && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[#D97894] to-transparent opacity-80"
          aria-hidden
        />
      )}

      <div className="relative flex w-full min-w-0 items-center">
        {scrolled && (
          <div
            className="hidden sm:flex shrink-0 items-center border-r border-rose-200/70 bg-rose-50/50 px-3"
            aria-hidden
          >
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#D97894]">
              Live
            </span>
          </div>
        )}
        <div
          className={[
            "ticker-animate min-w-0 flex-1 whitespace-nowrap text-neutral-950",
            scrolled ? "text-xs py-0.5" : "text-xs sm:text-sm",
          ].join(" ")}
        >
          {[...items, ...items].map((item, i) => (
            <span
              key={i}
              className={[
                "font-medium mx-1 text-neutral-950",
                scrolled && "tracking-wide",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {item}
              <span className="ticker-sep mx-3">·</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
