"use client";
import { createContext, useContext, useState } from "react";
import {
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
  price: number;
  mrp: number;
  image: string;
  images: string[];
  variant?: string;
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
  const size = current.sizes?.[sizeIdx];

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
        price: size?.price ?? current.price,
        mrp: size?.mrp ?? current.mrp,
        image: sizeImage(current, size),
        images: sizeGallery(current, size),
        variant: variantLabel(current.colour, size),
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
          <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">Pack size</p>
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
    </div>
  );
}

// Product gallery that follows the selected colour / size pack shots.
export function VariantGallery(props: Omit<React.ComponentProps<typeof ProductGallery>, "images">) {
  const { images } = useProductVariant();
  return <ProductGallery {...props} images={images} />;
}
