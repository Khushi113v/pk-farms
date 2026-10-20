import HeroSlider from "@/components/home/HeroSlider";
import FeaturedProductsSection from "@/components/home/FeaturedProductsSection";
import FeaturedBanner from "@/components/home/FeaturedBanner";
import FlashDealsSection from "@/components/home/FlashDealsSection";
import GiftDealsSection from "@/components/home/GiftDealsSection";
import WhyChooseSection from "@/components/home/WhyChooseSection";
import VideoSection from "@/components/home/VideoSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import BlogSection from "@/components/home/BlogSection";
import FAQSection from "@/components/home/FAQSection";

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <FeaturedProductsSection />
      <FeaturedBanner />
      <FlashDealsSection />
      <GiftDealsSection />
      <FeaturedProductsSection
        white
        eyebrow="Best sellers"
        heading="Most loved by our"
        accent="customers"
        tagLabel="Best Seller"
        interval={4600}
        slugs={[
          "pure-desi-cow-ghee",
          "raw-honey",
          "wood-pressed-groundnut-oil",
          "heeng-compounded-asafoetida",
        ]}
      />
      <WhyChooseSection />
      <FeaturedProductsSection
        eyebrow="Featured products"
        heading="Pure, natural and"
        accent="trusted"
        tagLabel="Featured"
        interval={5000}
        slugs={[
          "raw-honey",
          "pure-desi-cow-ghee",
          "heeng-compounded-asafoetida",
          "wood-pressed-groundnut-oil",
        ]}
      />
      <VideoSection />
      {/* <TestimonialsSection /> */}
      <BlogSection />
      <FAQSection />
    </>
  );
}
