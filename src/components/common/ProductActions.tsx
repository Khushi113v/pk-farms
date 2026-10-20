"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check, Minus, Plus, ArrowRight, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useWishlist } from "@/lib/wishlist-context";
import { useProductVariant } from "@/components/common/ProductVariants";

export default function ProductActions({
  name,
  tileBg,
}: {
  name: string;
  tileBg: string;
}) {
  const { slug, price, mrp, variant, image } = useProductVariant();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, closeCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const router = useRouter();
  const wishlisted = isWishlisted(slug);

  const item = { slug, name, image, price, mrp, tileBg, variant };

  return (
    <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
      {/* Quantity stepper */}
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

      {/* Add to cart + Buy now — same height, both a little wider */}
      <button
        type="button"
        onClick={() => {
          addItem(item, qty);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className={`inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full font-medium tracking-wide text-base border transition-colors ${ added ? "bg-emerald-500 border-emerald-500 text-white" : "bg-brand-strip border-brand-funk/30 text-brand-funk hover:bg-[#D9E6D3]" }`}
      >
        {added ? (
          <>
            <Check size={17} strokeWidth={3} />
            Added
          </>
        ) : (
          <>
            <ShoppingBag size={16} strokeWidth={2.5} />
            Add to Cart
          </>
        )}
      </button>

      {/* Buy Now — same style as the Hero "Shop Bestsellers" CTA */}
      <button
        type="button"
        onClick={() => {
          addItem(item, qty);
          closeCart();
          router.push("/checkout");
        }}
        className="group relative inline-flex items-center gap-2 h-12 pl-6 pr-2 rounded-full text-white font-medium tracking-wide text-base border border-brand-ink/40 transition-colors bg-brand-funk hover:bg-brand-funkDark"
      >
        <span>Buy Now</span>
        <span className="grid place-items-center w-8 h-8 rounded-full bg-white text-brand-funk border border-brand-ink/40 transition-transform">
          <ArrowRight size={14} strokeWidth={3} />
        </span>
      </button>

      {/* Wishlist toggle */}
      <button
        type="button"
        onClick={() => toggleWishlist(slug)}
        aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
        className={`shrink-0 w-12 h-12 grid place-items-center rounded-full border transition-colors ${ wishlisted ? "bg-brand-strip border-brand-funk/40 text-brand-funk" : "bg-white border-brand-ink/15 text-brand-muted hover:text-brand-funk hover:border-brand-funk/40" }`}
      >
        <Heart size={18} strokeWidth={2.25} fill={wishlisted ? "currentColor" : "none"} />
      </button>
    </div>
  );
}
