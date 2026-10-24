import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Star, Check } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import ProductActions from "@/components/common/ProductActions";
import ProductTabs from "@/components/common/ProductTabs";
import { SpecTable, ShippingTable, NutritionTable, HowToUse } from "@/components/common/ProductInfoTables";
import LabReportCard from "@/components/product/LabReportCard";
import ProductSlider from "@/components/common/ProductSlider";
import ReviewsSection from "@/components/home/ReviewsSection";
import WatchAndBuySection from "@/components/home/WatchAndBuySection";
import FAQSection from "@/components/home/FAQSection";
import HealthBenefits from "@/components/product/HealthBenefits";
import ProductWhyChoose from "@/components/product/ProductWhyChoose";
import StickyAddToCart from "@/components/common/StickyAddToCart";
import {
  ProductVariantProvider,
  PriceBlock,
  VariantSelector,
  VariantGallery,
} from "@/components/common/ProductVariants";
import { PRODUCTS, getProductBySlug, colourOptions } from "@/lib/product-data";
import { DETAILS, WHY_US } from "@/lib/product-details";
import { productFaqs } from "@/lib/product-faqs";

// True when a file exists in /public, so sections can use a new image or PDF as soon as it is added
const hasImage = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));


export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return { title: "Shop — PK Farms" };
  return {
    title: `${product.name} — PK Farms`,
    description: product.description,
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();
  const d = DETAILS[product.care ?? "ghee"];

  return (
    <ProductVariantProvider
      key={product.slug}
      options={colourOptions(product)}
      initialSlug={product.slug}
    >
      <Breadcrumb
        title={product.name}
        items={[{ label: "Shop", href: "/shop" }, { label: product.name }]}
      />

      <section className="relative pt-10 md:pt-16 pb-6 md:pb-8 bg-white overflow-x-clip">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1.2fr_1fr] gap-10 md:gap-12">
            {/* Gallery */}
            <div className="relative">
              <VariantGallery
                alt={product.name}
                tileBg={product.tileBg}
                borderColor="#E6E0CC"
                rounded="rounded-2xl"
                overlay={
                  product.category ? (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white text-brand-funk text-[11px] font-medium uppercase tracking-[0.15em]">
                        {product.category}
                      </span>
                    </div>
                  ) : undefined
                }
              />
            </div>

            {/* Info */}
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] mb-2 text-[#8A6420]">
                {[product.category, product.style].filter(Boolean).join(" · ")}
              </p>
              <h1 className="font-display font-medium text-brand-ink text-[26px] sm:text-3xl md:text-[34px] leading-[1.15]">
                {product.name}
              </h1>
              <p className="mt-1 text-brand-muted text-sm">{product.hint}</p>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={15}
                      className={i < Math.round(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-brand-line"}
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-brand-ink">{product.rating}</span>
                <span className="text-sm text-brand-muted">({product.reviewCount} reviews)</span>
              </div>

              <PriceBlock />

              <p className="mt-5 text-brand-ink/80 text-[15px] leading-relaxed line-clamp-3">
                {product.description}
              </p>

              {/* Highlights */}
              <ul className="mt-5 space-y-3">
                {product.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="shrink-0 grid place-items-center w-5 h-5 rounded-full bg-brand-strip">
                      <Check size={12} strokeWidth={3} className="text-brand-funk" />
                    </span>
                    <span className="text-sm text-brand-ink/85 leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>

              <VariantSelector />

              <ProductActions name={product.name} tileBg={product.tileBg} />

              <LabReportCard
                name={product.name}
                tests={d.labTests.map((t) => t.name)}
                href={product.labReport}
              />
            </div>
          </div>

          {/* Info tabs */}
          <div className="relative mt-14 md:mt-16">
            <ProductTabs
              tabs={[
                {
                  title: "Description",
                  icon: "description",
                  content: <p className="max-w-3xl">{product.description}</p>,
                },
                {
                  title: "Additional Information",
                  icon: "info",
                  content: (
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-tan">Product details</p>
                        <SpecTable rows={product.specifications} />
                      </div>
                      <div>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-tan">Delivery &amp; returns</p>
                        <ShippingTable />
                      </div>
                    </div>
                  ),
                },
                {
                  title: "Nutritional Information",
                  icon: "nutrition",
                  content: <NutritionTable rows={d.nutrition} />,
                },
                {
                  title: "How to Use",
                  icon: "use",
                  content: <HowToUse steps={d.uses} kind={product.care ?? "ghee"} />,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <HealthBenefits
        product={product.name}
        rows={d.benefits.map((b) => ({ ...b, src: hasImage(b.image) ? b.image : b.fallback }))}
      />

      <ProductWhyChoose items={WHY_US.map((w) => ({ ...w, emblem: hasImage(w.image), src: hasImage(w.image) ? w.image : w.fallback }))} />

      <WatchAndBuySection
        eyebrow="Real kitchens, real stories"
        title={
          <>
            People love our <span className="italic text-brand-funk">{d.short}</span>
          </>
        }
        subtitle="Watch it in action, then add it to your cart"
        featured={product.slug}
      />

      {/* Customer reviews */}
      <ReviewsSection />

      <FAQSection items={productFaqs(product)} compact />

      {/* More products */}
      <section className="bg-white pt-8 md:pt-10 pb-10 md:pb-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ProductSlider slugs={PRODUCTS.filter((p) => p.slug !== product.slug).map((p) => p.slug)} />
        </div>
      </section>

      <StickyAddToCart name={product.name} tileBg={product.tileBg} />
    </ProductVariantProvider>
  );
}
