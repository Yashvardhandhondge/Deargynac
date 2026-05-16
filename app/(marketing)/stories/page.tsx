import type { Metadata } from "next";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import MarketingPageHeader from "@/components/marketing/MarketingPageHeader";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";

export const metadata: Metadata = {
  title: "Patient Stories — DearGynac",
  description: "What women say about private, expert-led care on DearGynac.",
};

export default function StoriesPage() {
  return (
    <MarketingSubPage>
      <MarketingPageHeader
        title="Patient stories"
        subtitle="Illustrative experiences from women across India — names may be anonymised."
      />
      <TestimonialsSection />
    </MarketingSubPage>
  );
}
