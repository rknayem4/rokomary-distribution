import ProductCategories from "@/Components/CategorySection";
import HeroSection from "@/Components/HeroSection";
import LatestProducts from "@/Components/Home/TopProducts";
import DistributionService from "@/Components/Service";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ProductCategories />
      <LatestProducts />
      <DistributionService />
    </div>
  );
}
