"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, ShoppingBag, Check, Eye } from "lucide-react";
import { useWishlist } from "@/lib/wishlist-context";
import { useCart } from "@/lib/cart-context";
import { useAutoScroll } from "@/lib/use-auto-scroll";
import { useInfiniteLoop } from "@/lib/use-infinite-loop";
import { PRODUCTS, defaultVariant, type Collection, type Product } from "@/lib/product-data";
import ProductImage from "@/components/common/ProductImage";

type Variant = "new" | "bestseller" | "featured";

// Badge for each kind of section
const STYLE: Record<Variant, { badge: string; badgeCls: string }> = {
  new: { badge: "New", badgeCls: "bg-brand-funk text-white" },
  bestseller: { badge: "Best Seller", badgeCls: "bg-brand-tan text-brand-ink" },
  featured: { badge: "Featured", badgeCls: "bg-white text-brand-funk border border-brand-funk/20" },
};

type SectionProps = {
  title: string; // main heading, e.g. "Best Sellers"
  subtitle?: string; // line under the heading
  variant?: Variant;
  collection?: Collection; // products from this collection, and the "View all" link
  slugs?: string[]; // or an explicit list, in order
  white?: boolean; // white background instead of cream
  decorated?: boolean; // soft gradient + faint glows instead of a flat background
  interval?: number;
};

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

