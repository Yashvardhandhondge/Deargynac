"use client";

import {
  MessageCircle,
  Calendar,
  Heart,
  FlaskConical,
  Activity,
  Stethoscope,
  Users,
  BookOpen,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useIsMobile, useIsTablet } from "@/hooks/useWindowSize";

interface ServiceCard {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
}

const row1: ServiceCard[] = [
  {
    icon: MessageCircle,
    iconBg: "#FDE8F0",
    iconColor: "#C2185B",
    title: "Anonymous Consultations",
    description:
      "Private, stigma-free consultations via chat, voice or video. Your identity is protected. Your questions deserve real answers.",
    bullets: [
      "No real name required",
      "End-to-end encrypted",
      "Verified MRN doctors only",
    ],
    cta: "Book Now \u2192",
  },
  {
    icon: Calendar,
    iconBg: "#F3E8FF",
    iconColor: "#7C3AED",
    title: "Period & Cycle Tracking",
    description:
      "Smart period tracker with ovulation prediction, PMS insights, and doctor-reviewed symptom alerts.",
    bullets: [
      "AI-powered predictions",
      "Symptom logging",
      "Doctor alerts on anomalies",
    ],
    cta: "Track Cycle \u2192",
  },
  {
    icon: Heart,
    iconBg: "#FCE7F3",
    iconColor: "#DB2777",
    title: "Pregnancy & Fertility Care",
    description:
      "Complete pregnancy journey support \u2014 preconception counseling, antenatal care, IVF guidance, and postpartum support.",
    bullets: [
      "Preconception planning",
      "Trimester-by-trimester guidance",
      "Fertility treatment support",
    ],
    cta: "Learn More \u2192",
  },
  {
    icon: FlaskConical,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    title: "Diagnostics Integration",
    description:
      "Radiology, pathology, and ultrasound reports reviewed by in-house specialists with Dr. Kshitija Borkar\u2019s radiology expertise.",
    bullets: [
      "Home sample collection",
      "Digital report review",
      "300+ lab network",
    ],
    cta: "Get Tested \u2192",
  },
];

const row2: ServiceCard[] = [
  {
    icon: Activity,
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
    title: "PCOS / Hormonal Health",
    description:
      "Specialized PCOS management, thyroid health, hormone panels, and personalized lifestyle + treatment protocols.",
    bullets: [
      "Hormonal panel tests",
      "Lifestyle protocols",
      "Long-term management plan",
    ],
    cta: "Manage PCOS \u2192",
  },
  {
    icon: Stethoscope,
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
    title: "Surgical Guidance & Referrals",
    description:
      "Pre- and post-surgical consultations with Dr. Praveen Borkar for fibroids, endometriosis, and complex gynecological procedures.",
    bullets: [
      "Second opinion service",
      "Pre-op preparation",
      "Post-op care plans",
    ],
    cta: "Get Opinion \u2192",
  },
  {
    icon: Users,
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
    title: "Community & Support",
    description:
      "Moderated, expert-backed community forums where women share experiences, get peer support, and find evidence-based answers.",
    bullets: [
      "Doctor-moderated forums",
      "Anonymous sharing",
      "Weekly expert Q&A",
    ],
    cta: "Join Community \u2192",
  },
  {
    icon: BookOpen,
    iconBg: "#FBF3DC",
    iconColor: "#A67C00",
    title: "Health Education Hub",
    description:
      "Doctor-authored articles, video guides, and self-assessment tools in Hindi and English \u2014 designed for Tier 1, 2 & 3 India.",
    bullets: [
      "Hindi + English content",
      "Self-assessment tools",
      "Video explainers",
    ],
    cta: "Start Learning \u2192",
  },
];

function Card({ card }: { card: ServiceCard }) {
  const Icon = card.icon;
  return (
    <div
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
      {/* Icon */}
      <div
        style={{
          width: "3rem",
          height: "3rem",
          borderRadius: "0.75rem",
          backgroundColor: card.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={22} style={{ color: card.iconColor }} />
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: 700,
          color: "#1A0A12",
          marginTop: "1rem",
          fontFamily: '"Playfair Display", Georgia, serif',
        }}
      >
        {card.title}
      </h3>

      {/* Description */}
      <p style={{ fontSize: "0.875rem", color: "#4B5563", lineHeight: 1.6, marginTop: "0.5rem", overflow: "hidden", textOverflow: "ellipsis" }}>
        {card.description}
      </p>

      {/* Bullets */}
      <ul style={{ marginTop: "0.75rem", listStyle: "none", padding: 0 }}>
        {card.bullets.map((bullet) => (
          <li
            key={bullet}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.875rem",
              color: "#4B5563",
              marginBottom: "0.25rem",
            }}
          >
            <span style={{ color: "#C2185B", fontWeight: 700, fontSize: "1rem" }}>✓</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {/* CTA link */}
      <a
        href="#"
        style={{
          display: "inline-block",
          marginTop: "1rem",
          color: "#C2185B",
          fontSize: "0.875rem",
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        {card.cta}
      </a>
    </div>
  );
}

export default function ServicesSection() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return (
    <section id="care" style={{ backgroundColor: "#FDF8F5", padding: "6rem 0", overflow: "hidden" }}>
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
            Comprehensive Care
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
            Everything Your Health Needs
          </h2>

          <p style={{ fontSize: "1.125rem", color: "#6B7280", marginTop: "1rem", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
            Holistic women&apos;s healthcare from puberty to post-menopause —
            clinically backed, compassionately delivered.
          </p>
        </div>

        {/* Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '4rem', width: '100%' }}>
          {row1.map((card) => (
            <Card key={card.title} card={card} />
          ))}
        </div>

        {/* Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '1.5rem', width: '100%' }}>
          {row2.map((card) => (
            <Card key={card.title} card={card} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <a
            href="#"
            style={{
              display: "inline-block",
              border: "2px solid #C2185B",
              color: "#C2185B",
              borderRadius: "9999px",
              padding: "1rem 2.5rem",
              fontWeight: 600,
              textDecoration: "none",
              width: isMobile ? '100%' : 'auto',
            }}
          >
            View All Services
          </a>
        </div>
      </div>
    </section>
  );
}
