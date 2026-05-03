"use client";

import Link from "next/link";
import { useIsMobile, useIsTablet } from "@/hooks/useWindowSize";
import { serviceCategories, categoryTitle } from "@/lib/services";
import { useLang } from "@/context/LanguageContext";

const previewCategories = serviceCategories.slice(0, 8);

export default function ServicesSection() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const { lang } = useLang();

  const gridCols = isMobile ? "1fr" : isTablet ? "1fr 1fr" : "repeat(4, 1fr)";

  return (
    <section
      id="care"
      style={{
        backgroundColor: "#FFF7F9",
        padding: "6rem 0",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          marginLeft: "auto",
          marginRight: "auto",
          padding: "0 1rem",
        }}
      >
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
              color: "#D97894",
              border: "1px solid rgba(194, 24, 91, 0.3)",
              backgroundColor: "rgba(194, 24, 91, 0.05)",
            }}
          >
            Comprehensive Care
          </span>

          <h2
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "#3D3438",
              fontFamily: '"Playfair Display", Georgia, serif',
              marginTop: "1rem",
            }}
          >
            Everything Your Health Needs
          </h2>

          <p
            style={{
              fontSize: "1.125rem",
              color: "#6B7280",
              marginTop: "1rem",
              maxWidth: "42rem",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Holistic women&apos;s healthcare from puberty to post-menopause —
            clinically backed, compassionately delivered.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: gridCols,
            gap: "1.5rem",
            marginTop: "4rem",
            width: "100%",
          }}
        >
          {previewCategories.map((cat) => {
            const preview = cat.services.slice(0, 3);
            const n = cat.services.length;
            return (
              <div
                key={cat.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  border: "1px solid #f3f4f6",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "0.75rem",
                    backgroundColor: cat.bgColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.5rem",
                  }}
                >
                  {cat.icon}
                </div>

                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "#3D3438",
                    marginTop: "1rem",
                    fontFamily: '"Playfair Display", Georgia, serif',
                  }}
                >
                  {categoryTitle(cat, lang)}
                </h3>

                <p
                  style={{
                    fontSize: "0.8rem",
                    color: "#9CA3AF",
                    marginTop: "0.25rem",
                    lineHeight: 1.4,
                  }}
                >
                  {cat.services[0]?.desc}
                </p>

                <ul
                  style={{
                    marginTop: "0.75rem",
                    listStyle: "none",
                    padding: 0,
                    flex: 1,
                  }}
                >
                  {preview.map((s) => (
                    <li
                      key={s.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        color: "#4B5563",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <span
                        style={{
                          color: cat.color,
                          fontWeight: 700,
                          fontSize: "1rem",
                        }}
                      >
                        ✓
                      </span>
                      <span>{s.title}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/services#${cat.id}`}
                  style={{
                    display: "inline-block",
                    marginTop: "1rem",
                    color: "#D97894",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  View all {n} services →
                </Link>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link
            href="/services"
            style={{
              display: "inline-block",
              border: "2px solid #D97894",
              color: "#D97894",
              borderRadius: "9999px",
              padding: "1rem 2.5rem",
              fontWeight: 600,
              textDecoration: "none",
              width: isMobile ? "100%" : "auto",
            }}
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
