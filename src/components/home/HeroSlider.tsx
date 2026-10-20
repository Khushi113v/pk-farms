"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ArrowRight } from "lucide-react";

type Slide = {
  eyebrow: string;
  title: React.ReactNode;
  desc: string;
  cta: { label: string; href: string };
  image: string; // wide banner (≈ 2145 × 733) with open space on the left for the text
  alt: string;
  mobileFocus?: string; // object-position on phones, where the banner is cropped
};

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
    image: "/images/hero/banner1.png",
    alt: "PK Farms Pure Desi Cow Ghee with a spoon of ghee and a cow in the field",
    mobileFocus: "72% center",
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
    image: "/images/hero/banner3.png",
    alt: "PK Farms Raw Honey jar with honeycomb and a honey dipper",
    mobileFocus: "76% center",
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
    image: "/images/hero/banner4.png",
    alt: "PK Farms Wood Pressed Groundnut Oil bottle with groundnuts in a field",
    mobileFocus: "72% center",
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
    image: "/images/hero/banner2.png",
    alt: "PK Farms Heeng jar with asafoetida in a wooden bowl",
    mobileFocus: "74% center",
  },
];

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
      <div className="relative w-full h-[580px] sm:h-[620px] md:h-[440px] lg:h-auto lg:aspect-[2145/733] lg:max-h-[660px] overflow-hidden">
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            aria-hidden={idx !== i}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              idx === i ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Banner */}
            <div className="absolute inset-x-0 top-0 h-[270px] sm:h-[320px] md:inset-0 md:h-auto">
              <Image
                src={s.image}
                alt={s.alt}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-cover [object-position:var(--mpos)] md:object-right"
                style={{ "--mpos": s.mobileFocus ?? "right center" } as React.CSSProperties}
              />
              {/* Phones — soft fade from the banner into the text area */}
              <div className="md:hidden absolute inset-0 bg-[linear-gradient(to_top,#FBF6EA_0%,rgba(251,246,234,0)_28%)]" />
              {/* Larger screens — light wash on the left so the text stays readable on any banner */}
              <div className="hidden md:block absolute inset-0 bg-[linear-gradient(to_right,rgba(251,246,234,0.82)_0%,rgba(251,246,234,0.55)_30%,rgba(251,246,234,0)_55%)]" />
            </div>

            {/* Text */}
            <div className="absolute inset-x-0 bottom-0 top-[270px] sm:top-[320px] md:inset-0 flex items-start md:items-center">
              <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-8 pt-2 md:pt-0">
                <div className="max-w-md lg:max-w-lg text-center md:text-left mx-auto md:mx-0">
                  <p className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.25em] text-brand-tan">
                    {s.eyebrow}
                  </p>
                  <h1 className="mt-3 font-display font-semibold text-brand-funk text-[30px] sm:text-[38px] md:text-[40px] lg:text-[46px] xl:text-[56px] leading-[1.08]">
                    {s.title}
                  </h1>
                  <p className="mt-3 md:mt-4 text-brand-ink/80 text-[14px] md:text-[15px] leading-relaxed">
                    {s.desc}
                  </p>
                  <div className="mt-5 md:mt-7 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <Link
                      href={s.cta.href}
                      className="inline-flex items-center gap-2 h-11 md:h-12 px-7 rounded-full bg-brand-funk hover:bg-brand-funkDark text-white text-sm md:text-[15px] font-semibold tracking-wide transition-colors"
                    >
                      {s.cta.label}
                      <ArrowRight size={16} strokeWidth={2} />
                    </Link>
                    <Link
                      href="/shop"
                      className="inline-flex items-center h-11 md:h-12 px-7 rounded-full border border-brand-funk text-brand-funk bg-white/70 hover:bg-white text-sm md:text-[15px] font-semibold tracking-wide transition-colors"
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
