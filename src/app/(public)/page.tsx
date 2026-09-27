import ProductCategories from "@/Components/CategorySection";
import HeroSection from "@/Components/HeroSection";
import DistributionService from "@/Components/Service";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ProductCategories />
      <DistributionService />
    </div>
  );
}
