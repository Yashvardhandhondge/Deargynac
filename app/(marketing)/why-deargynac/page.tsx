import type { Metadata } from "next";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import MarketingPageHeader from "@/components/marketing/MarketingPageHeader";
import ProblemSection from "@/components/marketing/ProblemSection";

export const metadata: Metadata = {
  title: "Why DearGynac — Women's Health in India",
  description:
    "Why access to gynecology and women's health care in India is hard — and how DearGynac helps.",
};

export default function WhyDearGynacPage() {
  return (
    <MarketingSubPage bgClassName="bg-white">
      <MarketingPageHeader
        title="Why DearGynac"
        subtitle="Context on women’s health access in India — without noise on the homepage."
      />
      <ProblemSection />
    </MarketingSubPage>
  );
}
