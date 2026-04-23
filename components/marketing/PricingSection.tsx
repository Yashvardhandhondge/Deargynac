"use client";

import { MessageSquare, HeartPulse, Star, Check, X } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/useWindowSize";

interface Feature {
  text: string;
  included: boolean;
}

interface PricingCard {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: Feature[];
  cta: string;
  popular?: boolean;
  filled?: boolean;
}

const plans: PricingCard[] = [
  {
    icon: MessageSquare,
    iconBg: "bg-rose-100",
    iconColor: "text-[#C2185B]",
    name: "Quick Consult",
    price: "\u20B9149",
    period: "/session",
    tagline: "For single, specific concerns",
    features: [
      { text: "1 chat consultation (15 min)", included: true },
      { text: "Written prescription if needed", included: true },
      { text: "Anonymous profile", included: true },
      { text: "24-hr follow-up window", included: true },
      { text: "Period tracker access", included: false },
      { text: "Health records vault", included: false },
    ],
    cta: "Get Started",
  },
  {
    icon: HeartPulse,
    iconBg: "bg-rose-100",
    iconColor: "text-[#C2185B]",
    name: "Complete Care",
    price: "\u20B9499",
    period: "/month",
    tagline: "For ongoing health management",
    features: [
      { text: "2 video/chat consultations", included: true },
      { text: "Period & ovulation tracker", included: true },
      { text: "Digital health records vault", included: true },
      { text: "Community forum access", included: true },
      { text: "Diagnostic report review", included: true },
      { text: "Prescription & lab orders", included: true },
    ],
    cta: "Start Free Trial",
    popular: true,
    filled: true,
  },
  {
    icon: Star,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    name: "Premium",
    price: "\u20B9999",
    period: "/month",
    tagline: "For complex or chronic conditions",
    features: [
      { text: "Unlimited consultations", included: true },
      { text: "Priority doctor access", included: true },
      { text: "Full diagnostic suite", included: true },
      { text: "Surgical second opinion", included: true },
      { text: "ABHA ID integration", included: true },
      { text: "Dedicated care manager", included: true },
    ],
    cta: "Choose Premium",
  },
];

export default function PricingSection() {
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
              color: "#C2185B",
              border: "1px solid rgba(194, 24, 91, 0.3)",
              backgroundColor: "rgba(194, 24, 91, 0.05)",
            }}
          >
            Affordable Care
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
            Transparent, Simple Pricing
          </h2>

          <p style={{ fontSize: "1.125rem", color: "#6B7280", marginTop: "1rem", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
            Quality healthcare should not be a luxury. Choose the plan that fits
            your needs and your budget.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '2rem', marginTop: '4rem', maxWidth: '64rem', marginLeft: 'auto', marginRight: 'auto' }}>
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <div
                key={plan.name}
                style={{
                  borderRadius: "1rem",
                  padding: "2rem",
                  position: "relative",
                  backgroundColor: "white",
                  border: plan.popular
                    ? "2px solid #C2185B"
                    : "1px solid #e5e7eb",
                }}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-1rem",
                      left: "50%",
                      transform: "translateX(-50%)",
                      backgroundColor: "#C2185B",
                      color: "white",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.375rem 1rem",
                      borderRadius: "9999px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    Most Popular
                  </span>
                )}

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${plan.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${plan.iconColor}`} />
                </div>

                {/* Name */}
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1A0A12", marginTop: "1rem", fontFamily: '"Playfair Display", Georgia, serif' }}>
                  {plan.name}
                </h3>

                {/* Price */}
                <div style={{ marginTop: "0.75rem", display: "flex", alignItems: "baseline", gap: "0.25rem" }}>
                  <span style={{ fontSize: "3rem", fontWeight: 700, color: "#1A0A12", fontFamily: '"Playfair Display", Georgia, serif' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: "1rem", color: "#9CA3AF" }}>{plan.period}</span>
                </div>

                <p style={{ fontSize: "0.875rem", color: "#6B7280", marginTop: "0.25rem" }}>{plan.tagline}</p>

                {/* Features */}
                <ul style={{ marginTop: "1.5rem", listStyle: "none", padding: 0 }}>
                  {plan.features.map((feat) => (
                    <li
                      key={feat.text}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.5rem",
                        fontSize: "0.875rem",
                        marginBottom: "0.75rem",
                      }}
                    >
                      {feat.included ? (
                        <Check style={{ width: "1rem", height: "1rem", color: "#22C55E", marginTop: "0.125rem", flexShrink: 0 }} />
                      ) : (
                        <X style={{ width: "1rem", height: "1rem", color: "#D1D5DB", marginTop: "0.125rem", flexShrink: 0 }} />
                      )}
                      <span style={{ color: feat.included ? "#374151" : "#9CA3AF" }}>
                        {feat.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/patient/book"
                  style={{
                    display: "block",
                    textAlign: "center",
                    borderRadius: "9999px",
                    width: "100%",
                    marginTop: "2rem",
                    padding: "0.75rem 1.5rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    backgroundColor: plan.filled ? "#C2185B" : "transparent",
                    color: plan.filled ? "white" : "#C2185B",
                    border: plan.filled ? "none" : "2px solid #C2185B",
                  }}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
