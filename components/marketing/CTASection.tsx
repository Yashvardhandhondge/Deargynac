"use client";

import Link from "next/link";
import { useIsMobile } from "@/hooks/useWindowSize";

const ink = "#3D3438";
const pink = "#D97894";

export default function CTASection() {
  const isMobile = useIsMobile();
  return (
    <section
      style={{
        padding: isMobile ? "3rem 1.5rem" : "5rem 1rem",
        background: "linear-gradient(135deg, #FFF5F8 0%, #FFE8F0 45%, #F8D0E0 100%)",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "56rem", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
        <div style={{ color: "rgba(217, 120, 148, 0.45)", fontSize: "3rem", marginBottom: "1rem" }}>&hearts;</div>

        <h2
          style={{
            color: ink,
            fontSize: "clamp(1.75rem, 6vw, 3rem)",
            fontWeight: 700,
            fontFamily: '"Playfair Display", Georgia, serif',
          }}
        >
          Your Health Can&apos;t Wait.
        </h2>
        <h2
          style={{
            color: ink,
            fontStyle: "italic",
            fontSize: "clamp(1.75rem, 6vw, 3rem)",
            fontWeight: 700,
            fontFamily: '"Playfair Display", Georgia, serif',
            marginTop: "0.25rem",
          }}
        >
          And Neither Should You.
        </h2>

        <p
          style={{
            color: "rgba(61, 52, 56, 0.82)",
            fontSize: "1.125rem",
            marginTop: "1.5rem",
            maxWidth: "42rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Join thousands of women across India who are taking charge of their
          health — privately, confidently, and on their own terms.
        </p>

        <div
          style={{
            marginTop: "2.5rem",
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <Link
            href="/patient/book"
            style={{
              backgroundColor: pink,
              color: "#ffffff",
              fontWeight: 600,
              borderRadius: "9999px",
              padding: "1rem 2rem",
              textDecoration: "none",
              width: isMobile ? "100%" : "auto",
              textAlign: "center",
              boxShadow: "0 4px 14px rgba(217, 120, 148, 0.35)",
            }}
          >
            Book Anonymous Consultation
          </Link>
          <a
            href="/services"
            style={{
              border: `2px solid ${pink}`,
              color: pink,
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              borderRadius: "9999px",
              padding: "1rem 2rem",
              fontWeight: 600,
              textDecoration: "none",
              width: isMobile ? "100%" : "auto",
              textAlign: "center",
            }}
          >
            Explore All Services
          </a>
        </div>

        <p style={{ color: "rgba(61, 52, 56, 0.55)", fontSize: "0.875rem", marginTop: "1.5rem" }}>
          No credit card required &middot; Your first consultation is free when you sign in as a new patient
        </p>
      </div>
    </section>
  );
}
