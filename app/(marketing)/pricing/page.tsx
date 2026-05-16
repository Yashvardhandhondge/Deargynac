import type { Metadata } from "next";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import MarketingPageHeader from "@/components/marketing/MarketingPageHeader";
import PricingSection from "@/components/marketing/PricingSection";

export const metadata: Metadata = {
  title: "Pricing — DearGynac",
  description: "Simple plans for Quick Consult, Complete Care, and Premium women’s health on DearGynac.",
};

export default function PricingPage() {
  return (
    <MarketingSubPage bgClassName="bg-white">
      <MarketingPageHeader
        title="Plans & pricing"
        subtitle="What you pay, what’s included, and how to get started."
      />
      <PricingSection />
    </MarketingSubPage>
  );
}
