"use client";
import { useRef } from "react";
import Image from "next/image";
import BrandBackdrop, { BRAND_BACKDROP_BG } from "@/components/common/BrandBackdrop";
import { useAutoScroll } from "@/lib/use-auto-scroll";
import { useInfiniteLoop } from "@/lib/use-infinite-loop";
import {
  Sparkles,
  Droplets,
  Leaf,
  Gem,
  RefreshCw,
  Heart,
  Truck,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

type Feature = {
  icon: React.ElementType;
  image?: string; // shown in the icon tile instead of the icon (product page)
  heroImage: string; // photo shown at the top of the home page slide
  focus?: string; // object-position for the photo
  productIcon?: React.ElementType; // overrides `icon` on the product detail page
  title: string;
  desc: string;
  accent: string;
  accentSoft: string;
};

const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    heroImage: "/images/why-choose/why-traditional.png",
    title: "Traditional methods",
    desc: "Bilona ghee and wooden cold pressed oil, made the old way.",
    accent: "#0B5B36",
    accentSoft: "#E7F0E4",
  },
  {
    icon: Droplets,
    heroImage: "/images/why-choose/why-pure.png",
    title: "Pure ingredients",
    desc: "No preservatives, no added colour, no fillers.",
    accent: "#C4553C",
    accentSoft: "#EEF3E6",
  },
  {
    icon: Leaf,
    heroImage: "/images/why-choose/why-sourcing.png",
    title: "Honest sourcing",
    desc: "We work closely with farmers and producers.",
    accent: "#A67C2E",
    accentSoft: "#F5EBD9",
  },
  {
    icon: Gem,
    heroImage: "/images/why-choose/why-packaging.png",
    title: "Safe packaging",
    desc: "Glass jars and sealed bottles that keep it fresh.",
    accent: "#08472A",
    accentSoft: "#E7F0E4",
  },
  {
    icon: RefreshCw,
    heroImage: "/images/why-choose/why-replacement.png",
    title: "Easy replacement",
    desc: "Damaged in transit? We will replace it.",
    accent: "#B24A32",
    accentSoft: "#EEF3E6",
  },
  {
    icon: Heart,
    heroImage: "/images/why-choose/why-care.png",
    title: "Made with care",
    desc: "Every product is chosen and tested by our team.",
    accent: "#0B5B36",
    accentSoft: "#E7F0E4",
  },
];

const STAMPS = [
  { icon: Truck, text: "Free shipping over ₹999" },
  { icon: RefreshCw, text: "Easy replacement" },
  { icon: ShieldCheck, text: "Secure payments" },
];

// `decor` (product variant only) renders behind the content.
export default function WhyChooseSection({
  variant = "home",
  decor,
}: {
  variant?: "home" | "product";
  decor?: React.ReactNode;
}) {
  if (variant === "product") return <ProductWhyChoose decor={decor} />;
  return <HomeWhyChoose />;
}

