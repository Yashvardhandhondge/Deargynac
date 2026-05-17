import type { Metadata } from "next";
import MarketingSubPage from "@/components/marketing/MarketingSubPage";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";

export const metadata: Metadata = {
  title: "Patient Stories — DearGynac",
  description: "What women say about private, expert-led care on DearGynac.",
};

export default function StoriesPage() {
  return (
    <MarketingSubPage>
      <TestimonialsSection />
    </MarketingSubPage>
  );
}
