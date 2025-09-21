import { BenefitsSection } from "./components/home/BenefitSection";
import { CtaSection } from "./components/home/CTASection";
import { FeaturesSection } from "./components/home/FeatureSection";
import { HeroSection } from "./components/home/HeroSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <CtaSection />
    </>
  );
}
