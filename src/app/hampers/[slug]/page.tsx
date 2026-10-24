import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, Gift } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import ProductImage from "@/components/common/ProductImage";
import HamperBuilder from "@/components/hampers/HamperBuilder";
import HamperCard from "@/components/hampers/HamperCard";
import ReviewsSection from "@/components/home/ReviewsSection";
import WatchAndBuySection from "@/components/home/WatchAndBuySection";
import FAQSection from "@/components/home/FAQSection";
import ProductTabs from "@/components/common/ProductTabs";
import { InfoTable, ShippingTable, NutritionTable, HowToUse } from "@/components/common/ProductInfoTables";
import LabReportCard from "@/components/product/LabReportCard";
import HealthBenefits from "@/components/product/HealthBenefits";
import ProductWhyChoose from "@/components/product/ProductWhyChoose";
import { DETAILS, WHY_US } from "@/lib/product-details";
import { HAMPER_FAQS, productFaqs } from "@/lib/product-faqs";
import { HAMPERS, getHamperBySlug } from "@/lib/hamper-data";
import { hamperImage } from "@/lib/hamper-image";
import { getProductBySlug, SPEC_COLOUR, SPEC_DISCOUNT, type Product } from "@/lib/product-data";

const hasImage = (src: string) => fs.existsSync(path.join(process.cwd(), "public", src));

// Two benefits per product, skipping any whose photo is already used by the other product
function hamperBenefits(details: (typeof DETAILS)[keyof typeof DETAILS][]) {
  const used = new Set<string>();
  return details.flatMap((d) =>
    d.benefits
      .filter((b) => !used.has(b.image))
      .slice(0, 2)
      .map((b) => (used.add(b.image), b)),
  );
}

// One block per product inside a tab, with the product's name as a small heading
function PerProduct({ products, render }: { products: Product[]; render: (p: Product) => React.ReactNode }) {
  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
      {products.map((p) => (
        <div key={p.slug}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-tan">{p.name}</p>
          {render(p)}
        </div>
      ))}
    </div>
  );
}

