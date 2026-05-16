"use client";

import {
  UserCheck,
  ClipboardList,
  Video,
  FlaskConical,
  HeartPulse,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/useWindowSize";

interface Step {
  num: string;
  icon: LucideIcon;
  title: string;
  desc: string;
}

const steps: Step[] = [
  {
    num: "01",
    icon: UserCheck,
    title: "Create Anonymous Profile",
    desc: "No real name required. Start with just a nickname and your health concern. Your identity stays private \u2014 always.",
  },
  {
    num: "02",
    icon: ClipboardList,
    title: "Describe Your Concern",
    desc: "Answer a few guided questions about your symptoms. Our intelligent intake form routes you to the right specialist.",
  },
  {
    num: "03",
    icon: Video,
    title: "Consult Your Expert",
    desc: "Chat, audio, or video consultation with a verified gynecologist, radiologist, or surgeon \u2014 your choice of modality.",
  },
  {
    num: "04",
    icon: FlaskConical,
    title: "Diagnostics at Home",
    desc: "Get lab tests, ultrasounds, and radiology reports ordered and delivered \u2014 home sample collection available in 300+ cities.",
  },
  {
    num: "05",
    icon: HeartPulse,
    title: "Ongoing Care & Follow-up",
    desc: "Personalized treatment plans, medication reminders, follow-up consultations, and community support \u2014 all in one place.",
  },
];

export default function JourneySection() {
  const isMobile = useIsMobile();

  return (
    <section style={{ backgroundColor: "white", padding: "6rem 0" }}>
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
            Simple &amp; Safe
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
            Your Complete Care Journey
          </h2>

          <p style={{ fontSize: "1.125rem", color: "#6B7280", marginTop: "1rem", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
            From your first question to full recovery — we&apos;re with you at
            every step.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'flex-start', justifyContent: 'center', gap: isMobile ? '2rem' : '0', marginTop: '4rem', overflowX: 'hidden', width: '100%' }}>
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.num} style={{ display: "flex", alignItems: "flex-start" }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: isMobile ? 'flex-start' : 'center', textAlign: isMobile ? 'left' as const : 'center' as const, gap: isMobile ? '1rem' : '0' }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9CA3AF", marginBottom: "0.75rem" }}>
                    {step.num}
                  </span>
                  <div
                    style={{
                      width: "4rem",
                      height: "4rem",
                      borderRadius: "1rem",
                      backgroundColor: "#FDE8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon style={{ width: "1.75rem", height: "1.75rem", color: "#D97894" }} />
                  </div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "#3D3438",
                      marginTop: "1rem",
                      fontFamily: '"Playfair Display", Georgia, serif',
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "0.875rem", color: "#6B7280", lineHeight: 1.6, marginTop: "0.5rem", maxWidth: "180px", marginLeft: "auto", marginRight: "auto" }}>
                    {step.desc}
                  </p>
                </div>

                {/* Arrow between steps (desktop only) */}
                {!isMobile && i < steps.length - 1 && (
                  <ChevronRight style={{ color: "#FAC8DB", width: "1.5rem", height: "1.5rem", flexShrink: 0, marginTop: "2rem", marginLeft: "0.5rem", marginRight: "0.5rem" }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: "4rem", textAlign: "center" }}>
          <Link
            href="/patient/book"
            style={{
              display: isMobile ? "block" : "inline-block",
              backgroundColor: "#D97894",
              color: "white",
              borderRadius: "9999px",
              padding: "1rem 2.5rem",
              fontWeight: 600,
              fontSize: "1rem",
              textDecoration: "none",
              width: isMobile ? "100%" : "auto",
              textAlign: "center",
            }}
          >
            Begin Your Care Journey &rarr;
          </Link>
          <p style={{ fontSize: "0.875rem", color: "#9CA3AF", marginTop: "0.75rem" }}>
            First consultation free for new accounts &middot; then from &#8377;149 &middot; Completely confidential
          </p>
        </div>
      </div>
    </section>
  );
}
