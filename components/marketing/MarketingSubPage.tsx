"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/marketing/Navbar";
import Footer from "@/components/marketing/Footer";

export default function MarketingSubPage({
  children,
  bgClassName = "bg-[#FFF7F9]",
}: {
  children: ReactNode;
  bgClassName?: string;
}) {
  return (
    <>
      <Navbar />
      <div className={`pt-16 min-h-screen ${bgClassName}`}>{children}</div>
      <Footer />
    </>
  );
}
