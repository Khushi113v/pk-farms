"use client";
import { createContext, useContext, useState } from "react";
import Image from "next/image";
import {
  PACKS,
  packPrice,
  type PackOption,
  variantLabel,
  defaultSizeIndex,
  sizeImage,
  sizeGallery,
  type SizeOption,
  type ColourOption,
  COLOUR_HEX,
} from "@/lib/product-data";
import ProductGallery from "@/components/common/ProductGallery";

type VariantState = {
  slug: string;
  colour?: string;
  options: ColourOption[];
  setColour: (slug: string) => void;
  sizes?: SizeOption[];
  sizeIdx: number;
  setSizeIdx: (i: number) => void;
  packIdx: number;
  setPackIdx: (i: number) => void;
  unit: { price: number; mrp: number }; // price of one unit of the selected size
  price: number;
  mrp: number;
  image: string;
  images: string[];
  variant?: string;
  packImages?: Partial<Record<number, string>>;
};

const VariantContext = createContext<VariantState | null>(null);

export function useProductVariant() {
  const ctx = useContext(VariantContext);
  if (!ctx) throw new Error("useProductVariant must be used within a ProductVariantProvider");
  return ctx;
}

// Colour and size are both switched in place — only the selection, images and prices change.
// Switching colour also updates the URL (without a navigation) so the link stays shareable.
export function ProductVariantProvider({
  children,
  options,
  initialSlug,
}: {
  children: React.ReactNode;
  options: ColourOption[];
  initialSlug: string;
}) {
  const [slug, setSlug] = useState(initialSlug);
  const current = options.find((o) => o.slug === slug) ?? options[0];
  const [sizeIdx, setSizeIdx] = useState(() => defaultSizeIndex(current));
  const [packIdx, setPackIdx] = useState(0);
  const size = current.sizes?.[sizeIdx];
  const pack = PACKS[packIdx] ?? PACKS[0];
  const unit = { price: size?.price ?? current.price, mrp: size?.mrp ?? current.mrp };
  const total = packPrice(unit, pack);
  const sizeLabel = variantLabel(current.colour, size);

  const setColour = (next: string) => {
    const target = options.find((o) => o.slug === next);
    if (!target || next === slug) return;
    // keep the same pack size if the other colour has it
    const same = target.sizes?.findIndex((s) => s.label === size?.label) ?? -1;
    setSizeIdx(same >= 0 ? same : defaultSizeIndex(target));
    setSlug(next);
    window.history.replaceState(null, "", `/products/${next}`);
  };

  return (
    <VariantContext.Provider
      value={{
        slug: current.slug,
        colour: current.colour,
        options,
        setColour,
        sizes: current.sizes,
        sizeIdx,
        setSizeIdx,
        packIdx,
        setPackIdx,
        unit,
        price: total.price,
        mrp: total.mrp,
        image: (pack.qty > 1 && current.packImages?.[pack.qty]) || sizeImage(current, size),
        images: sizeGallery(current, size),
        variant: pack.qty > 1 ? [sizeLabel, `Pack of ${pack.qty}`].filter(Boolean).join(" · ") : sizeLabel,
        packImages: current.packImages,
      }}
    >
      {children}
    </VariantContext.Provider>
  );
}

export function PriceBlock() {
  const { price, mrp } = useProductVariant();
  const discount = Math.round(((mrp - price) / mrp) * 100);

  return (
    <div className="mt-5 flex items-baseline gap-3">
      <span className="font-display font-medium text-brand-ink text-3xl">₹{price}</span>
      <span className="text-lg text-brand-muted line-through">₹{mrp}</span>
      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
        {discount}% off
      </span>
    </div>
  );
}

const chipBase = "px-4 py-2 rounded-xl border text-sm font-semibold transition-colors";
const chipOn = "border-brand-funk bg-brand-strip text-brand-funk";
const chipOff = "border-brand-line text-brand-ink hover:border-brand-ink/40";

