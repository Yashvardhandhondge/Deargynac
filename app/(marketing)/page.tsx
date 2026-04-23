import Navbar from "@/components/marketing/Navbar";
import TickerBar from "@/components/marketing/TickerBar";
import HeroSection from "@/components/marketing/HeroSection";
import ProblemSection from "@/components/marketing/ProblemSection";
import ServicesSection from "@/components/marketing/ServicesSection";
import JourneySection from "@/components/marketing/JourneySection";
import DoctorsSection from "@/components/marketing/DoctorsSection";
import PricingSection from "@/components/marketing/PricingSection";
import TestimonialsSection from "@/components/marketing/TestimonialsSection";
import PrivacySection from "@/components/marketing/PrivacySection";
import CTASection from "@/components/marketing/CTASection";
import Footer from "@/components/marketing/Footer";

export default function MarketingPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <TickerBar />
        <HeroSection />
        <ProblemSection />
        <ServicesSection />
        <JourneySection />
        <DoctorsSection />
        <PricingSection />
        <TestimonialsSection />
        <PrivacySection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
