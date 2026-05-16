import type { Metadata } from "next";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import MarketingPageHeader from "@/components/marketing/MarketingPageHeader";
import PrivacySection from "@/components/marketing/PrivacySection";

export const metadata: Metadata = {
  title: "Privacy & Trust — DearGynac",
  description:
    "How DearGynac handles health data under India’s DPDP Act — no sale of personal data, NMC-aligned care, and your rights.",
};

export default function TrustPage() {
  return (
    <MarketingSubPage bgClassName="bg-white">
      <MarketingPageHeader
        title="Privacy & trust"
        subtitle="High-level commitments and links to our Privacy Policy and Terms of Service."
      />
      <PrivacySection />
    </MarketingSubPage>
  );
}
