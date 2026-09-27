import ProductCategories from "@/Components/CategorySection";
import Footer from "@/Components/Footer";
import HeroSection from "@/Components/HeroSection";
import App from "@/Components/responsive_navbar_component";
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
