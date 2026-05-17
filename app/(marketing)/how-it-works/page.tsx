import type { Metadata } from "next";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import JourneySection from "@/components/marketing/JourneySection";

export const metadata: Metadata = {
  title: "How It Works — DearGynac",
  description: "Step-by-step: anonymous profile, intake, consultation, diagnostics, and follow-up on DearGynac.",
};

export default function HowItWorksPage() {
  return (
    <MarketingSubPage bgClassName="bg-white">
      <JourneySection />
    </MarketingSubPage>
  );
}
