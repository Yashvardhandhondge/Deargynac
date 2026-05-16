"use client";

import { Shield } from "lucide-react";
import { useIsMobile } from "@/hooks/useWindowSize";

/**
 * Homepage shows a fixed placeholder only. Patient reviews after visits are
 * collected for the care team / doctor workflow; we do not surface raw public
 * feedback here until you opt in later (moderation, marketing control).
 */
export default function PlatformReviewsSection() {
  const isMobile = useIsMobile();

  return (
    <section
      id="reviews"
      style={{
        backgroundColor: "#FFFFFF",
        padding: "6rem 0",
        borderTop: "1px solid #F3E8EC",
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
            Platform reviews
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
            Your feedback matters
            <br />
            <span style={{ fontStyle: "italic", color: "#D97894" }}>
              — shared with your care team first
            </span>
          </h2>

          <p
            style={{
              fontSize: "1.0625rem",
              color: "#6B7280",
              marginTop: "1rem",
              maxWidth: "42rem",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.65,
            }}
          >
            After a completed visit you can rate the experience from your consultation
            screen; that data is available to your doctors for quality and follow-up. We
            are not publishing live patient quotes on the homepage yet so unmoderated
            feedback never appears in marketing by accident.
          </p>
        </div>

        {/* Static illustrative review — not live patient data */}
        <div
          style={{
            marginTop: "2.5rem",
            maxWidth: "36rem",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "1rem",
              padding: isMobile ? "1.5rem" : "2rem",
              border: "1px solid #f3f4f6",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  color: "#9D174D",
                  backgroundColor: "#FFF1F5",
                  borderRadius: "9999px",
                  padding: "0.3rem 0.65rem",
                  border: "1px solid rgba(157, 23, 77, 0.2)",
                }}
              >
                <Shield style={{ width: "0.75rem", height: "0.75rem" }} aria-hidden />
                Anonymous review
              </span>
              <span style={{ fontSize: "0.7rem", color: "#9CA3AF" }}>Illustrative</span>
            </div>
            <div
              style={{
                color: "#D4A017",
                fontSize: "1.125rem",
                letterSpacing: "0.05em",
                marginBottom: "0.75rem",
              }}
            >
              &#9733;&#9733;&#9733;&#9733;&#9733;
            </div>
            <p
              style={{
                fontStyle: "italic",
                color: "#374151",
                lineHeight: 1.6,
                fontSize: "1rem",
                margin: 0,
              }}
            >
              &ldquo;I felt heard—not rushed—and the call quality was sharp throughout. I
              chose to post anonymously, so nothing with my name shows up here, but I still
              wanted others to know the care felt respectful and professional. I have
              already scheduled my follow-up.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
