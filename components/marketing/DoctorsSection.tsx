"use client";

import {
  UserRound,
  ScanLine,
  Stethoscope,
  GraduationCap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useIsMobile, useIsTablet } from "@/hooks/useWindowSize";

interface DoctorCard {
  name: string;
  roleBadge: string;
  roleBg: string;
  roleColor: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  specialty: string;
  bio: string;
  stats: { value: string; label: string }[];
  tags: string[];
  featured?: boolean;
  statsBadges?: boolean;
}

const doctors: DoctorCard[] = [
  {
    name: "Dr. Snehal Pansare",
    roleBadge: "Gynecologist",
    roleBg: "bg-rose-100",
    roleColor: "text-[#D97894]",
    icon: UserRound,
    iconBg: "bg-rose-50",
    iconColor: "text-[#D97894]",
    specialty: "Obstetrics & Gynecology",
    bio: "Specialist in reproductive health, prenatal care, PCOS, and minimally invasive gynecological procedures with over 12 years of clinical experience.",
    stats: [
      { value: "9+", label: "Years Exp" },
      { value: "5000+", label: "Patients" },
      { value: "4.9\u2605", label: "Rating" },
    ],
    tags: ["PCOS", "Pregnancy", "Fertility"],
  },
  {
    name: "Dr. Kshitija Kadam",
    roleBadge: "Radiologist",
    roleBg: "bg-purple-100",
    roleColor: "text-purple-700",
    icon: ScanLine,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    specialty: "Diagnostic Radiology & Imaging",
    bio: "Expert in gynecological ultrasound, diagnostic imaging, and radiology interpretation \u2014 bridging the gap between diagnostics and clinical care.",
    stats: [
      { value: "15+", label: "Years Exp" },
      { value: "8000+", label: "Reports" },
      { value: "4.8\u2605", label: "Rating" },
    ],
    tags: ["Ultrasound", "MRI", "Diagnostics"],
    featured: true,
  },
  {
    name: "Dr. Praveen Borkar",
    roleBadge: "General Surgeon",
    roleBg: "bg-teal-100",
    roleColor: "text-teal-700",
    icon: Stethoscope,
    iconBg: "bg-teal-50",
    iconColor: "text-teal-600",
    specialty: "General & Laparoscopic Surgery",
    bio: "Experienced in complex surgical interventions, laparoscopic procedures, and providing expert second opinions for surgical decisions in women\u2019s health.",
    stats: [
      { value: "20+", label: "Years Exp" },
      { value: "3000+", label: "Surgeries" },
      { value: "4.9\u2605", label: "Rating" },
    ],
    tags: ["Laparoscopy", "Fibroid", "Endometriosis"],
  },
  {
    name: "Vaibhavi Kadam",
    roleBadge: "ISB Alumni",
    roleBg: "bg-amber-100",
    roleColor: "text-amber-700",
    icon: GraduationCap,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    specialty: "Business Head & Strategy",
    bio: "ISB-trained healthcare business strategist focused on building scalable, impact-driven femtech platforms that bridge clinical excellence with digital accessibility.",
    stats: [
      { value: "ISB MBA", label: "" },
      { value: "FemTech Expert", label: "" },
      { value: "GTM Strategy", label: "" },
    ],
    tags: ["Strategy", "FemTech", "Operations"],
    statsBadges: true,
  },
];

export default function DoctorsSection() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  return (
    <section id="team" style={{ backgroundColor: "#FFF7F9", padding: "6rem 0" }}>
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
            Expert-Led
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
            The Doctors Behind DearGynac
          </h2>

          <p style={{ fontSize: "1.125rem", color: "#6B7280", marginTop: "1rem", maxWidth: "42rem", marginLeft: "auto", marginRight: "auto" }}>
            Board-certified specialists with decades of combined experience —
            not algorithms, not bots. Real doctors who truly care.
          </p>
        </div>

        {/* Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '4rem' }}>
          {doctors.map((doc) => {
            const Icon = doc.icon;
            return (
              <div
                key={doc.name}
                style={{
                  backgroundColor: "white",
                  borderRadius: "1rem",
                  padding: "1.5rem",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  position: "relative",
                  minWidth: 0,
                  border: doc.featured
                    ? "2px solid #D97894"
                    : "1px solid #f3f4f6",
                }}
              >
                {/* Featured badge */}
                {doc.featured && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-0.75rem",
                      right: "1rem",
                      backgroundColor: "#D97894",
                      color: "white",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                    }}
                  >
                    Featured
                  </span>
                )}

                {/* Role badge */}
                <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${doc.roleBg} ${doc.roleColor}`}>
                  {doc.roleBadge}
                </span>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-full ${doc.iconBg} flex items-center justify-center mt-4`}>
                  <Icon className={`w-7 h-7 ${doc.iconColor}`} />
                </div>

                {/* Name & specialty */}
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#3D3438", marginTop: "1rem", fontFamily: '"Playfair Display", Georgia, serif' }}>
                  {doc.name}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#9CA3AF" }}>{doc.specialty}</p>

                {/* Bio */}
                <p style={{ fontSize: "0.875rem", color: "#4B5563", lineHeight: 1.6, marginTop: "0.75rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as any }}>
                  {doc.bio}
                </p>

                {/* Stats */}
                {doc.statsBadges ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
                    {doc.stats.map((s) => (
                      <span
                        key={s.value}
                        style={{
                          backgroundColor: "#f3f4f6",
                          color: "#4B5563",
                          fontSize: "0.75rem",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "9999px",
                          fontWeight: 500,
                        }}
                      >
                        {s.value}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
                    {doc.stats.map((s, i) => (
                      <div key={i} style={{ textAlign: "center" }}>
                        <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "#3D3438" }}>
                          {s.value}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1rem" }}>
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        backgroundColor: "#f3f4f6",
                        color: "#4B5563",
                        fontSize: "0.75rem",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <a
            href="#"
            style={{
              display: "inline-block",
              border: "2px solid #D97894",
              color: "#D97894",
              borderRadius: "9999px",
              padding: "1rem 2.5rem",
              fontWeight: 600,
              textDecoration: "none",
              width: isMobile ? '100%' : 'auto',
            }}
          >
            Meet the Full Team
          </a>
        </div>
      </div>
    </section>
  );
}
