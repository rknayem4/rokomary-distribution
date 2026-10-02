import ProductCategories from "@/Components/Home/CategorySection";
import HeroSection from "@/Components/Home/HeroSection";
import DistributionService from "@/Components/Home/Service";
import LatestProducts from "@/Components/Home/TopProducts";


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
