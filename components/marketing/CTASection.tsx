"use client";

import Link from "next/link";
import { useIsMobile } from "@/hooks/useWindowSize";

export default function CTASection() {
  const isMobile = useIsMobile();
  return (
    <section
      style={{
        padding: isMobile ? "3rem 1.5rem" : "5rem 1rem",
        background: "linear-gradient(to right, #880E4F, #C2185B, #9C27B0)",
      }}
    >
      <div style={{ maxWidth: "56rem", marginLeft: "auto", marginRight: "auto", textAlign: "center" }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "3rem", marginBottom: "1rem" }}>&hearts;</div>

        <h2
          style={{
            color: "white",
            fontSize: "clamp(1.75rem, 6vw, 3rem)",
            fontWeight: 700,
            fontFamily: '"Playfair Display", Georgia, serif',
          }}
        >
          Your Health Can&apos;t Wait.
        </h2>
        <h2
          style={{
            color: "white",
            fontStyle: "italic",
            fontSize: "clamp(1.75rem, 6vw, 3rem)",
            fontWeight: 700,
            fontFamily: '"Playfair Display", Georgia, serif',
            marginTop: "0.25rem",
          }}
        >
          And Neither Should You.
        </h2>

        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1.125rem", marginTop: "1.5rem", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
          Join thousands of women across India who are taking charge of their
          health — privately, confidently, and on their own terms.
        </p>

        <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: isMobile ? "column" : "row", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/patient/book"
            style={{
              backgroundColor: "white",
              color: "#C2185B",
              fontWeight: 600,
              borderRadius: "9999px",
              padding: "1rem 2rem",
              textDecoration: "none",
              width: isMobile ? "100%" : "auto",
              textAlign: "center",
            }}
          >
            Book Anonymous Consultation
          </Link>
          <a
            href="#care"
            style={{
              border: "2px solid white",
              color: "white",
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

        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", marginTop: "1.5rem" }}>
          No credit card required &middot; Free first health assessment
        </p>
      </div>
    </section>
  );
}
