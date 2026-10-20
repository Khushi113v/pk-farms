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
    heroImage: "/images/blog/ghee-guide.svg",
    focus: "center 35%",
    title: "Traditional methods",
    desc: "Bilona ghee and hand-collected honey, made the old way.",
    accent: "#0B5B36",
    accentSoft: "#E7F0E4",
  },
  {
    icon: Droplets,
    heroImage: "/images/editorial/turmeric-field.svg",
    focus: "center 20%",
    title: "Pure ingredients",
    desc: "No preservatives, no added colour, no fillers.",
    accent: "#C4553C",
    accentSoft: "#EEF3E6",
  },
  {
    icon: Leaf,
    heroImage: "/images/blog/farm-story.svg",
    focus: "center",
    title: "Sourced from farmers",
    desc: "Bought directly from Himalayan farmers and beekeepers.",
    accent: "#A67C2E",
    accentSoft: "#F5EBD9",
  },
  {
    icon: Gem,
    heroImage: "/images/editorial/masala-spread.svg",
    focus: "center 15%",
    title: "Jars, tins and pouches",
    desc: "Pick the pack that suits you, from pouches to gift combos.",
    accent: "#08472A",
    accentSoft: "#E7F0E4",
  },
  {
    icon: RefreshCw,
    heroImage: "/images/editorial/mountain-farm.svg",
    focus: "center 20%",
    title: "Easy replacement",
    desc: "Damaged in transit? We will replace it.",
    accent: "#B24A32",
    accentSoft: "#EEF3E6",
  },
  {
    icon: Heart,
    heroImage: "/images/hero/hero-masala.svg",
    focus: "center 20%",
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
    <section className="relative py-6 md:py-8 overflow-hidden bg-[#F4EAD5]">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header — same layout as the testimonial section: title left, arrows right */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6 md:mb-8">
          <div className="max-w-2xl">
            <p className="text-[11px] md:text-xs uppercase tracking-[0.3em] text-[#8A6420]">
              The PK Farms difference
            </p>
            <h2 className="mt-3 font-display font-medium text-brand-ink text-[30px] sm:text-4xl md:text-5xl leading-[1.05]">
              Why{" "}
              <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
                choose
              </span>{" "}
              PK Farms.
            </h2>
          </div>

          {/* Prev / Next arrows */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              aria-label="Scroll left"
              onClick={() => scrollBy("left")}
              className="grid place-items-center w-10 h-10 rounded-full bg-white text-brand-ink border border-brand-line transition-all"
            >
              <ArrowLeft size={16} strokeWidth={2.75} />
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollBy("right")}
              className="grid place-items-center w-10 h-10 rounded-full text-white transition-all bg-brand-funk hover:bg-brand-funkDark"
            >
              <ArrowRight size={16} strokeWidth={2.75} />
            </button>
          </div>
        </div>

        {/* Slider: tall photo on top, short text on a white panel below */}
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-5 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
        >
          {LOOP.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="group relative snap-start shrink-0 w-[calc(100vw-7rem)] sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] flex flex-col rounded-2xl overflow-hidden bg-white border border-[#E6D8B8]"
              >
                {/* Photo */}
                <div className="relative aspect-[4/4.1] overflow-hidden bg-brand-cream">
                  <Image
                    src={f.heroImage}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    style={{ objectPosition: f.focus ?? "center" }}
                  />
                </div>

                {/* Text panel, with an icon badge overlapping the photo */}
                <div className="relative px-5 pt-9 pb-6 text-center">
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 grid place-items-center w-12 h-12 rounded-full bg-brand-funk text-white border-4 border-white">
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  <h3 className="font-display font-medium text-brand-ink text-lg leading-tight">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-brand-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust strip */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-brand-ink">
          {STAMPS.map(({ icon: Icon, text }) => (
            <span key={text} className="inline-flex items-center gap-2">
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
            Pure, traceable and made the way the mountains intended.
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
