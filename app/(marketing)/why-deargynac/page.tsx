import type { Metadata } from "next";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import ProblemSection from "@/components/marketing/ProblemSection";

export const metadata: Metadata = {
  title: "Why DearGynac — Women's Health in India",
  description:
    "Why access to gynecology and women's health care in India is hard — and how DearGynac helps.",
};

export default function WhyDearGynacPage() {
  return (
    <MarketingSubPage bgClassName="bg-white">
      <ProblemSection />
    </MarketingSubPage>
  );
}
