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
    eyebrow: "Straight from the Himalayas",
    title: (
      <>
        Pure Pahadi <br className="hidden sm:block" />
        Ghee &amp; Goodness
      </>
    ),
    desc:
      "Bilona-churned desi ghee, raw honey and stone-ground masalas, sourced directly from farmers and made the way our grandparents did.",
    cta: { label: "Shop Now", href: "/shop" },
    image: "/images/hero/hero-himalaya.svg",
    alt: "PK Farms ghee, honey and turmeric in front of Himalayan mountains",
    imgFocus: "85% 50%",
    mobileFocus: "75% 50%",
  },
  {
    eyebrow: "Raw & unprocessed",
    title: (
      <>
        Golden Honey, <br className="hidden sm:block" />
        <span className="italic">Wild</span> Flavour
      </>
    ),
    desc:
      "Multiflora and wild forest honey collected by local beekeepers. Never heated, never blended with syrup.",
    cta: { label: "Shop Honey", href: "/shop?category=honey" },
    image: "/images/hero/hero-honey.svg",
    alt: "Jars of raw Himalayan honey with a honey dipper",
    imgFocus: "85% 50%",
  },
  {
    eyebrow: "Stone-ground in small batches",
    title: (
      <>
        Masalas With <br className="hidden sm:block" />
        Mountain Aroma
      </>
    ),
    desc:
      "Lakadong turmeric, bird's eye chilli and pahadi garam masala, ground fresh with no added colour or fillers.",
    cta: { label: "Shop Masalas", href: "/shop?category=spices" },
    image: "/images/hero/hero-masala.svg",
    alt: "Turmeric and chilli masala pouches with whole spices",
    imgFocus: "85% 50%",
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
    <section className="relative w-full bg-[#F2E7C9]">
      <div className="relative w-full h-[500px] sm:h-[540px] md:h-[480px] lg:h-[520px] overflow-hidden">
        {SLIDES.map((s, idx) => (
          <div
            key={idx}
            aria-hidden={idx !== i}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              idx === i ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {/* Photo — fills the right side and fades softly into the blush background */}
            <div className="absolute inset-0 md:left-auto md:w-[60%] md:[mask-image:linear-gradient(to_right,transparent,black_32%)]">
              <Image
                src={s.image}
                alt={s.alt}
                fill
                priority={idx === 0}
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover [object-position:var(--mpos)] md:[object-position:var(--pos)]"
                style={{ "--pos": s.imgFocus, "--mpos": s.mobileFocus ?? s.imgFocus } as React.CSSProperties}
              />
              {/* Mobile only — blush wash rising from the bottom so the text sits on the photo */}
              <div className="md:hidden absolute inset-0 bg-[linear-gradient(to_top,rgba(242,231,201,0.96)_0%,rgba(242,231,201,0.88)_34%,rgba(242,231,201,0.4)_52%,rgba(242,231,201,0)_64%)]" />
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
