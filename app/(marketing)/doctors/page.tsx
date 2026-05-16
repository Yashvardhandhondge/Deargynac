import type { Metadata } from "next";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import MarketingPageHeader from "@/components/marketing/MarketingPageHeader";
import DoctorsSection from "@/components/marketing/DoctorsSection";

export const metadata: Metadata = {
  title: "Our Doctors — DearGynac",
  description: "Meet the NMC-aligned gynecology, radiology, and surgery specialists on DearGynac.",
};

export default function DoctorsPage() {
  return (
    <MarketingSubPage>
      <MarketingPageHeader
        title="Our doctors"
        subtitle="Verified specialists for teleconsultation and coordinated care."
      />
      <DoctorsSection />
    </MarketingSubPage>
  );
}
