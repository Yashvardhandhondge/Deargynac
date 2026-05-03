import Link from "next/link";
import {
  Camera,
  ThumbsUp,
  AtSign,
  Play,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const careLinks = [
  "Anonymous Consultations",
  "Period Tracking",
  "Pregnancy & Fertility",
  "Diagnostics",
  "PCOS & Hormones",
  "Surgical Guidance",
];

const companyLinks = [
  "Our Team",
  "Our Mission",
  "For Investors",
  "Careers",
  "Press & Media",
  "Partner With Us",
];

const supportLinks = [
  "Help Center",
  "Privacy Policy",
  "Terms of Service",
  "Grievance Redressal",
  "DPDP Compliance",
  "Contact Us",
];

const socials = [
  { icon: Camera, label: "Instagram" },
  { icon: ThumbsUp, label: "Facebook" },
  { icon: AtSign, label: "Twitter" },
  { icon: Play, label: "Youtube" },
  { icon: MessageCircle, label: "Chat" },
];

export default function Footer() {
  return (
    <footer className="bg-white text-[#3D3438] py-16 px-4 overflow-hidden w-full border-t border-rose-200 shadow-[0_-8px_32px_-12px_rgba(217,120,148,0.12)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1 min-w-0">
            <Link href="/" className="flex items-baseline">
              <span className="font-serif font-bold text-xl text-[#3D3438]">
                Dear
              </span>
              <span className="font-serif italic text-xl text-[#D97894]">
                Gynac
              </span>
              <span className="text-[#D4A017] font-bold text-2xl leading-none">
                .
              </span>
            </Link>
            <p className="text-[#6B5F63] text-sm mt-4 max-w-xs leading-relaxed">
              Your trusted women&apos;s health partner — safe, private, and
              expert-led.
            </p>
            <div className="flex gap-1 mt-6 justify-center sm:justify-start">
              {socials.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="text-[#8A7E82] hover:text-[#D97894] w-8 h-8 p-1.5 rounded-full hover:bg-white/60 transition flex items-center justify-center"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2 — Our Care */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#9A8E92] mb-4">
              Our Care
            </h4>
            <ul>
              {careLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#6B5F63] hover:text-[#D97894] text-sm leading-8 transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company + Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#9A8E92] mb-4">
              Company
            </h4>
            <ul>
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#6B5F63] hover:text-[#D97894] text-sm leading-8 transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#9A8E92] mb-4 mt-8">
              Support
            </h4>
            <ul>
              {supportLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[#6B5F63] hover:text-[#D97894] text-sm leading-8 transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#9A8E92] mb-4">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3 text-[#6B5F63] text-sm items-start">
                <Mail className="w-4 h-4 mt-0.5 shrink-0 text-[#D97894]" />
                <span className="break-all">hello@deargynac.com</span>
              </div>
              <div className="flex gap-3 text-[#6B5F63] text-sm items-start">
                <Phone className="w-4 h-4 mt-0.5 shrink-0 text-[#D97894]" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex gap-3 text-[#6B5F63] text-sm items-start">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-[#D97894]" />
                <span>Pune, Maharashtra, India</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {["NMC Compliant", "DPDP 2023", "ABDM Ready"].map((badge) => (
                <span
                  key={badge}
                  className="bg-[#FCEEF2] rounded px-3 py-1 text-xs text-[#5C5156] border border-rose-100"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-rose-100 flex flex-col lg:flex-row justify-between gap-4 text-center lg:text-left">
          <p className="text-[#8A7E82] text-xs">
            &copy; 2025 DearGynac. All rights reserved. | Designed with &hearts;
            for the women of India
          </p>
          <p className="text-[#8A7E82] text-xs max-w-2xl lg:text-right">
            DearGynac is a telemedicine platform. Consultations are conducted by
            verified Registered Medical Practitioners under NMC Telemedicine
            Guidelines 2020. All health information is confidential and protected
            under DPDP Act 2023.
          </p>
        </div>
      </div>
    </footer>
  );
}
