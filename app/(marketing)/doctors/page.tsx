import type { Metadata } from "next";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import DoctorsSection from "@/components/marketing/DoctorsSection";

export const metadata: Metadata = {
  title: "Our Doctors — DearGynac",
  description: "Meet the NMC-aligned gynecology, radiology, and surgery specialists on DearGynac.",
};

export default function DoctorsPage() {
  return (
    <MarketingSubPage>
      <DoctorsSection />
    </MarketingSubPage>
  );
}