// Home page version — auto-sliding carousel of image-led cards.
function HomeWhyChoose() {
  const trackRef = useRef<HTMLDivElement>(null);
  // Rendered 3x so the auto-slider loops seamlessly (see useInfiniteLoop).
  const LOOP = [...FEATURES, ...FEATURES, ...FEATURES];
  useInfiniteLoop(trackRef, FEATURES.length);
  useAutoScroll(trackRef, { interval: 3800 });

  const scrollBy = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const cardWidth = first?.getBoundingClientRect().width ?? 300;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: (cardWidth + gap) * (dir === "left" ? -1 : 1), behavior: "smooth" });
  };

  return (
    <section className="relative py-10 md:py-14 overflow-hidden bg-brand-cream">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-7 md:mb-9">
          <div className="min-w-0">
            <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-brand-tan">The PK Farms difference</p>
            <h2 className="mt-2 font-hero font-bold text-brand-ink text-[30px] sm:text-4xl md:text-[46px] leading-[1.05]">
              Why Choose <span className="italic text-brand-funk">PK Farms</span>
            </h2>
            <p className="mt-3 flex items-center gap-3 text-brand-ink/70 text-sm md:text-base">
              <span className="h-px w-8 bg-brand-tan" />
              <span className="italic">Pure food, made the honest way</span>
            </p>
          </div>

          {/* Prev / Next arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              aria-label="Scroll left"
              onClick={() => scrollBy("left")}
              className="grid place-items-center w-10 h-10 rounded-full bg-white text-brand-ink border border-brand-line hover:border-brand-funk/40 transition-colors"
            >
              <ArrowLeft size={16} strokeWidth={2} />
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollBy("right")}
              className="grid place-items-center w-10 h-10 rounded-full text-white bg-brand-funk hover:bg-brand-funkDark transition-colors"
            >
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Slider: full photo cards with the text over a dark fade */}
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pb-2"
        >
          {LOOP.map((f, idx) => {
            const Icon = f.icon;
            const n = (idx % FEATURES.length) + 1;
            return (
              <div
                key={idx}
                className="group relative snap-start shrink-0 w-[calc(100vw-7rem)] sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-1.125rem)] aspect-[4/5] rounded-[24px] overflow-hidden bg-brand-ink isolate"
              >
                <Image
                  src={f.heroImage}
                  alt={f.title}
                  fill
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  style={{ objectPosition: f.focus ?? "center" }}
                />
                {/* Dark fade so the white text always reads */}
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,26,18,0.92)_0%,rgba(14,26,18,0.55)_35%,rgba(14,26,18,0)_62%)]" />

                {/* Top: icon + number */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                  <span className="grid place-items-center w-11 h-11 rounded-full bg-white/90 text-brand-funk shadow-sm">
                    <Icon size={19} strokeWidth={1.75} />
                  </span>
                  <span className="font-hero italic text-white text-lg drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                    {String(n).padStart(2, "0")}
                  </span>
                </div>

                {/* Bottom: title + text */}
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                  <span className="block h-0.5 w-8 bg-brand-tan mb-3 transition-all duration-500 group-hover:w-14" />
                  <h3 className="font-hero font-bold text-white text-[22px] md:text-2xl leading-tight">{f.title}</h3>
                  <p className="mt-1.5 text-white/80 text-[13px] md:text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust strip */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 md:gap-3 text-[13px] md:text-sm text-brand-ink">
          {STAMPS.map(({ icon: Icon, text }) => (
            <span key={text} className="inline-flex items-center gap-2 rounded-full bg-white border border-brand-line px-4 py-2">
              <Icon size={17} strokeWidth={1.5} className="text-brand-funk" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// Product detail page version — centred heading on top, feature cards below.
function ProductWhyChoose({ decor }: { decor?: React.ReactNode }) {
  return (
    <section className={`relative overflow-hidden ${BRAND_BACKDROP_BG} ${decor ? "pt-16 pb-9" : "py-9"} md:py-11`}>
      <BrandBackdrop wave={false} />
      {decor}

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-brand-funk bg-white px-3 py-1.5 rounded-full border border-brand-funk/30">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-funk" />
            The PK Farms promise
          </span>
          <h2 className="mt-4 font-display font-medium text-brand-ink text-[28px] sm:text-4xl md:text-[44px] leading-[1.05]">
            Why{" "}
            <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
              choose
            </span>{" "}
            PK Farms?
          </h2>
          <p className="mt-3 text-brand-ink/70 text-sm md:text-[15px] leading-relaxed">
            Pure, natural and made the traditional way.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {FEATURES.map((f) => {
            const Icon = f.productIcon ?? f.icon;
            return (
              <div
                key={f.title}
                className="group relative overflow-hidden bg-white rounded-2xl border border-brand-line p-3.5 pl-4 sm:p-5 sm:pl-6 transition-all duration-300"
              >
                {/* accent stripe */}
                <span
                  aria-hidden
                  className="absolute left-0 inset-y-0 w-[3px]"
                  style={{ background: "#0B5B36" }}
                />

                <div className="relative flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
                  <span
                    className="relative shrink-0 grid place-items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white overflow-hidden"
                    style={{ boxShadow: `0 0 0 1px ${f.accentSoft}` }}
                  >
                    {f.image ? (
                      <Image src={f.image} alt="" fill sizes="48px" className="object-contain p-2" />
                    ) : (
                      <Icon size={20} strokeWidth={2.25} style={{ color: f.accent }} />
                    )}
                  </span>
                  <h3 className="font-display font-medium text-brand-ink text-[13px] sm:text-base md:text-[17px] leading-tight">
                    {f.title}
                  </h3>
                </div>
                <p className="relative mt-2 sm:mt-3 text-brand-muted text-[11.5px] sm:text-[13px] md:text-sm leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
