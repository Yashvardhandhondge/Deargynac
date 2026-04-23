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
    <footer className="bg-[#1A0A12] text-white py-16 px-4 overflow-hidden w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1 min-w-0">
            <Link href="/" className="flex items-baseline">
              <span className="font-serif font-bold text-xl text-white">
                Dear
              </span>
              <span className="font-serif italic text-xl text-[#C2185B]">
                Gynac
              </span>
              <span className="text-[#D4A017] font-bold text-2xl leading-none">
                .
              </span>
            </Link>
            <p className="text-gray-400 text-sm mt-4 max-w-xs leading-relaxed">
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
                    className="text-gray-600 hover:text-white w-8 h-8 p-1.5 rounded-full hover:bg-white/10 transition flex items-center justify-center"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2 — Our Care */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Our Care
            </h4>
            <ul>
              {careLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm leading-8 transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company + Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Company
            </h4>
            <ul>
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm leading-8 transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4 mt-8">
              Support
            </h4>
            <ul>
              {supportLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white text-sm leading-8 transition"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Contact
            </h4>
            <div className="space-y-4">
              <div className="flex gap-3 text-gray-400 text-sm items-start">
                <Mail className="w-4 h-4 mt-0.5 shrink-0" />
                <span className="break-all">hello@deargynac.com</span>
              </div>
              <div className="flex gap-3 text-gray-400 text-sm items-start">
                <Phone className="w-4 h-4 mt-0.5 shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex gap-3 text-gray-400 text-sm items-start">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Pune, Maharashtra, India</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {["NMC Compliant", "DPDP 2023", "ABDM Ready"].map((badge) => (
                <span
                  key={badge}
                  className="bg-white/10 rounded px-3 py-1 text-xs text-gray-300"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col lg:flex-row justify-between gap-4 text-center lg:text-left">
          <p className="text-gray-500 text-xs">
            &copy; 2025 DearGynac. All rights reserved. | Designed with &hearts;
            for the women of India
          </p>
          <p className="text-gray-500 text-xs max-w-2xl lg:text-right">
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
