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
  image: string;
  alt: string;
  imgFocus: string;
  mobileFocus?: string;
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
    desc:
      "Churned the traditional bilona way from the A2 milk of grass-fed desi cows. Rich aroma, natural grain and nothing added.",
    cta: { label: "Shop Ghee", href: "/shop?category=ghee" },
    image: "/images/products/ghee.png",
    alt: "PK Farms Pure Desi Cow Ghee in a glass jar",
    imgFocus: "center",
  },
  {
    eyebrow: "Pure · Natural · Unprocessed",
    title: (
      <>
        Raw Wild <br className="hidden sm:block" />
        Honey
      </>
    ),
    desc:
      "Collected from natural forests and bottled raw. Never heated, never blended with sugar syrup.",
    cta: { label: "Shop Honey", href: "/shop?category=honey" },
    image: "/images/products/honey.png",
    alt: "PK Farms Raw Honey in a glass jar",
    imgFocus: "center",
  },
  {
    eyebrow: "Wooden cold pressed",
    title: (
      <>
        Groundnut Oil, <br className="hidden sm:block" />
        Pressed Pure
      </>
    ),
    desc:
      "Slowly extracted in a traditional wooden press, unrefined and full of natural aroma for everyday cooking.",
    cta: { label: "Shop Oils", href: "/shop?category=oils" },
    image: "/images/products/oils.png",
    alt: "PK Farms Wood Pressed Groundnut Oil bottle with groundnuts",
    imgFocus: "center",
  },
  {
    eyebrow: "Pure & aromatic",
    title: (
      <>
        Heeng for <br className="hidden sm:block" />
        Every Tadka
      </>
    ),
    desc:
      "Strong, aromatic compounded asafoetida. A small pinch brings depth to dal, sabzi and everyday cooking.",
    cta: { label: "Shop Spices", href: "/shop?category=spices" },
    image: "/images/products/spices.png",
    alt: "PK Farms Heeng compounded asafoetida in a glass jar",
    imgFocus: "center",
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
    <section className="relative w-full bg-[#F7EBCF]">
      <div className="relative w-full h-[640px] sm:h-[700px] md:h-[480px] lg:h-[520px] overflow-hidden">
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            aria-hidden={idx !== i}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              idx === i ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Product photo — square on the right, fading softly into the background */}
            <div className="absolute inset-x-0 top-0 h-[360px] sm:h-[400px] md:inset-y-0 md:h-auto md:left-auto md:w-auto md:aspect-square md:[mask-image:linear-gradient(to_right,transparent,black_22%)]">
              <Image
                src={s.image}
                alt={s.alt}
                fill
                priority={idx === 0}
                sizes="(min-width: 768px) 520px, 100vw"
                className="object-cover [object-position:var(--mpos)] md:[object-position:var(--pos)]"
                style={{ "--pos": s.imgFocus, "--mpos": s.mobileFocus ?? s.imgFocus } as React.CSSProperties}
              />
              {/* Mobile only — short fade at the bottom of the photo into the background */}
              <div className="md:hidden absolute inset-0 bg-[linear-gradient(to_top,rgba(247,235,207,1)_0%,rgba(247,235,207,0)_22%)]" />
            </div>

            {/* Text */}
            <div className="absolute inset-x-0 bottom-0 pb-12 md:pb-0 md:top-0 md:h-full md:right-auto md:w-[48%] flex items-end md:items-center">
              <div className="w-full px-6 sm:px-10 text-center md:text-left lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2rem))] lg:pr-10">
                <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-brand-funk">
                  {s.eyebrow}
                </p>
                <h1 className="mt-3 md:mt-4 font-display font-medium text-brand-funk text-[28px] sm:text-[40px] md:text-[44px] lg:text-[56px] leading-[1.08]">
                  {s.title}
                </h1>
                <p className="mt-2.5 md:mt-5 text-brand-ink/80 text-[13.5px] md:text-[15px] max-w-md mx-auto md:mx-0 leading-relaxed">
                  {s.desc}
                </p>
                <Link
                  href={s.cta.href}
                  className="mt-4 md:mt-7 inline-flex items-center gap-2 h-11 md:h-12 px-7 rounded-full bg-brand-funk hover:bg-brand-funkDark text-white text-sm md:text-[15px] tracking-wide transition-colors"
                >
                  {s.cta.label}
                  <ArrowRight size={16} strokeWidth={1.75} />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Dots */}
        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => go(idx)}
              className={`w-2 h-2 rounded-full border border-brand-funk transition-colors ${
                idx === i ? "bg-brand-funk" : "bg-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
