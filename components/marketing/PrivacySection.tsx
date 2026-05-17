"use client";

import Link from "next/link";
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
import { SUBPAGE_SECTION_PADDING } from "@/components/marketing/sectionSpacing";

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
    iconColor: "#D97894",
    title: "India: DPDP Act, 2023",
    desc: "We process digital personal data as a data fiduciary under India\u2019s Digital Personal Data Protection Act, 2023 — including purpose limitation, reasonable security safeguards, and honouring your rights where they apply.",
  },
  {
    icon: Lock,
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
    title: "No sale of your data",
    desc: "We do not sell personal or health data to brokers or advertisers. Limited sharing only runs the service (e.g. your doctor, secure hosting) or meets a legal obligation.",
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
    title: "Secure by design",
    desc: "Encryption in transit, access controls, and least-privilege practices for consultation data and health records.",
  },
];

const badges = [
  "\u2713 DPDP Act, 2023",
  "\u2713 No data brokerage",
  "\u2713 NMC telemedicine alignment",
  "\u2713 Defined retention policy",
];

export default function PrivacySection() {
  const isMobile = useIsMobile();
  return (
    <section id="trust" style={{ backgroundColor: "white", padding: SUBPAGE_SECTION_PADDING }}>
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
              color: "#D97894",
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
              color: "#3D3438",
              fontFamily: '"Playfair Display", Georgia, serif',
              marginTop: "1rem",
            }}
          >
            Privacy isn&apos;t just a feature.
            <br />
            <span style={{ fontStyle: "italic", color: "#D97894" }}>
              It&apos;s our foundation.
            </span>
          </h2>

          <p style={{ fontSize: "1.125rem", color: "#6B7280", marginTop: "1rem", maxWidth: "48rem", marginLeft: "auto", marginRight: "auto" }}>
            Indian law — chiefly the{" "}
            <strong style={{ color: "#4B5563" }}>Digital Personal Data Protection Act, 2023</strong> — sets how
            digital personal data must be collected, used, stored, and shared. DearGynac is built to follow those
            duties: we do <strong style={{ color: "#4B5563" }}>not</strong> sell your data, we keep health
            information only as long as clinically and legally appropriate, and we align clinical workflows with
            NMC telemedicine expectations.
          </p>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "#6B7280",
              marginTop: "1.25rem",
              maxWidth: "48rem",
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.65,
            }}
          >
            <Link href="/privacy" style={{ color: "#D97894", fontWeight: 600, textDecoration: "none" }}>
              Privacy Policy
            </Link>
            <span style={{ color: "#D1D5DB", margin: "0 0.65rem" }}>|</span>
            <Link href="/terms" style={{ color: "#D97894", fontWeight: 600, textDecoration: "none" }}>
              Terms of Service
            </Link>
            <span style={{ display: "block", marginTop: "0.5rem", fontSize: "0.8125rem", color: "#9CA3AF" }}>
              Summaries on this page are informational; the linked documents are the reference for hosting and
              compliance checks.
            </span>
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
                    <h3 style={{ fontWeight: 700, color: "#3D3438", fontSize: "1rem" }}>
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
                  backgroundColor: "#D97894",
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
              <div style={{ position: "absolute", top: 0, right: "2rem", backgroundColor: "#C45F7E", borderRadius: "9999px", padding: "0.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                <Lock style={{ width: "1rem", height: "1rem", color: "white" }} />
              </div>
              <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", backgroundColor: "#E896B0", borderRadius: "9999px", padding: "0.5rem", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
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