export function VariantSelector() {
  const { slug, colour, options, setColour, sizes, sizeIdx, setSizeIdx } = useProductVariant();
  if (!colour && !sizes) return null;

  return (
    <div className="mt-6 space-y-4">
      {colour && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
            Colour{" "}
            <span className="normal-case tracking-normal font-medium text-brand-ink">· {colour}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => (
              <button
                key={o.slug}
                type="button"
                aria-pressed={o.slug === slug}
                onClick={() => setColour(o.slug)}
                className={`${chipBase} inline-flex items-center gap-2 ${o.slug === slug ? chipOn : chipOff}`}
              >
                <span
                  aria-hidden
                  className="w-4 h-4 rounded-full border border-black/10"
                  style={{ backgroundColor: COLOUR_HEX[o.colour ?? ""] ?? "#ddd" }}
                />
                {o.colour}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s, i) => (
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

      <PackSelector />
    </div>
  );
}

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Photo for a pack box: the product's own pack shot if there is one,
// otherwise copies of the jar side by side (2 or 3, slightly overlapping).
function PackPhoto({ src, packSrc, qty }: { src: string; packSrc?: string; qty: number }) {
  if (packSrc) return <Image src={packSrc} alt="" fill sizes="64px" className="object-contain" />;
  const offsets = qty === 1 ? [0] : qty === 2 ? [-18, 18] : [-26, 0, 26];
  return (
    <>
      {offsets.map((x, i) => (
        <span
          key={i}
          className="absolute inset-y-0 w-[62%]"
          style={{ left: `calc(19% + ${x}%)`, zIndex: qty === 3 ? (i === 1 ? 3 : 1) : i + 1 }}
        >
          <Image src={src} alt="" fill sizes="48px" className="object-contain drop-shadow-[0_2px_3px_rgba(31,45,36,0.25)]" />
        </span>
      ))}
    </>
  );
}

// Multi-buy boxes under the size: Pack of 1 / 2 / 3, each with its price, MRP, % off and saving.
export function PackSelector() {
  const { unit, packIdx, setPackIdx, image, packImages, sizes, sizeIdx } = useProductVariant();
  const unitImage = sizes?.[sizeIdx]?.image ?? image;

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">Choose pack</p>
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {PACKS.map((pack: PackOption, i) => {
          const on = i === packIdx;
          const t = packPrice(unit, pack);
          return (
            <button
              key={pack.qty}
              type="button"
              aria-pressed={on}
              onClick={() => setPackIdx(i)}
              className={`relative flex flex-col items-center text-center rounded-xl border px-1.5 pt-3 pb-2 transition-colors ${
                on ? "border-brand-funk bg-brand-strip/60 ring-1 ring-brand-funk" : "border-brand-line bg-white hover:border-brand-funk/40"
              }`}
            >
              {pack.tag && (
                <span
                  className={`absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] ${
                    pack.tag === "Best Value" ? "bg-brand-tan text-brand-ink" : "bg-brand-funk text-white"
                  }`}
                >
                  {pack.tag}
                </span>
              )}
              <span className="relative w-14 h-10 sm:w-16 sm:h-11">
                <PackPhoto src={unitImage} packSrc={packImages?.[pack.qty]} qty={pack.qty} />
              </span>
              <span className="mt-1 text-[12px] sm:text-[13px] font-bold text-brand-ink leading-tight">Pack of {pack.qty}</span>
              <span className="mt-0.5 flex flex-wrap items-baseline justify-center gap-x-1 leading-tight">
                <span className="text-[13px] sm:text-sm font-bold text-brand-ink">{inr(t.price)}</span>
                <span className="text-[10px] sm:text-[11px] text-brand-muted line-through">{inr(t.mrp)}</span>
              </span>
              <span className="mt-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-700 leading-tight">
                Save {inr(t.save)} · {t.offPct}% off
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Product gallery that follows the selected colour / size pack shots.
export function VariantGallery(props: Omit<React.ComponentProps<typeof ProductGallery>, "images">) {
  const { images } = useProductVariant();
  return <ProductGallery {...props} images={images} />;
}
