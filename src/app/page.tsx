import HeroSlider from "@/components/home/HeroSlider";
import ShopByCategorySection from "@/components/home/ShopByCategorySection";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import FeaturedBanner from "@/components/home/FeaturedBanner";
import FlashDealsSection from "@/components/home/FlashDealsSection";
import GiftDealsSection from "@/components/home/GiftDealsSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import WatchAndBuySection from "@/components/home/WatchAndBuySection";
import CertifiedBySection from "@/components/home/CertifiedBySection";
import FarmStoryVideoSection from "@/components/home/FarmStoryVideoSection";
import BlogSection from "@/components/home/BlogSection";
import FAQSection from "@/components/home/FAQSection";
import GheeProcessSection from "@/components/home/GheeProcessSection";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <ShopByCategorySection />
      <FeaturedProductsSection
        title="New Arrivals"
        decorated
        subtitle="Handpicked for your kitchen"
        variant="new"
        collection="new-arrivals"
      />
      <FeaturedBanner />
      <FlashDealsSection />
      <GiftDealsSection />
      <FeaturedProductsSection
        white
        title="Best Sellers"
        subtitle="Most loved by our customers"
        variant="bestseller"
        collection="best-sellers"
        interval={4600}
      />
      <GheeProcessSection />
      <WhyChooseSection />
      <WatchAndBuySection />
      <ReviewsSection />
      <BlogSection />
      <CertifiedBySection />
      <FarmStoryVideoSection />
      <FAQSection />
    </>
  );
}
