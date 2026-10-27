"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";
import { getProductBySlug } from "@/lib/product-data";

// All banners are about 2145 × 733. The photo sits in a "cover" frame with this aspect ratio, focused
// towards the right on phones (focusX) and fully right-aligned from tablets up. A product placed inside
// the frame (in % of the photo) therefore stays on its spot at every screen size.
const AR = 2145 / 733;
const coverFrame = (focusX: string): React.CSSProperties => ({
  width: `max(100cqw, calc(100cqh * ${AR}))`,
  height: `max(100cqh, calc(100cqw / ${AR}))`,
  left: `calc((100cqw - max(100cqw, calc(100cqh * ${AR}))) * ${focusX})`,
  top: `calc((100cqh - max(100cqh, calc(100cqw / ${AR}))) * 0.5)`,
});

type Slide = {
  eyebrow: string;
  title: React.ReactNode;
  desc: string;
  cta: { label: string; href: string };
  image: string; // wide banner (≈ 2145 × 733) with open space on the left for the text
  alt: string;
  focusX: number; // horizontal focus (0 = left, 1 = right) on phones, where the banner is cropped
  product?: Placement;
};

// Where the product stands in the photo: left / bottom / width as % of the photo (the box is square,
// the product sits at its bottom edge).
type Placement = { slug: string; left: number; bottom: number; width: number };

const SLIDES: Slide[] = [
  {
    eyebrow: "A2 cow milk · Bilona process",
    title: (
      <>
        Pure Desi <br className="hidden sm:block" />
        Cow Ghee
      </>
    ),
    desc: "Churned the traditional bilona way from the A2 milk of grass-fed desi cows. Rich aroma, natural grain and nothing added.",
    cta: { label: "Shop Ghee", href: "/shop?category=ghee" },
    image: "/images/hero/banner-ghee.png",
    alt: "PK Farms Pure Desi Cow Ghee with a spoon of ghee and a cow in the field",
    focusX: 0.78,
  },
  {
    eyebrow: "Pure · Natural · Unprocessed",
    title: (
      <>
        Raw Wild <br className="hidden sm:block" />
        Honey
      </>
    ),
    desc: "Collected from natural forests and bottled raw. Never heated, never blended with sugar syrup.",
    cta: { label: "Shop Honey", href: "/shop?category=honey" },
    image: "/images/hero/banner-honey.png",
    alt: "PK Farms Raw Honey jar with honeycomb and a honey dipper",
    focusX: 0.8,
  },
  {
    eyebrow: "Wooden cold pressed",
    title: (
      <>
        Groundnut Oil, <br className="hidden sm:block" />
        Pressed Pure
      </>
    ),
    desc: "Slowly extracted in a traditional wooden press, unrefined and full of natural aroma for everyday cooking.",
    cta: { label: "Shop Oils", href: "/shop?category=oils" },
    image: "/images/hero/banner-oil.png",
    alt: "PK Farms Wood Pressed Groundnut Oil bottle with groundnuts in a field",
    focusX: 0.74,
  },
  {
    eyebrow: "Pure & aromatic",
    title: (
      <>
        Heeng for <br className="hidden sm:block" />
        Every Tadka
      </>
    ),
    desc: "Strong, aromatic compounded asafoetida. A small pinch brings depth to dal, sabzi and everyday cooking.",
    cta: { label: "Shop Spices", href: "/shop?category=spices" },
    image: "/images/hero/banner-heeng.png",
    alt: "PK Farms Heeng jar with asafoetida in a wooden bowl",
    focusX: 0.6,
  },
];

