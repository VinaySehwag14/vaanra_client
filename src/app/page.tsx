import HeroCarousel from "@/components/home/hero-carousel";
import ShopTheLook from "@/components/home/shop-the-look";
import UrbanFoxFam from "@/components/home/wear-waves-fam";
import FeaturedProduct from "@/components/home/featured-product";
import TrendingCollections from "@/components/home/trending-collections";
import ShopByCategory from "@/components/home/shop-by-category";
import FlashSale from "@/components/home/flash-sale";
import HotDeals from "@/components/home/hot-deals";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Hero Carousel Section */}
      <section className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
        <HeroCarousel />
      </section>

      {/* Shop By Category Section */}
      <section className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <ShopByCategory />
      </section>

      {/* Hot Deals Section */}
      <section className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <HotDeals />
      </section>

      {/* Flash Sale Section */}
      <section className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <FlashSale />
      </section>

      {/* Shop the Look Section */}
      <section className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <ShopTheLook />
      </section>

      {/* UrbanFox Fam Gallery Section */}
      <section className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <UrbanFoxFam />
      </section>

      {/* Featured Product Section */}
      <section className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <FeaturedProduct />
      </section>

      {/* Trending Collections Section */}
      <section className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <TrendingCollections />
      </section>
    </div>
  );
}





