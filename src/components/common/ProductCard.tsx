"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Eye, ShoppingBag, Check, Heart } from "lucide-react";
import {
  getProductBySlug,
  colourOptions,
  variantLabel,
  defaultSizeIndex,
  sizeImage,
  COLOUR_HEX,
} from "@/lib/product-data";
import { useCart } from "@/lib/cart-context";

const chipBase =
  "px-2 py-0.5 rounded-md border text-[10px] md:text-[11px] font-semibold leading-tight transition-colors";
const chipOn = "border-brand-funk bg-brand-strip text-brand-funk";
const chipOff = "border-brand-line text-brand-muted hover:border-brand-ink/40 hover:text-brand-ink";

export default function ProductCard({
  slug,
  onRemove,
}: {
  slug: string;
  onRemove?: () => void;
}) {
  const first = getProductBySlug(slug);
  const options = first ? colourOptions(first) : [];
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  // Colour options are separate listings in the same group — switching swaps the photo and link
  const [colourIdx, setColourIdx] = useState(() => Math.max(0, options.findIndex((o) => o.slug === slug)));
  const [sizeIdx, setSizeIdx] = useState(() => (first ? defaultSizeIndex(first) : 0));

  const product = getProductBySlug(options[colourIdx]?.slug ?? slug);
  if (!product) return null;

  const size = product.sizes?.[sizeIdx];
  const price = size?.price ?? product.price;
  const mrp = size?.mrp ?? product.mrp;
  const image = sizeImage(product, size);
  const label = variantLabel(product.colour, size);

  return (
    <div
      className="group relative rounded-2xl bg-white border border-brand-ink/25 overflow-hidden flex flex-col transition-all duration-300 hover:border-brand-ink/50"
      style={{ boxShadow: "0 14px 30px -22px rgba(31,45,36,0.35)" }}
    >
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square bg-[#F7F3EA] border-b border-brand-line/70 overflow-hidden">
          <div className="absolute top-1.5 left-1.5 right-1.5 md:top-2 md:left-2 md:right-2 z-10 flex items-center justify-between gap-1.5">
            {!onRemove && product.category && (
              <span className="inline-flex items-center px-2 py-0.5 md:px-2.5 md:py-1 rounded-full bg-white text-brand-funk text-[8px] md:text-[10px] font-medium uppercase tracking-[0.15em]">
                {product.category}
              </span>
            )}
          </div>
          {/* Padded frame: the whole photo stays visible whatever its size or shape */}
          <div className="absolute inset-x-3 top-9 bottom-3 md:inset-x-5 md:top-12 md:bottom-5">
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 40vw, 20vw"
              className="object-contain drop-shadow-sm group-hover:scale-[1.04] transition-transform duration-500"
            />
          </div>
        </div>
      </Link>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove from wishlist"
          className="absolute top-1.5 right-1.5 md:top-2 md:right-2 z-10 grid place-items-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
        >
          <Heart size={15} fill="currentColor" />
        </button>
      )}

      <div className="flex-1 p-2.5 md:p-3.5 flex flex-col gap-1 md:gap-1.5">
        <p
          className="text-[9px] md:text-[11px] font-bold uppercase tracking-wider"
          style={{ color: "#8A6420" }}
        >
          {product.style}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-display font-medium text-brand-ink text-[13px] md:text-[17px] leading-[1.15] hover:text-brand-funk transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1">
          <Star size={12} className="fill-yellow-400 text-yellow-400" strokeWidth={0} />
          <span className="text-[11px] font-semibold text-brand-ink">{product.rating}</span>
          <span className="text-[10px] text-brand-muted">({product.reviewCount})</span>
        </div>

        {product.colour && (
          <div className="mt-0.5">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1">
              Colour{" "}
              <span className="normal-case tracking-normal font-medium text-brand-ink">· {product.colour}</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {options.map((o, i) => (
                <button
                  key={o.slug}
                  type="button"
                  aria-label={o.colour}
                  aria-pressed={i === colourIdx}
                  title={o.colour}
                  onClick={() => setColourIdx(i)}
                  className={`w-5 h-5 rounded-full border transition-shadow ${
                    i === colourIdx
                      ? "ring-2 ring-offset-1 ring-brand-funk border-white"
                      : "border-brand-line hover:ring-1 hover:ring-brand-ink/30"
                  }`}
                  style={{ backgroundColor: COLOUR_HEX[o.colour ?? ""] ?? "#ddd" }}
                />
              ))}
            </div>
          </div>
        )}

        {product.sizes && (
          <div className="mt-0.5">
            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-brand-muted mb-1">
              Pack size
            </p>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((s, i) => (
                <button
                  key={s.label}
                  type="button"
                  aria-pressed={i === sizeIdx}
                  onClick={() => setSizeIdx(i)}
                  className={`${chipBase} ${i === sizeIdx ? chipOn : chipOff}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-baseline gap-1.5">
          <span className="font-display font-medium text-brand-ink text-sm md:text-base">₹{price}</span>
          <span className="text-xs text-brand-muted line-through">₹{mrp}</span>
        </div>

        <div className="mt-auto pt-1.5 flex items-center gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-full border border-brand-ink/25 text-brand-ink text-xs md:text-sm font-bold hover:border-brand-ink hover:bg-brand-ink hover:text-white transition-colors"
          >
            <Eye size={14} strokeWidth={2.5} />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">Details</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              addItem({
                slug: product.slug,
                name: product.name,
                image,
                price,
                mrp,
                tileBg: product.tileBg,
                variant: label,
              });
              setAdded(true);
              setTimeout(() => setAdded(false), 1500);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-full text-white text-xs md:text-sm font-bold transition-all"
            style={{
              backgroundColor: added ? "#16A34A" : "#0B5B36",
            }}
          >
            {added ? (
              <>
                <Check size={14} strokeWidth={3} />
                <span className="hidden sm:inline">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={13} strokeWidth={2.5} />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
