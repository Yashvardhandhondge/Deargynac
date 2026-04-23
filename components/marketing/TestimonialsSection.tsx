"use client";

import { useIsMobile } from "@/hooks/useWindowSize";

const testimonials = [
  {
    name: "Anjali S.",
    city: "Pune, Maharashtra",
    initial: "A",
    avatarBg: "#E11D48",
    quote:
      "I had been embarrassed about my PCOS for years. DearGynac\u2019s anonymous consultation changed everything. I finally got a proper diagnosis and a real treatment plan in under an hour.",
  },
  {
    name: "Rekha V.",
    city: "Lakhimpur, Uttar Pradesh",
    initial: "R",
    avatarBg: "#64748B",
    quote:
      "Being from a small town in UP, I never thought I could get specialist gynecology advice without traveling to Lucknow. DearGynac\u2019s doctors are available even on weekends. Life-changing.",
  },
  {
    name: "Nisha P.",
    city: "Mumbai, Maharashtra",
    initial: "N",
    avatarBg: "#14B8A6",
    quote:
      "The radiology report review was exceptional. Dr. Kshitija explained my ultrasound results in plain language and connected me immediately to Dr. Snehal for a follow-up. Seamless.",
  },
];

export default function TestimonialsSection() {
  const isMobile = useIsMobile();
  return (
    <section style={{ backgroundColor: "#FDF8F5", padding: "6rem 0" }}>
      <div style={{ maxWidth: "80rem", marginLeft: "auto", marginRight: "auto", padding: "0 1rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center" }}>
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
              color: "#C2185B",
              border: "1px solid rgba(194, 24, 91, 0.3)",
              backgroundColor: "rgba(194, 24, 91, 0.05)",
            }}
          >
            Real Stories
          </span>

          <h2
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#1A0A12",
              fontFamily: '"Playfair Display", Georgia, serif',
              marginTop: "1rem",
            }}
          >
            Women Who Found Their Voice
          </h2>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '2rem', marginTop: '4rem' }}>
          {testimonials.map((t) => (
            <div
              key={t.name}
              style={{
                backgroundColor: "white",
                borderRadius: "1rem",
                padding: "2rem",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                border: "1px solid #f3f4f6",
                overflow: "hidden",
                minWidth: 0,
              }}
            >
              {/* Stars */}
              <div style={{ color: "#D4A017", fontSize: "1.125rem", letterSpacing: "0.05em" }}>
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </div>

              {/* Quote */}
              <p style={{ fontStyle: "italic", color: "#374151", lineHeight: 1.6, fontSize: "1rem", marginTop: "1rem", wordBreak: "break-word" }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Avatar row */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1.5rem" }}>
                <div
                  style={{
                    width: "2.5rem",
                    height: "2.5rem",
                    borderRadius: "9999px",
                    backgroundColor: t.avatarBg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                  }}
                >
                  {t.initial}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1A0A12" }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "#9CA3AF" }}>{t.city}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom rating */}
        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "0.25rem" }}>
            <span style={{ fontSize: "3.75rem", fontWeight: 700, color: "#1A0A12", fontFamily: '"Playfair Display", Georgia, serif' }}>
              4.9
            </span>
            <span style={{ fontSize: "1.5rem", color: "#9CA3AF" }}>/5</span>
          </div>
          <div style={{ color: "#D4A017", fontSize: "1.5rem", marginTop: "0.5rem", letterSpacing: "0.05em" }}>
            &#9733;&#9733;&#9733;&#9733;&#9733;
          </div>
          <p style={{ fontSize: "0.875rem", color: "#9CA3AF", marginTop: "0.5rem" }}>
            Based on 2,400+ verified patient reviews
          </p>
        </div>
      </div>
    </section>
  );
}
