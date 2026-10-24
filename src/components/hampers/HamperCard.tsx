"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, ShoppingBag, Check, Plus } from "lucide-react";
import ProductImage from "@/components/common/ProductImage";
import { useCart } from "@/lib/cart-context";
import { getProductBySlug, defaultVariant } from "@/lib/product-data";
import { HAMPER_PREFIX, hamperPrice, type Hamper } from "@/lib/hamper-data";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Hamper listing card: photo, the two products inside, combo price and quick add (default sizes)
export default function HamperCard({ hamper, image }: { hamper: Hamper; image: string }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const { price, mrp, offPct } = hamperPrice(hamper);
  const products = hamper.items.map((s) => getProductBySlug(s)).filter((p) => !!p);
  const href = `/hampers/${hamper.slug}`;

  const add = () => {
    addItem({
      slug: HAMPER_PREFIX + hamper.slug,
      name: hamper.name,
      image,
      price,
      mrp,
      tileBg: "#FBF4E8",
      variant: products.map((p) => `${p!.name.replace("Wood Pressed ", "")} ${defaultVariant(p!).label ?? ""}`.trim()).join(" + "),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="group relative rounded-2xl bg-white border border-brand-ink/25 overflow-hidden flex flex-col transition-colors duration-300 hover:border-brand-ink/50"
      style={{ boxShadow: "0 14px 30px -22px rgba(31,45,36,0.35)" }}
    >
      <Link href={href} className="block">
        <div className="relative aspect-[5/4] bg-[radial-gradient(ellipse_at_50%_70%,#FBF1D7_0%,#FFFFFF_70%)] border-b border-brand-line/70 overflow-hidden">
          <div className="absolute top-2 left-2 right-2 z-10 flex items-center justify-between gap-1.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white text-brand-funk text-[9px] md:text-[10px] font-medium uppercase tracking-[0.15em]">
              Combo of {hamper.items.length}
            </span>
            {hamper.tag && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-brand-tan text-brand-ink text-[9px] md:text-[10px] font-bold uppercase tracking-[0.1em]">
                {hamper.tag}
              </span>
            )}
          </div>
          <ProductImage
            src={image}
            alt={hamper.name}
            sizes="(max-width: 1024px) 45vw, 22vw"
            className="group-hover:scale-[1.04] transition-transform duration-500"
          />
        </div>
      </Link>

      <div className="flex-1 p-2.5 md:p-3 flex flex-col gap-1">
        <Link href={href}>
          <h3 className="font-display font-medium text-brand-ink text-[13px] md:text-[17px] leading-[1.15] hover:text-brand-funk transition-colors">
            {hamper.name}
          </h3>
        </Link>

        {/* What's inside */}
        <div className="mt-0.5 flex flex-wrap items-center gap-1">
          {products.map((p, i) => (
            <span key={p!.slug} className="inline-flex items-center gap-1">
              {i > 0 && <Plus size={10} strokeWidth={3} className="text-brand-muted" />}
              <span className="px-2 py-0.5 rounded-md border border-brand-line text-[10px] md:text-[11px] font-semibold text-brand-ink/80">
                {p!.category === "Oils" ? "Groundnut Oil" : p!.category === "Spices" ? "Heeng" : p!.category}
              </span>
            </span>
          ))}
        </div>

        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="font-display font-medium text-brand-ink text-sm md:text-base">{inr(price)}</span>
          <span className="text-xs text-brand-muted line-through">{inr(mrp)}</span>
          <span className="text-[10px] md:text-[11px] font-semibold text-emerald-700">{offPct}% off</span>
        </div>

        <div className="mt-auto pt-1 flex items-center gap-1.5 md:gap-2">
          <Link
            href={href}
            className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 h-8 px-2 rounded-full border border-brand-ink/25 text-brand-ink text-[11px] md:text-xs font-bold whitespace-nowrap hover:border-brand-ink hover:bg-brand-ink hover:text-white transition-colors"
          >
            <Eye size={13} strokeWidth={2.5} />
            <span className="hidden sm:inline">View Details</span>
            <span className="sm:hidden">Details</span>
          </Link>
          <button
            type="button"
            onClick={add}
            className="flex-1 min-w-0 inline-flex items-center justify-center gap-1 h-8 px-2 rounded-full text-white text-[11px] md:text-xs font-bold whitespace-nowrap transition-all"
            style={{ backgroundColor: added ? "#16A34A" : "#0B5B36" }}
          >
            {added ? <Check size={13} strokeWidth={3} /> : <ShoppingBag size={12} strokeWidth={2.5} />}
            <span className="hidden sm:inline">{added ? "Added" : "Add to Cart"}</span>
            <span className="sm:hidden">{added ? "Added" : "Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
