"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Our Care", href: "/services" },
  { label: "Our Team", href: "/#team" },
  { label: "About Platform", href: "/#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-baseline shrink-0">
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

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-[#D97894] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/patient/book"
              className="text-sm font-medium text-[#D97894] hover:text-[#C45F7E] transition-colors"
            >
              Book Consultation
            </Link>
          </div>

          {/* Language + Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/patient/book"
              className="inline-block bg-[#D97894] text-white rounded-full px-6 py-2 text-sm font-semibold hover:bg-[#C45F7E] hover:-translate-y-[1px] hover:shadow-lg transition-all"
            >
              Consult Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-[#D97894] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-gray-100">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="block py-3 px-6 text-sm font-medium text-gray-700 hover:text-[#D97894] hover:bg-gray-50 border-b border-gray-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/patient/book"
            className="block py-3 px-6 text-sm font-medium text-[#D97894] hover:bg-rose-50 border-b border-gray-50 transition-colors"
            onClick={() => setMobileOpen(false)}
          >
            Book Consultation
          </Link>
          <div className="p-4 space-y-3">
            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>
            <Link
              href="/patient/book"
              className="block text-center bg-[#D97894] text-white rounded-full px-6 py-3 text-sm font-semibold hover:bg-[#C45F7E] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Consult Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
