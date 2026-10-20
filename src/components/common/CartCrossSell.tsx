"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { PRODUCTS, getProductBySlug, variantLabel, sizeImage, type Product, type SizeOption } from "@/lib/product-data";
import { useCart } from "@/lib/cart-context";

const OFFER_PCT = 10;
const MAX_TILES = 9;
const VISIBLE_TILES = 3;
const GAP_REM = 0.5;
const offerPrice = (price: number) => Math.round(price * (1 - OFFER_PCT / 100));

type Suggestion = { product: Product; size?: SizeOption; label?: string };

// One box per product size, mixed across products (first sizes of every product, then second sizes…)
function buildSuggestions(): Suggestion[] {
  // one entry per colour group so near-identical listings don't repeat
  const products = PRODUCTS.filter((p) => !p.group || PRODUCTS.find((x) => x.group === p.group) === p);
  const rounds = Math.max(...products.map((p) => p.sizes?.length ?? 1));
  const out: Suggestion[] = [];
  for (let r = 0; r < rounds; r++) {
    for (const p of products) {
      if (p.sizes) {
        const size = p.sizes[r];
        if (size) out.push({ product: p, size, label: variantLabel(p.colour, size) });
      } else if (r === 0) {
        out.push({ product: p });
      }
    }
  }
  return out;
}

const ALL_SUGGESTIONS = buildSuggestions();

export default function CartCrossSell() {
  const { items, addItem, closeCart } = useCart();
  const trackRef = useRef<HTMLDivElement>(null);

  const suggestions = ALL_SUGGESTIONS.filter(
    (s) =>
      !items.some((i) => {
        const inGroup = i.slug === s.product.slug || (!!s.product.group && getProductBySlug(i.slug)?.group === s.product.group);
        return inGroup && (!s.size || i.variant?.includes(s.size.label));
      })
  ).slice(0, MAX_TILES);
  if (suggestions.length === 0) return null;

  const go = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const arrow =
    "w-5 h-5 grid place-items-center rounded-full border border-brand-line bg-white text-brand-muted hover:text-brand-ink hover:border-brand-ink transition-colors";

  return (
    <div className="border-t border-brand-line bg-brand-cream/60 px-5 pt-1.5 pb-2">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2 min-w-0">
          <p className="font-display font-medium text-brand-ink text-[13px] leading-tight truncate">Bundle &amp; save</p>
          <span className="shrink-0 px-1.5 py-px rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
            Extra {OFFER_PCT}% off
          </span>
        </div>
        {suggestions.length > VISIBLE_TILES && (
          <div className="flex items-center gap-1 shrink-0">
            <button type="button" onClick={() => go(-1)} aria-label="Scroll suggestions left" className={arrow}>
              <ChevronLeft size={12} strokeWidth={2.5} />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Scroll suggestions right" className={arrow}>
              <ChevronRight size={12} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ gap: `${GAP_REM}rem` }}
      >
        {suggestions.map(({ product: p, size, label }) => {
          const price = size?.price ?? p.price;
          const mrp = size?.mrp ?? p.mrp;
          const offer = offerPrice(price);
          const title = size ? `${p.name} ${size.label}` : p.name;
          return (
            <div
              key={`${p.slug}-${size?.label ?? "default"}`}
              className="snap-start shrink-0 flex flex-col rounded-xl bg-white border border-brand-line overflow-hidden"
              style={{ width: `calc((100% - ${GAP_REM * (VISIBLE_TILES - 1)}rem) / ${VISIBLE_TILES})` }}
            >
              <Link
                href={`/products/${p.slug}`}
                onClick={closeCart}
                aria-label={`View ${title}`}
                className="relative block h-[72px] bg-brand-soft"
              >
                <Image src={sizeImage(p, size)} alt={title} fill sizes="150px" className="object-cover object-[center_15%]" />
              </Link>
              <div className="px-1.5 pt-1 pb-1">
                <Link
                  href={`/products/${p.slug}`}
                  onClick={closeCart}
                  title={title}
                  className="block text-[11.5px] font-bold text-brand-ink leading-[1.15] min-h-[1.65rem] hover:text-brand-funk transition-colors"
                >
                  {title}
                </Link>
                <div className="mt-0.5 flex items-end justify-between gap-1">
                  <div className="leading-none min-w-0">
                    <div className="flex items-baseline gap-1 text-[9.5px] text-brand-muted line-through">
                      <span>₹{mrp}</span>
                      <span>₹{price}</span>
                    </div>
                    <span className="font-display font-medium text-brand-funk text-[15px] leading-none">₹{offer}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      addItem({
                        slug: p.slug,
                        name: p.name,
                        image: sizeImage(p, size),
                        price: offer,
                        mrp,
                        tileBg: p.tileBg,
                        variant: [label, "Cart offer"].filter(Boolean).join(" · "),
                      })
                    }
                    aria-label={`Add ${title} to cart`}
                    className="shrink-0 inline-flex items-center justify-center gap-1 h-5 px-2.5 rounded-full text-white font-medium tracking-wide text-[10px] border border-brand-ink/30 bg-brand-funk hover:bg-brand-funkDark"
                  >
                    <ShoppingBag size={9} strokeWidth={2.5} />
                    Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
