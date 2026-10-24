"use client";
import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, Minus, ShoppingBag, Check, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getProductBySlug, defaultSizeIndex } from "@/lib/product-data";
import { HAMPER_PREFIX, hamperPrice, type Hamper } from "@/lib/hamper-data";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const shortName = (name: string) => name.replace("Wood Pressed ", "");

// Hamper detail: one box per product (photo, name, size choice, price), a "+" between them,
// then the combo total with the saving, quantity, Add to Cart and Buy Now.
export default function HamperBuilder({ hamper, image }: { hamper: Hamper; image: string }) {
  const products = hamper.items.map((s) => getProductBySlug(s)!).filter(Boolean);
  const [sizeIdx, setSizeIdx] = useState(() => products.map((p) => defaultSizeIndex(p)));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, closeCart } = useCart();
  const router = useRouter();

  const labels = products.map((p, i) => p.sizes?.[sizeIdx[i]]?.label);
  const { price, mrp, save, offPct } = hamperPrice(hamper, labels);

  const item = {
    slug: HAMPER_PREFIX + hamper.slug,
    name: hamper.name,
    image,
    price,
    mrp,
    tileBg: "#FBF4E8",
    variant: products.map((p, i) => `${shortName(p.name)} ${labels[i] ?? ""}`.trim()).join(" + "),
  };

  return (
    <div>
      {/* Price */}
      <div className="mt-4 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <span className="font-display font-semibold text-brand-ink text-[26px] md:text-3xl">{inr(price)}</span>
        <span className="text-base text-brand-muted line-through">{inr(mrp)}</span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs md:text-sm font-bold text-emerald-700">
          {offPct}% off · Save {inr(save)}
        </span>
      </div>
      <p className="mt-1 text-xs text-brand-muted">Inclusive of all taxes</p>

      {/* What's inside: choose each size */}
      <p className="mt-6 mb-2 text-xs font-bold uppercase tracking-wider text-brand-muted">What&apos;s inside · choose sizes</p>
      <div className="flex flex-col">
        {products.map((p, i) => {
          const size = p.sizes?.[sizeIdx[i]];
          return (
            <Fragment key={p.slug}>
              {i > 0 && (
                <span className="relative z-10 -my-3 mx-auto grid place-items-center w-8 h-8 rounded-full bg-brand-funk text-white ring-4 ring-white">
                  <Plus size={16} strokeWidth={3} />
                </span>
              )}
              <div className="rounded-2xl border border-brand-line bg-white p-3 md:p-4 flex gap-3 md:gap-4">
                <Link
                  href={`/products/${p.slug}`}
                  className="relative shrink-0 w-[72px] h-[72px] md:w-20 md:h-20 rounded-xl border border-brand-line bg-[#FBF8F1] overflow-hidden"
                >
                  <Image src={p.image} alt={p.name} fill sizes="80px" className="object-contain p-1.5" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/products/${p.slug}`} className="font-display font-medium text-brand-ink text-[15px] md:text-base leading-snug hover:text-brand-funk">
                      {p.name}
                    </Link>
                    <span className="shrink-0 text-right leading-tight">
                      <span className="block text-sm font-bold text-brand-ink">{inr(size?.price ?? p.price)}</span>
                      <span className="block text-[11px] text-brand-muted line-through">{inr(size?.mrp ?? p.mrp)}</span>
                    </span>
                  </div>
                  {p.sizes && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {p.sizes.map((s, j) => {
                        const on = j === sizeIdx[i];
                        return (
                          <button
                            key={s.label}
                            type="button"
                            aria-pressed={on}
                            onClick={() => setSizeIdx((arr) => arr.map((v, k) => (k === i ? j : v)))}
                            className={`h-8 px-3 rounded-lg border text-xs font-semibold transition-colors ${
                              on
                                ? "border-brand-funk bg-brand-strip text-brand-funk"
                                : "border-brand-line text-brand-ink hover:border-brand-funk/40"
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>

      {/* Combo saving note */}
      <p className="mt-3 rounded-xl bg-brand-strip/70 border border-brand-funk/15 px-3.5 py-2.5 text-[13px] text-brand-ink">
        <span className="font-bold text-brand-funk">Extra {hamper.off}% off</span> when bought together as a combo.
      </p>

      {/* Actions */}
      <div className="mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3">
        <div className="inline-flex items-center gap-1 bg-[#F4EEDD] border border-brand-ink/15 rounded-xl p-1">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 grid place-items-center rounded-lg text-brand-ink hover:bg-white transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={14} strokeWidth={2.5} />
          </button>
          <span className="w-6 text-center font-display font-medium text-brand-ink">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="w-9 h-9 grid place-items-center rounded-lg text-brand-ink hover:bg-white transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => {
            addItem(item, qty);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className={`inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full font-medium tracking-wide text-base border transition-colors ${
            added ? "bg-emerald-500 border-emerald-500 text-white" : "bg-brand-strip border-brand-funk/30 text-brand-funk hover:bg-[#D9E6D3]"
          }`}
        >
          {added ? <Check size={17} strokeWidth={3} /> : <ShoppingBag size={16} strokeWidth={2.5} />}
          {added ? "Added" : "Add to Cart"}
        </button>
        <button
          type="button"
          onClick={() => {
            addItem(item, qty);
            closeCart();
            router.push("/checkout");
          }}
          className="inline-flex items-center gap-2 h-12 pl-6 pr-2 rounded-full text-white font-medium tracking-wide text-base border border-brand-ink/40 bg-brand-funk hover:bg-brand-funkDark transition-colors"
        >
          <span>Buy Now</span>
          <span className="grid place-items-center w-8 h-8 rounded-full bg-white text-brand-funk border border-brand-ink/40">
            <ArrowRight size={14} strokeWidth={3} />
          </span>
        </button>
      </div>
    </div>
  );
}
