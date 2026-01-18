import HeroCarousel from "@/components/home/hero-carousel";
import ShopTheLook from "@/components/home/shop-the-look";
import VaanraFam from "@/components/home/vaanra-fam";
import FeaturedProduct from "@/components/home/featured-product";
import TrendingCollections from "@/components/home/trending-collections";
import ShopByCategory from "@/components/home/shop-by-category";
import FlashSale from "@/components/home/flash-sale";
import HotDeals from "@/components/home/hot-deals";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col gap-10 md:gap-20 pb-32">
      {/* Hero Carousel Section */}
      <section className="w-full relative -mt-[140px] z-0">
        <HeroCarousel />
      </section>

      {/* Shop By Category Section */}
      <ShopByCategory />

      {/* Hot Deals Section */}
      <HotDeals />

      {/* Flash Sale Section */}
      <FlashSale />

      {/* Shop the Look Section */}
      <ShopTheLook />

      {/* Vaanra Fam Gallery Section */}
      <VaanraFam />

      {/* Featured Product Section */}
      <FeaturedProduct />

      {/* Trending Collections Section */}
      <TrendingCollections />
    </div>
  );
}





