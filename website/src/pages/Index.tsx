import { HeroSection } from "@/components/HeroSection";
import { ProductSection } from "@/components/ProductSection";
import { UserJourneySection } from "@/components/UserJourneySection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { DownloadSection } from "@/components/DownloadSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <HeroSection />
      <ProductSection />
      <UserJourneySection />
      <BenefitsSection />
      <TestimonialsSection />
      <DownloadSection />
      <Footer />
    </div>
  );
};

export default Index;
