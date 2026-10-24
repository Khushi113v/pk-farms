"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Check, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useProductVariant } from "@/components/common/ProductVariants";

export default function StickyAddToCart({
  name,
  tileBg,
}: {
  name: string;
  tileBg: string;
}) {
  const { slug, price, mrp, variant, image } = useProductVariant();
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const [added, setAdded] = useState(false);
  const { addItem, closeCart } = useCart();
  const router = useRouter();
  const item = { slug, name, image, price, mrp, tileBg, variant };

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Leave room under the footer for the bar, so it never covers the bottom of the page
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const fit = () => (document.body.style.paddingBottom = `${bar.offsetHeight}px`);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(bar);
    return () => {
      ro.disconnect();
      document.body.style.paddingBottom = "";
    };
  }, []);

  return (
    <div
      ref={barRef}
      className={`fixed bottom-0 inset-x-0 z-40 bg-white transition-transform duration-300 ${ visible ? "translate-y-0" : "translate-y-full" }`}
    >
      <div
        className="h-[3px] w-full bg-brand-funk hover:bg-brand-funkDark"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2.5 sm:gap-3">
        <div
          className="relative w-11 h-11 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-brand-line shrink-0"
          style={{ backgroundColor: `${tileBg}99` }}
        >
          <Image src={image} alt={name} fill sizes="56px" className="object-contain p-1" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm sm:text-base font-display font-medium text-brand-ink truncate">{name}</p>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base sm:text-lg font-display font-medium text-brand-ink">₹{price}</span>
            <span className="text-xs sm:text-sm text-brand-muted line-through">₹{mrp}</span>
            {mrp > price && (
              <span className="text-[11px] sm:text-xs font-bold text-emerald-600">
                {Math.round(((mrp - price) / mrp) * 100)}% off
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            addItem(item);
            setAdded(true);
            setTimeout(() => setAdded(false), 1500);
          }}
          className={`shrink-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-11 px-3.5 sm:px-6 rounded-full font-medium tracking-wide text-sm sm:text-[15px] border transition-colors ${ added ? "bg-emerald-500 border-emerald-500 text-white" : "bg-brand-strip border-brand-funk/30 text-brand-funk hover:bg-[#D9E6D3]" }`}
        >
          {added ? (
            <>
              <Check size={16} strokeWidth={3} />
              <span className="hidden sm:inline">Added</span>
            </>
          ) : (
            <>
              <ShoppingBag size={15} strokeWidth={2.5} />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            addItem(item);
            closeCart();
            router.push("/checkout");
          }}
          className="shrink-0 inline-flex items-center justify-center gap-1.5 sm:gap-2 h-10 sm:h-11 px-3.5 sm:px-6 rounded-full font-medium tracking-wide text-sm sm:text-[15px] text-white border border-brand-ink/40 transition-colors bg-brand-funk hover:bg-brand-funkDark"
        >
          Buy Now
          <ArrowRight size={15} strokeWidth={2.5} className="hidden sm:block" />
        </button>
      </div>
    </div>
  );
}