export function generateStaticParams() {
  return HAMPERS.map((h) => ({ slug: h.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const h = getHamperBySlug(params.slug);
  if (!h) return { title: "Hampers — PK Farms" };
  return { title: `${h.name} — PK Farms`, description: h.description };
}

export default function HamperDetailPage({ params }: { params: { slug: string } }) {
  const hamper = getHamperBySlug(params.slug);
  if (!hamper) notFound();
  const image = hamperImage(hamper.slug, hamper.items[0]);
  const products = hamper.items.map((s) => getProductBySlug(s)).filter((p): p is Product => !!p);
  const details = products.map((p) => DETAILS[p.care ?? "ghee"]);
  const others = HAMPERS.filter((h) => h.slug !== hamper.slug);

  return (
    <>
      <Breadcrumb title={hamper.name} items={[{ label: "Hampers", href: "/hampers" }, { label: hamper.name }]} />

      <section className="relative pt-8 md:pt-14 pb-8 md:pb-10 bg-white overflow-x-clip">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1.1fr_1fr] gap-8 md:gap-12">
            {/* Photo */}
            <div>
              <div className="relative aspect-square rounded-2xl border border-brand-line overflow-hidden bg-[radial-gradient(ellipse_at_50%_70%,#FBF1D7_0%,#FFFFFF_70%)]">
                <div className="absolute top-3 left-3 z-10 flex gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white text-brand-funk text-[11px] font-medium uppercase tracking-[0.15em] border border-brand-line">
                    Combo of {hamper.items.length}
                  </span>
                  {hamper.tag && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-tan text-brand-ink text-[11px] font-bold uppercase tracking-[0.1em]">
                      {hamper.tag}
                    </span>
                  )}
                </div>
                <ProductImage src={image} alt={hamper.name} sizes="(max-width: 768px) 90vw, 45vw" priority inset="inset-8 md:inset-14" />
              </div>
            </div>

            {/* Info + builder */}
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] mb-2 text-[#8A6420]">Hamper · Combo</p>
              <h1 className="font-display font-medium text-brand-ink text-[26px] sm:text-3xl md:text-[34px] leading-[1.15]">{hamper.name}</h1>
              <p className="mt-1 text-brand-muted text-sm">{hamper.tagline}</p>

              <HamperBuilder hamper={hamper} image={image} />

              {products.map((p) => (
                <LabReportCard
                  key={p.slug}
                  name={p.name}
                  tests={DETAILS[p.care ?? "ghee"].labTests.map((t) => t.name)}
                  href={p.labReport}
                />
              ))}

              <p className="mt-6 text-brand-ink/80 text-[15px] leading-relaxed">{hamper.description}</p>
              <ul className="mt-4 space-y-2.5">
                {products.map((p) => (
                  <li key={p.slug} className="flex items-start gap-3">
                    <span className="shrink-0 grid place-items-center w-5 h-5 rounded-full bg-brand-strip">
                      <Check size={12} strokeWidth={3} className="text-brand-funk" />
                    </span>
                    <span className="text-sm text-brand-ink/85">
                      <span className="font-semibold text-brand-ink">{p.name}</span> · {p.hint}
                    </span>
                  </li>
                ))}
                <li className="flex items-start gap-3">
                  <span className="shrink-0 grid place-items-center w-5 h-5 rounded-full bg-brand-strip">
                    <Gift size={12} strokeWidth={2.5} className="text-brand-funk" />
                  </span>
                  <span className="text-sm text-brand-ink/85">
                    <span className="font-semibold text-brand-ink">Perfect for:</span> {hamper.occasion}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Info tabs, covering both products */}
      <section className="bg-white pb-10 md:pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProductTabs
            tabs={[
              {
                title: "Description",
                icon: "description",
                content: (
                  <div className="max-w-3xl space-y-3">
                    <p>{hamper.description}</p>
                    {products.map((p) => (
                      <p key={p.slug}>
                        <span className="font-semibold text-brand-ink">{p.name}: </span>
                        {p.description}
                      </p>
                    ))}
                  </div>
                ),
              },
              {
                title: "Additional Information",
                icon: "info",
                content: (
                  <div className="space-y-8">
                    <PerProduct
                      products={products}
                      render={(p) => (
                        <InfoTable rows={p.specifications.filter((r) => r.value !== SPEC_DISCOUNT && r.value !== SPEC_COLOUR)} />
                      )}
                    />
                    <div className="max-w-2xl">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-tan">Delivery &amp; returns</p>
                      <ShippingTable />
                    </div>
                  </div>
                ),
              },
              {
                title: "Nutritional Information",
                icon: "nutrition",
                content: <PerProduct products={products} render={(p) => <NutritionTable rows={DETAILS[p.care ?? "ghee"].nutrition} />} />,
              },
              {
                title: "How to Use",
                icon: "use",
                content: (
                  <div className="space-y-10">
                    {products.map((p) => (
                      <div key={p.slug}>
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-brand-tan">{p.name}</p>
                        <HowToUse steps={DETAILS[p.care ?? "ghee"].uses} kind={p.care ?? "ghee"} />
                      </div>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      {/* Top 2 benefits of each product */}
      <HealthBenefits
        product={hamper.name}
        rows={hamperBenefits(details).map((b) => ({ ...b, src: hasImage(b.image) ? b.image : b.fallback }))}
      />

      <ProductWhyChoose items={WHY_US.map((w) => ({ ...w, emblem: hasImage(w.image), src: hasImage(w.image) ? w.image : w.fallback }))} />

      <WatchAndBuySection
        eyebrow="Real kitchens, real stories"
        title={
          <>
            People love our <span className="italic text-brand-funk">hampers</span>
          </>
        }
        subtitle="Watch it in action, then add it to your cart"
        featured={hamper.items}
      />

      <ReviewsSection />

      <FAQSection items={[...HAMPER_FAQS, ...products.map((p) => productFaqs(p)[0])]} compact />

      {/* More hampers */}
      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 font-display font-medium text-brand-ink text-xl md:text-2xl">
            More <span className="italic text-brand-funk">hampers</span>
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {others.map((h) => (
              <HamperCard key={h.slug} hamper={h} image={hamperImage(h.slug, h.items[0])} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