function PlacedProduct({ placement }: { placement: Placement }) {
  const product = getProductBySlug(placement.slug);
  if (!product) return null;
  return (
    <div className="absolute pointer-events-none" style={coverFrame("var(--fx)")}>
      <Link
        href={`/products/${product.slug}`}
        aria-label={product.name}
        className="pointer-events-auto absolute aspect-square"
        style={{ left: `${placement.left}%`, bottom: `${placement.bottom}%`, width: `${placement.width}%` }}
      >
        {/* Contact shadow where the product meets the surface */}
        <span className="absolute left-1/2 -translate-x-1/2 bottom-[2%] w-[62%] h-[7%] rounded-[50%] bg-[#2A1C0E]/50 blur-[4px]" />
        <Image
          src={product.image}
          alt=""
          fill
          sizes="(min-width: 768px) 360px, 35vw"
          className="object-contain object-bottom drop-shadow-[0_6px_8px_rgba(31,20,10,0.35)]"
        />
      </Link>
    </div>
  );
}

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const total = SLIDES.length;

  const go = useCallback((n: number) => setI((n + total) % total), [total]);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % total), 6000);
    return () => clearInterval(t);
  }, [total, i]);

  return (
    <section className="relative w-full bg-[#FBF6EA]">
      {/* Phones: banner on top, text below. Large screens: the full banner at its own proportions, text on its open left side. */}
      <div className="relative w-full h-[485px] sm:h-[600px] md:h-[440px] lg:h-auto lg:aspect-[2145/733] lg:max-h-[660px] overflow-hidden">
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            aria-hidden={idx !== i}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              idx === i ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Banner */}
            <div
              className="absolute inset-x-0 top-0 h-[210px] sm:h-[300px] md:inset-0 md:h-auto overflow-hidden [container-type:size] [--fx:var(--fx-sm)] md:[--fx:1]"
              style={{ "--fx-sm": s.focusX } as React.CSSProperties}
            >
              <div className="absolute" style={coverFrame("var(--fx)")}>
                <Image src={s.image} alt={s.alt} fill priority={idx === 0} sizes="100vw" className="object-fill" />
              </div>
              {/* Phones — soft fade from the banner into the text area */}
              <div className="md:hidden absolute inset-0 bg-[linear-gradient(to_top,#FBF6EA_0%,rgba(251,246,234,0)_28%)]" />
              {/* Larger screens — light wash on the left so the text stays readable on any banner */}
              <div className="hidden md:block absolute inset-0 bg-[linear-gradient(to_right,rgba(251,246,234,0.82)_0%,rgba(251,246,234,0.55)_30%,rgba(251,246,234,0)_55%)]" />

              {/* The real product, standing on its spot in the photo */}
              {s.product && <PlacedProduct placement={s.product} />}
            </div>

            {/* Text */}
            <div className="absolute inset-x-0 bottom-0 top-[210px] sm:top-[300px] md:inset-0 flex items-start md:items-center">
              <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-8 pt-2 md:pt-0">
                <div className="max-w-md lg:max-w-lg text-center md:text-left mx-auto md:mx-0">
                  <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-brand-tan">
                    {s.eyebrow}
                  </p>
                  <h1 className="mt-3 font-hero font-bold text-brand-funk text-[32px] sm:text-[40px] md:text-[42px] lg:text-[50px] xl:text-[60px] leading-[1.1] tracking-[-0.01em]">
                    {s.title}
                  </h1>
                  <p className="mt-3 md:mt-4 text-brand-ink/80 text-[14px] md:text-[15px] leading-relaxed">
                    {s.desc}
                  </p>
                  <div className="mt-4 md:mt-7 flex items-center justify-center md:justify-start gap-2 sm:gap-3">
                    <Link
                      href={s.cta.href}
                      className="inline-flex items-center gap-1.5 sm:gap-2 h-10 md:h-12 px-4 sm:px-7 rounded-full bg-brand-funk hover:bg-brand-funkDark text-white text-[13px] sm:text-sm md:text-[15px] font-semibold tracking-wide whitespace-nowrap transition-colors"
                    >
                      {s.cta.label}
                      <ArrowRight size={16} strokeWidth={2} />
                    </Link>
                    <Link
                      href="/shop"
                      className="inline-flex items-center h-10 md:h-12 px-4 sm:px-7 rounded-full border border-brand-funk text-brand-funk bg-white/70 hover:bg-white text-[13px] sm:text-sm md:text-[15px] font-semibold tracking-wide whitespace-nowrap transition-colors"
                    >
                      View All Products
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => go(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === i ? "w-6 bg-brand-funk" : "w-2 bg-brand-funk/30 hover:bg-brand-funk/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
