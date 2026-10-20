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
          "pahadi-badri-cow-ghee",
          "multiflora-himalayan-honey",
          "lakadong-turmeric-powder",
          "a2-gir-cow-ghee-tin",
          "pahadi-garam-masala",
          "birds-eye-chilli-powder",
        ]}
      />
      <WhyChooseSection />
      <FeaturedProductsSection
        eyebrow="Featured products"
        heading="Pure from the"
        accent="Himalayas"
        tagLabel="Featured"
        interval={5000}
        slugs={[
          "pahadi-pantry-combo",
          "wild-forest-honey",
          "a2-gir-cow-ghee-tin",
          "pahadi-garam-masala",
          "pahadi-badri-cow-ghee",
          "multiflora-himalayan-honey",
        ]}
      />
      <VideoSection />
      {/* <TestimonialsSection /> */}
      <BlogSection />
      <FAQSection />
    </>
  );
}