function ProductCard({ p, variant, showBadge = true }: { p: Product; variant: Variant; showBadge?: boolean }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const wished = isWishlisted(p.slug);
  const off = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
  const { badge, badgeCls } = STYLE[variant];

  // Quick add in the default pack, like the Add to Cart on the product page
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
    <div className="group relative flex flex-col h-full rounded-[22px] bg-white border border-brand-line overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-brand-funk/30 hover:shadow-[0_24px_40px_-28px_rgba(31,45,36,0.45)]">
      {/* Image */}
      <Link href={`/products/${p.slug}`} className="relative block aspect-[5/4] overflow-hidden">
        {/* Soft warm glow behind the product */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_58%,#FBF1D7_0%,#FFFFFF_68%)]" />
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[9%] w-[55%] h-[10%] rounded-[50%] bg-brand-tan/15 blur-md" />
        <ProductImage
          src={p.image}
          alt={p.name}
          sizes="(max-width: 1024px) 45vw, 22vw"
          className="group-hover:scale-[1.04] transition-transform duration-700 ease-out"
        />
      </Link>

      {/* Badge + wishlist */}
      <div className="absolute top-2 left-2 right-2 md:top-2.5 md:left-2.5 md:right-2.5 z-10 flex items-start justify-between gap-2 pointer-events-none">
        {showBadge ? (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-[0.14em] ${badgeCls}`}>
            {badge}
          </span>
        ) : (
          <span />
        )}
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          onClick={() => toggleWishlist(p.slug)}
          className="pointer-events-auto grid place-items-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white border border-brand-line text-brand-funk hover:border-brand-funk/40 transition-colors"
        >
          <Heart size={15} strokeWidth={1.75} className={wished ? "fill-brand-funk" : ""} />
        </button>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-1 px-3.5 pb-3.5 pt-3 md:px-5 md:pb-5 md:pt-4 border-t border-brand-line/70">
        <p className="text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-tan">{p.category}</p>

        <Link href={`/products/${p.slug}`}>
          <h3 className="mt-1.5 font-display font-semibold text-brand-ink text-[14px] md:text-[18px] leading-snug group-hover:text-brand-funk transition-colors line-clamp-2">
            {p.name}
          </h3>
        </Link>
        <p className="mt-1 text-[11px] md:text-[13px] text-brand-muted leading-snug line-clamp-1">{p.hint}</p>

        <div className="mt-auto pt-3 flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
          <span className="text-base md:text-lg font-bold text-brand-ink">{inr(p.price)}</span>
          {off > 0 && (
            <>
              <span className="text-[11px] md:text-xs text-brand-muted line-through">{inr(p.mrp)}</span>
              <span className="text-[11px] md:text-xs font-bold text-brand-funk">{off}% off</span>
            </>
          )}
        </div>

        {/* Two equal buttons side by side; short labels on phones */}
        <div className="mt-3 grid grid-cols-2 gap-1.5 md:gap-2">
          <Link
            href={`/products/${p.slug}`}
            aria-label={`View details of ${p.name}`}
            className="inline-flex items-center justify-center gap-1 md:gap-1.5 h-8 md:h-9 px-1.5 md:px-2 rounded-full border border-brand-funk/40 text-brand-funk text-[11px] md:text-[13px] font-semibold hover:border-brand-funk hover:bg-brand-strip transition-colors"
          >
            <Eye size={14} strokeWidth={2} className="shrink-0" />
            <span className="hidden min-[360px]:inline lg:hidden">Details</span>
            <span className="hidden lg:inline">View Details</span>
          </Link>
          <button
            type="button"
            onClick={add}
            aria-label={`Add ${p.name} to cart`}
            className={`inline-flex items-center justify-center gap-1 md:gap-1.5 h-8 md:h-9 px-1.5 md:px-2 rounded-full text-[11px] md:text-[13px] font-semibold shadow-[0_8px_16px_-10px_rgba(11,91,54,0.6)] transition-all duration-300 active:scale-[0.98] ${
              added ? "bg-brand-tan text-brand-ink" : "bg-brand-funk text-white hover:bg-brand-funkDark"
            }`}
          >
            {added ? <Check size={14} strokeWidth={2.5} className="shrink-0" /> : <ShoppingBag size={14} strokeWidth={2} className="shrink-0" />}
            {added ? (
              "Added"
            ) : (
              <>
                <span className="hidden min-[360px]:inline lg:hidden">Cart</span>
                <span className="hidden lg:inline">Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProductsSection({
  title,
  subtitle,
  variant = "featured",
  collection,
  slugs,
  white = false,
  decorated = false,
  interval = 4200,
}: SectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const picked = slugs
    ? slugs.map((s) => PRODUCTS.find((p) => p.slug === s)).filter((p): p is Product => !!p)
    : collection
      ? PRODUCTS.filter((p) => p.collections?.includes(collection))
      : PRODUCTS;
  // A short collection is topped up with other products so the slider never shows the same card twice in view
  const list = picked.length >= 4 ? picked : [...picked, ...PRODUCTS.filter((p) => !picked.includes(p))];
  // Rendered 3× so the auto-slider loops seamlessly (see useInfiniteLoop).
  const LOOP = [...list, ...list, ...list];
  useInfiniteLoop(trackRef, list.length);
  useAutoScroll(trackRef, { interval });

  const viewAll = collection ? `/shop?collection=${collection}` : "/shop";

  const scrollBy = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: ((first?.getBoundingClientRect().width ?? 280) + gap) * (dir === "left" ? -1 : 1), behavior: "smooth" });
  };

  return (
    <section className={`relative py-10 md:py-14 overflow-hidden ${white ? "bg-white" : "bg-brand-cream"}`}>
      {decorated && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {/* Soft cream-to-ivory wash */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#F6EEDB_0%,#FAF6EC_45%,#FBF8F1_100%)]" />
          {/* Two faint glows: gold top-left, sage bottom-right */}
          <div className="absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full bg-[#F3D98B]/25 blur-3xl" />
          <div className="absolute -bottom-40 -right-24 w-[560px] h-[560px] rounded-full bg-[#CFE0A8]/30 blur-3xl" />
          {/* Barely visible dot texture */}
          <div className="absolute inset-0 opacity-[0.35] bg-[radial-gradient(circle,#E2D6B4_1px,transparent_1.5px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        </div>
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7 md:mb-9 flex items-end justify-between gap-6">
          <div className="min-w-0">
            <h2 className="font-hero font-bold text-brand-ink text-[30px] sm:text-4xl md:text-[46px] leading-none">{title}</h2>
            {subtitle && (
              <p className="mt-3 flex items-center gap-3 text-brand-ink/70 text-sm md:text-base">
                <span className="h-px w-8 bg-brand-tan" />
                <span className="italic">{subtitle}</span>
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={viewAll}
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-funk hover:text-brand-funkDark mr-1"
            >
              View all
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
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

        {/* Product slider (py gives the hover lift room) */}
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-1 pb-3"
        >
          {LOOP.map((p, idx) => (
            <div
              key={idx}
              className="snap-start shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.85rem)] lg:w-[calc(25%-1.125rem)]"
            >
              <ProductCard p={p} variant={variant} showBadge={!collection || !!p.collections?.includes(collection)} />
            </div>
          ))}
        </div>

        {/* View all on phones */}
        <div className="sm:hidden mt-4 text-center">
          <Link href={viewAll} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-funk">
            View all
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
