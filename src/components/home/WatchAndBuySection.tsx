"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowLeft, ArrowRight, ShoppingBag, Check } from "lucide-react";
import { useAutoScroll } from "@/lib/use-auto-scroll";
import { useInfiniteLoop } from "@/lib/use-infinite-loop";
import { useCart } from "@/lib/cart-context";
import { getProductBySlug, defaultVariant } from "@/lib/product-data";

// One reel per card. `product` is the slug of the product shown in the video;
// it appears under the reel with its price and a quick Add to Cart.
type Reel = {
  youtubeId: string;
  poster: string; // cover photo shown until the video is played
  focus?: string; // object-position for the cover photo
  caption: string;
  product: string;
};

// Same placeholder video on every card for now — swap in your own YouTube IDs.
const SHARED_ID = "jNQXAC9IVRw";

const REELS: Reel[] = [
  { youtubeId: SHARED_ID, poster: "/images/why-choose/why-traditional.png", caption: "How we churn bilona ghee", product: "pure-desi-cow-ghee" },
  { youtubeId: SHARED_ID, poster: "/images/why-choose/why-pure.png", caption: "Raw honey, straight from the comb", product: "raw-honey" },
  { youtubeId: SHARED_ID, poster: "/images/peanut-background.png", focus: "82% center", caption: "Inside our wooden oil press", product: "wood-pressed-groundnut-oil" },
  { youtubeId: SHARED_ID, poster: "/images/hero/banner-heeng.png", focus: "74% center", caption: "A pinch of heeng in every tadka", product: "heeng-compounded-asafoetida" },
  { youtubeId: SHARED_ID, poster: "/images/why-choose/why-care.png", caption: "Packed with care, for your kitchen", product: "pure-desi-cow-ghee" },
];

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function BuyBar({ slug }: { slug: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const p = getProductBySlug(slug);
  if (!p) return null;

  const add = () => {
    const v = defaultVariant(p);
    addItem({
      slug: p.slug,
      name: p.name,
      image: v.size?.image ?? p.image,
      price: v.size?.price ?? p.price,
      mrp: v.size?.mrp ?? p.mrp,
      tileBg: p.tileBg,
      variant: v.label,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <div className="mt-3 flex items-center gap-2.5 rounded-2xl bg-white border border-brand-line p-2 pr-2.5">
      <Link href={`/products/${p.slug}`} className="relative w-12 h-12 shrink-0 rounded-xl border border-brand-line bg-white overflow-hidden">
        <Image src={p.image} alt={p.name} fill sizes="48px" className="object-contain p-1" />
      </Link>
      <Link href={`/products/${p.slug}`} className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-brand-ink leading-tight line-clamp-1 hover:text-brand-funk transition-colors">{p.name}</p>
        <p className="mt-0.5 text-xs">
          <span className="font-bold text-brand-ink">{inr(p.price)}</span>
          {p.mrp > p.price && <span className="ml-1.5 text-brand-muted line-through">{inr(p.mrp)}</span>}
        </p>
      </Link>
      <button
        type="button"
        onClick={add}
        aria-label={`Add ${p.name} to cart`}
        className={`shrink-0 grid place-items-center w-9 h-9 rounded-full transition-colors ${
          added ? "bg-brand-tan text-brand-ink" : "bg-brand-funk text-white hover:bg-brand-funkDark"
        }`}
      >
        {added ? <Check size={16} strokeWidth={2.5} /> : <ShoppingBag size={16} strokeWidth={2} />}
      </button>
    </div>
  );
}

// Home page uses the defaults; the product page passes its own heading and puts its product's reels first.
export default function WatchAndBuySection({
  eyebrow = "From our farm to your feed",
  title = (
    <>
      Watch <span className="italic text-brand-funk">&amp;</span> Buy
    </>
  ),
  subtitle = "See how it's made, then shop it",
  featured,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: string;
  featured?: string | string[]; // product slug(s) whose reels come first
} = {}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const first = featured ? ([] as string[]).concat(featured) : [];
  const reels = [...REELS.filter((r) => first.includes(r.product)), ...REELS.filter((r) => !first.includes(r.product))];
  // Rendered 3× so the auto-slider loops seamlessly (see useInfiniteLoop).
  const LOOP = [...reels, ...reels, ...reels];
  useInfiniteLoop(scrollerRef, REELS.length, playing !== null);
  useAutoScroll(scrollerRef, { interval: 4000, paused: playing !== null });

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? 260;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: (cardWidth + gap) * (dir === "left" ? -1 : 1), behavior: "smooth" });
  };

  return (
    <section className="relative bg-white py-10 md:py-14 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-7 md:mb-9">
          <div className="min-w-0">
            <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-brand-tan">{eyebrow}</p>
            <h2 className="mt-2 font-hero font-bold text-brand-ink text-[30px] sm:text-4xl md:text-[46px] leading-[1.05]">
              {title}
            </h2>
            <p className="mt-3 flex items-center gap-3 text-brand-ink/70 text-sm md:text-base">
              <span className="h-px w-8 bg-brand-tan" />
              <span className="italic">{subtitle}</span>
            </p>
          </div>

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

        {/* Reels */}
        <div
          ref={scrollerRef}
          className="no-scrollbar flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
        >
          {LOOP.map((r, idx) => {
            const isPlaying = playing === idx;
            return (
              <article
                key={idx}
                className="group snap-start shrink-0 w-[calc(66vw)] sm:w-[240px] md:w-[250px]"
              >
                {/* Reel (9:16) */}
                <div className="relative aspect-[9/16] rounded-[22px] bg-brand-ink overflow-hidden">
                  {isPlaying ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${r.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title={r.caption}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <Image
                        src={r.poster}
                        alt={r.caption}
                        fill
                        sizes="250px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ objectPosition: r.focus ?? "center" }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,26,18,0.85)_0%,rgba(14,26,18,0.15)_45%,rgba(14,26,18,0.25)_100%)]" />

                      {/* "Reel" chip */}
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/35 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-tan animate-pulse" />
                        Reel
                      </span>

                      <button
                        onClick={() => setPlaying(idx)}
                        aria-label={`Play: ${r.caption}`}
                        className="absolute inset-0 grid place-items-center"
                      >
                        <span className="relative grid place-items-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/95 transition-transform duration-300 group-hover:scale-110">
                          <span className="absolute inset-0 rounded-full bg-white/50 animate-ping" />
                          <Play size={22} strokeWidth={2.5} className="relative fill-brand-funk text-brand-funk translate-x-0.5" />
                        </span>
                      </button>

                      <p className="absolute inset-x-0 bottom-0 p-4 font-hero font-bold text-white text-lg leading-snug pointer-events-none">
                        {r.caption}
                      </p>
                    </>
                  )}
                </div>

                {/* Product in this reel */}
                <BuyBar slug={r.product} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
