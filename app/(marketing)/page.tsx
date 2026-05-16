import Navbar from "@/components/marketing/Navbar";
import TickerBar from "@/components/marketing/TickerBar";
import HeroSection from "@/components/marketing/HeroSection";
import WaveDivider from "@/components/marketing/WaveDivider";
import HomeExploreSection from "@/components/marketing/HomeExploreSection";
import CTASection from "@/components/marketing/CTASection";
import Footer from "@/components/marketing/Footer";

export default function MarketingPage() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <TickerBar />
        <HeroSection />
        <WaveDivider topColor="#FDF8F5" bottomColor="#FFFFFF" />
        <HomeExploreSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
