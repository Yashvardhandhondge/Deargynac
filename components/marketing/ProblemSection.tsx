"use client";

import { useIsMobile } from "@/hooks/useWindowSize";
import { SUBPAGE_SECTION_PADDING } from "@/components/marketing/sectionSpacing";

const stats = [
  {
    value: "57%",
    label: "Women aged 15\u201349 are anaemic",
    source: "(NFHS-5)",
    bg: "#FDE8F0",
    border: "#FAC8DB",
    color: "#D97894",
  },
  {
    value: "50%+",
    label: "Have never visited a gynecologist",
    bg: "#F3E8FF",
    border: "#E9D5FF",
    color: "#7C3AED",
  },
  {
    value: "9.4%",
    label: "Unmet family planning need",
    bg: "#CCFBF1",
    border: "#99F6E4",
    color: "#0D9488",
  },
  {
    value: "62 mi",
    label: "Average rural woman travels for healthcare",
    bg: "#FEF3C7",
    border: "#FDE68A",
    color: "#D97706",
  },
];

const quotes = [
  {
    text: "I was too ashamed to ask my own mother. I spent months searching online for answers that were wrong, scary, or irrelevant.",
    initial: "P",
    name: "Priya, 24",
    location: "Nagpur, Maharashtra",
    avatarBg: "#E11D48",
  },
  {
    text: "My PCOS went undiagnosed for 3 years because I was told it was \u2018just stress\u2019.",
    initial: "M",
    name: "Meena, 29",
    location: "Indore, Madhya Pradesh",
    avatarBg: "#64748B",
  },
];

export default function ProblemSection() {
  const isMobile = useIsMobile();

  return (
    <section style={{ backgroundColor: "white", padding: SUBPAGE_SECTION_PADDING, overflow: "hidden" }}>
      <div style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto", padding: isMobile ? '0 1rem' : '0 1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '2rem' : '4rem', alignItems: 'start' }}>
          {/* Left column */}
          <div>
            {/* Label pill */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                borderRadius: "9999px",
                padding: "0.5rem 1rem",
                fontSize: "0.75rem",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#D97894",
                border: "1px solid rgba(194, 24, 91, 0.3)",
                backgroundColor: "rgba(194, 24, 91, 0.05)",
              }}
            >
              The Reality
            </span>

            {/* Headline */}
            <h2
              style={{
                marginTop: "1.5rem",
                fontSize: "clamp(1.75rem, 6vw, 3rem)",
                fontWeight: 700,
                color: "#3D3438",
                lineHeight: 1.2,
                fontFamily: '"Playfair Display", Georgia, serif',
              }}
            >
              57% of Indian Women are{" "}
              <span style={{ fontStyle: "italic", color: "#D97894" }}>Anaemic.</span> Most
              Never See a Gynecologist.
            </h2>

            {/* Body paragraph */}
            <p style={{ fontSize: "1.125rem", color: "#4B5563", lineHeight: 1.75, marginTop: "1.5rem", maxWidth: "32rem" }}>
              Across India, women silently endure period pain, reproductive
              health concerns, and pregnancy complications — not because care
              doesn&apos;t exist, but because accessing it feels{" "}
              <span style={{ fontWeight: 700, color: "#3D3438" }}>
                expensive, embarrassing, and out of reach.
              </span>
            </p>

            {/* Stat cards — 2x2 grid */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              {stats.map((stat) => (
                <div
                  key={stat.value}
                  style={{
                    borderRadius: "1rem",
                    padding: "1.5rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                    minWidth: 0,
                    overflow: "hidden",
                    backgroundColor: stat.bg,
                    border: `1px solid ${stat.border}`,
                  }}
                >
                  <span
                    style={{
                      fontSize: "2.25rem",
                      fontWeight: 700,
                      fontFamily: '"Playfair Display", Georgia, serif',
                      color: stat.color,
                    }}
                  >
                    {stat.value}
                  </span>
                  <span style={{ fontSize: "0.875rem", color: "#4B5563" }}>{stat.label}</span>
                  {stat.source && (
                    <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{stat.source}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right column — quotes */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", paddingTop: isMobile ? '0' : '4rem' }}>
            {quotes.map((quote) => (
              <div
                key={quote.name}
                style={{
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  border: "1px solid #f3f4f6",
                  position: "relative",
                  minWidth: 0,
                  wordBreak: "break-word" as any,
                }}
              >
                {/* Decorative quote mark */}
                <span
                  style={{
                    position: "absolute",
                    top: "0.75rem",
                    left: "1rem",
                    fontSize: "3.75rem",
                    color: "#FDE8F0",
                    fontFamily: '"Playfair Display", Georgia, serif',
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  &ldquo;
                </span>

                <p style={{ fontStyle: "italic", color: "#374151", lineHeight: 1.6, fontSize: "1rem", position: "relative", zIndex: 10, paddingTop: "1.5rem" }}>
                  &ldquo;{quote.text}&rdquo;
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1rem" }}>
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "9999px",
                      backgroundColor: quote.avatarBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                    }}
                  >
                    {quote.initial}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#3D3438" }}>
                      {quote.name}
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                      {quote.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
