"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowLeft, ArrowRight, Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { useAutoScroll } from "@/lib/use-auto-scroll";
import { useInfiniteLoop } from "@/lib/use-infinite-loop";
import { PRODUCTS } from "@/lib/product-data";

type Tag = "New" | "Sale";

type SectionProps = {
  eyebrow?: string;
  heading?: string; // text before the italic word
  accent?: string; // the italic word
  slugs?: string[]; // which products, in order (all by default)
  tagLabel?: string; // replaces the New / Sale tag text on every card
  white?: boolean; // white background instead of cream
  interval?: number;
};

type Product = {
  // Slug of the linked product page — also the wishlist key
  slug: string;
  name: string;
  hint: string;
  category: string;
  image: string;
  tag: Tag;
  price: number;
  mrp?: number;
};

const ALL: Product[] = PRODUCTS.map((p) => ({
  slug: p.slug,
  name: p.name,
  hint: p.hint,
  category: p.category,
  image: p.image,
  tag: p.mrp > p.price ? "Sale" : "New",
  price: p.price,
  mrp: p.mrp > p.price ? p.mrp : undefined,
}));

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function FeaturedProductsSection({
  eyebrow = "Fresh from the farm",
  heading = "Handpicked for your",
  accent = "kitchen",
  slugs,
  tagLabel,
  white = false,
  interval = 4200,
}: SectionProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const trackRef = useRef<HTMLDivElement>(null);
  // Rendered 3× so the auto-slider loops seamlessly (see useInfiniteLoop).
  const list = slugs ? slugs.map((slug) => ALL.find((p) => p.slug === slug)).filter((p): p is Product => !!p) : ALL;
  const LOOP = [...list, ...list, ...list];
  useInfiniteLoop(trackRef, list.length);
  useAutoScroll(trackRef, { interval });

  const scrollBy = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: ((first?.getBoundingClientRect().width ?? 280) + gap) * (dir === "left" ? -1 : 1), behavior: "smooth" });
  };

  return (
    <section className={`relative py-10 md:py-14 overflow-hidden ${white ? "bg-white" : "bg-brand-cream"}`}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 md:mb-10 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-brand-strip px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-funk" />
              {eyebrow}
            </span>
            <h2 className="mt-4 font-display font-medium text-brand-ink text-[30px] sm:text-4xl md:text-5xl leading-[1.05] md:whitespace-nowrap">
              {heading}{" "}
              <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
                {accent}
              </span>
              .
            </h2>
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

        {/* Product slider */}
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8"
        >
          {LOOP.map((p, idx) => {
            const wished = isWishlisted(p.slug);
            return (
              <Link
                key={idx}
                href={`/products/${p.slug}`}
                className="group relative snap-start shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.85rem)] lg:w-[calc(25%-1.125rem)] rounded-2xl bg-white border border-brand-line overflow-hidden flex flex-col transition-colors duration-300 hover:border-brand-funk/40"
              >
                {/* Product image */}
                <div className="relative aspect-square bg-[#F7F3EA] overflow-hidden">
                  {/* Top row: New / Sale tag + wishlist */}
                  <div className="absolute top-2 left-2 right-2 md:top-3 md:left-3 md:right-3 z-10 flex items-center justify-between gap-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[9px] md:text-[11px] font-medium uppercase tracking-[0.15em] ${
                        (tagLabel ? false : p.tag === "Sale") ? "bg-brand-funk text-white" : "bg-white text-brand-funk"
                      }`}
                    >
                      {tagLabel ?? p.tag}
                    </span>

                    <button
                      type="button"
                      aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                      aria-pressed={wished}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(p.slug);
                      }}
                      className="grid place-items-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 hover:bg-white text-brand-funk transition-colors"
                    >
                      <Heart
                        size={16}
                        strokeWidth={1.75}
                        className={wished ? "fill-brand-funk" : ""}
                      />
                    </button>
                  </div>

                  {/* Padded frame: the whole photo stays visible whatever its size or shape */}
                  <div className="absolute inset-x-3 top-10 bottom-3 md:inset-x-5 md:top-14 md:bottom-5">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(max-width: 1024px) 40vw, 20vw"
                      className="object-contain drop-shadow-sm group-hover:scale-[1.03] transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Text + arrow */}
                <div className="p-2.5 md:p-3.5 flex flex-col gap-1 md:gap-1.5">
                  <p className="text-[9px] md:text-[11px] font-medium uppercase tracking-[0.15em] text-brand-tan">
                    {p.category}
                  </p>
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="min-w-0">
                      <h3 className="font-display font-medium text-brand-ink text-[13px] md:text-[18px] leading-[1.15]">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-[10px] md:text-xs text-brand-muted leading-relaxed">
                        {p.hint}
                      </p>
                    </div>
                    <span className="shrink-0 grid place-items-center w-6 h-6 md:w-8 md:h-8 rounded-full text-white bg-brand-funk group-hover:bg-brand-funkDark transition-colors">
                      <ArrowUpRight size={12} strokeWidth={2} className="md:w-[14px] md:h-[14px]" />
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-sm md:text-base font-medium text-brand-funk">{inr(p.price)}</span>
                    {p.mrp && (
                      <span className="text-[11px] md:text-xs text-brand-muted line-through">{inr(p.mrp)}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
