"use client";

import {
  Shield,
  Lock,
  UserCheck,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Bug,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/useWindowSize";

interface PrivacyFeature {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
}

const features: PrivacyFeature[] = [
  {
    icon: Shield,
    iconBg: "#FDE8F0",
    iconColor: "#C2185B",
    title: "DPDP Act 2023 Compliant",
    desc: "Full compliance with India\u2019s Digital Personal Data Protection Act. Your data is never sold or shared.",
  },
  {
    icon: Lock,
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
    title: "End-to-End Encrypted",
    desc: "All consultations, messages, and reports are encrypted in transit and at rest using AES-256 standards.",
  },
  {
    icon: UserCheck,
    iconBg: "#CCFBF1",
    iconColor: "#0D9488",
    title: "NMC-Verified Doctors",
    desc: "Every doctor is verified against the National Medical Commission registry. MRN visible on all prescriptions.",
  },
  {
    icon: Smartphone,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    title: "ABHA ID Integration",
    desc: "Seamlessly integrate with Ayushman Bharat Digital Mission for a unified health record across India.",
  },
];

const badges = [
  "\u2713 NMC Compliant",
  "\u2713 DPDP 2023",
  "\u2713 ABDM Ready",
  "\u2713 ISO 27001",
];

export default function PrivacySection() {
  const isMobile = useIsMobile();
  return (
    <section id="about" style={{ backgroundColor: "white", padding: "6rem 0" }}>
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
            Your Safety, Our Priority
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
            Privacy isn&apos;t just a feature.
            <br />
            <span style={{ fontStyle: "italic", color: "#C2185B" }}>
              It&apos;s our foundation.
            </span>
          </h2>

          <p style={{ fontSize: "1.125rem", color: "#6B7280", marginTop: "1rem", maxWidth: "48rem", marginLeft: "auto", marginRight: "auto" }}>
            Every interaction on DearGynac is protected by end-to-end
            encryption, strict compliance with India&apos;s DPDP Act 2023, and
            NMC telemedicine guidelines. Your health story belongs to you —
            nobody else.
          </p>
        </div>

        {/* 2-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '2rem' : '4rem', alignItems: 'center', marginTop: '4rem' }}>
          {/* Left — features */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div key={feat.title} style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "0.75rem",
                      backgroundColor: feat.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon style={{ width: "1.25rem", height: "1.25rem", color: feat.iconColor }} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: "#1A0A12", fontSize: "1rem" }}>
                      {feat.title}
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: "#4B5563", lineHeight: 1.6, marginTop: "0.25rem" }}>
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right — shield visual */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "relative", width: isMobile ? "12rem" : "18rem", height: isMobile ? "12rem" : "18rem", overflow: "hidden" }}>
              {/* Outer circle */}
              <div style={{ position: "absolute", inset: 0, backgroundColor: "#FDE8F0", borderRadius: "9999px" }} />

              {/* Inner circle */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: isMobile ? "8rem" : "12rem",
                  height: isMobile ? "8rem" : "12rem",
                  backgroundColor: "#C2185B",
                  borderRadius: "9999px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShieldCheck style={{ width: isMobile ? "3rem" : "5rem", height: isMobile ? "3rem" : "5rem", color: "white" }} />
                <span style={{ color: "white", fontSize: "0.875rem", fontWeight: 600, marginTop: "0.25rem" }}>
                  Protected
                </span>
              </div>

              {/* Floating icons */}
              <div style={{ position: "absolute", top: 0, right: "2rem", backgroundColor: "#880E4F", borderRadius: "9999px", padding: "0.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <Lock style={{ width: "1rem", height: "1rem", color: "white" }} />
              </div>
              <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", backgroundColor: "#E05490", borderRadius: "9999px", padding: "0.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <ShieldAlert style={{ width: "1rem", height: "1rem", color: "white" }} />
              </div>
              <div style={{ position: "absolute", bottom: 0, right: "2rem", backgroundColor: "#9CA3AF", borderRadius: "9999px", padding: "0.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <Eye style={{ width: "1rem", height: "1rem", color: "white" }} />
              </div>
              <div style={{ position: "absolute", left: 0, top: "33%", backgroundColor: "#F59E0B", borderRadius: "9999px", padding: "0.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <Bug style={{ width: "1rem", height: "1rem", color: "white" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Compliance badges */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem", marginTop: "4rem" }}>
          {badges.map((badge) => (
            <span
              key={badge}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "9999px",
                padding: "0.5rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "#4B5563",
                backgroundColor: "white",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
