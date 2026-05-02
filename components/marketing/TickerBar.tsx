"use client";

const items = [
  "Market CAGR: 23%",
  "57% of Indian women are anaemic",
  "70% have never paid for an online medical service",
  "Diagnostics Market: $28B by 2034",
  "300M+ women aged 15–55 in India",
  "India Women's Health market growing rapidly",
];

export default function TickerBar() {
  return (
    <div className="relative w-full bg-[#880E4F] overflow-hidden py-2" style={{ width: '100%', maxWidth: '100vw' }}>
      <div className="ticker-animate whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-xs sm:text-sm font-medium mx-1">
            {item}
            <span className="ticker-sep mx-3">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
