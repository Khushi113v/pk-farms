"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import ProductImage from "@/components/common/ProductImage";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Zap, ShoppingBag, Check } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getProductBySlug, defaultVariant, PRODUCTS } from "@/lib/product-data";

// ─── Deals data ───────────────────────────────────────────────────────────────
type Deal = {
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  mrp: number;
};

const DEAL_SLUGS = [
  "pure-desi-cow-ghee",
  "raw-honey",
  "wood-pressed-groundnut-oil",
  "heeng-compounded-asafoetida",
];

const DEALS: Deal[] = DEAL_SLUGS.map((slug) => PRODUCTS.find((p) => p.slug === slug))
  .filter((p): p is (typeof PRODUCTS)[number] => !!p)
  .map((p) => ({ slug: p.slug, name: p.name, category: p.category, image: p.image, price: p.price, mrp: p.mrp }));

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
const pct = (p: number, m: number) => Math.round(((m - p) / m) * 100);

// ─── Countdown to midnight tonight ────────────────────────────────────────────
// `null` until mounted so the server and browser render the same thing
function useCountdownToMidnight() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime();
      setLeft(Math.max(0, Math.round((midnight - now.getTime()) / 1000)));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  const part = (n: number | null) => (n === null ? "--" : String(n).padStart(2, "0"));
  return {
    h: part(left === null ? null : Math.floor(left / 3600)),
    m: part(left === null ? null : Math.floor((left % 3600) / 60)),
    s: part(left === null ? null : left % 60),
  };
}

// ─── Card positions ───────────────────────────────────────────────────────────
// Offset 0 is the front card. ±1 sit beside it, a little behind. Everything else waits
// hidden directly behind the front card, so a new card slides out from underneath it.
function slotStyle(offset: number): React.CSSProperties {
  if (offset === 0) return { transform: "translateX(0) scale(1)", opacity: 1, zIndex: 30 };
  if (offset === -1) return { transform: "translateX(-66%) scale(0.88) rotateY(14deg)", opacity: 0.95, zIndex: 20 };
  if (offset === 1) return { transform: "translateX(66%) scale(0.88) rotateY(-14deg)", opacity: 0.95, zIndex: 20 };
  return { transform: "translateX(0) scale(0.78)", opacity: 0, zIndex: 10 };
}

const AUTO_MS = 3800;

export default function FlashDealsSection() {
  const { h, m, s } = useCountdownToMidnight();
  const count = DEALS.length;
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addItem } = useCart();
  const [addedSlug, setAddedSlug] = useState<string | null>(null);

  // Adds the deal in its default size, like the Add to Cart on the product page
  const addDeal = (slug: string) => {
    const p = getProductBySlug(slug);
    if (!p) return;
    const v = defaultVariant(p);
    addItem({ slug: p.slug, name: p.name, image: v.size?.image ?? p.image, price: v.size?.price ?? p.price, mrp: v.size?.mrp ?? p.mrp, tileBg: p.tileBg, variant: v.label });
    setAddedSlug(slug);
    setTimeout(() => setAddedSlug((s) => (s === slug ? null : s)), 1500);
  };

  const next = useCallback(() => setActive((a) => (a + 1) % count), [count]);
  const prev = useCallback(() => setActive((a) => (a - 1 + count) % count), [count]);

  const startTimer = useCallback(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    if (timer.current) clearInterval(timer.current);
    timer.current = setInterval(next, AUTO_MS);
  }, [next]);

  const stopTimer = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  useEffect(() => {
    startTimer();
    return stopTimer;
  }, [startTimer, stopTimer]);

  // Shortest signed distance from the front card, wrapping around the list
  const offsetOf = (i: number) => {
    const half = Math.floor(count / 2);
    return ((i - active + count + half) % count) - half;
  };

  return (
    <section className="relative overflow-hidden bg-[#E7F0E4] py-6 md:py-9">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
        <div className="text-center">
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-white px-3 py-1.5 rounded-full border border-brand-funk/20">
            <Zap size={14} strokeWidth={2.25} />
            Limited time offers
          </span>
          <h2 className="mt-2.5 font-display font-medium text-brand-ink text-[26px] sm:text-3xl md:text-4xl leading-[1.05]">
            Flash{" "}
            <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">deals</span>
            , gone by midnight.
          </h2>

          {/* Countdown */}
          <div className="mt-3 flex items-center justify-center gap-1.5 sm:gap-2" aria-label="Time left today">
            {[
              { v: h, l: "Hours" },
              { v: m, l: "Minutes" },
              { v: s, l: "Seconds" },
            ].map((t, i) => (
              <div key={t.l} className="flex items-center gap-1.5 sm:gap-2">
                {i > 0 && <span className="-mt-3 text-brand-tan font-display text-lg">:</span>}
                <div className="text-center">
                  <div className="grid place-items-center w-[44px] h-[44px] sm:w-[50px] sm:h-[50px] rounded-lg bg-white border border-brand-line font-display font-medium text-brand-funk text-lg sm:text-xl tabular-nums">
                    {t.v}
                  </div>
                  <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] text-brand-muted">{t.l}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Card stack ── */}
        <div
          className="relative mt-5 md:mt-6"
          style={{ height: "clamp(350px, 50vw, 445px)", perspective: "1100px" }}
          onMouseEnter={stopTimer}
          onMouseLeave={startTimer}
        >
          <button
            aria-label="Previous deal"
            onClick={() => {
              prev();
              startTimer();
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 hidden sm:grid place-items-center w-10 h-10 rounded-full bg-white text-brand-ink border border-brand-line hover:border-brand-funk/40 transition-colors"
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </button>

          {DEALS.map((deal, i) => {
            const offset = offsetOf(i);
            const front = offset === 0;
            const visible = Math.abs(offset) <= 1;
            const discount = pct(deal.price, deal.mrp);
            const card = (
              <>
                <div className="relative overflow-hidden bg-white" style={{ height: "clamp(205px, 32vw, 300px)" }}>
                  <span className="absolute top-3 left-3 z-10 bg-brand-funk text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {discount}% off
                  </span>
                  <ProductImage src={deal.image} alt={deal.name} sizes="(max-width: 768px) 60vw, 260px" inset="inset-4 top-10" />
                </div>
                <div className="px-3.5 py-3 bg-white">
                  <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-brand-tan truncate">{deal.category}</p>
                  <p className="mt-0.5 font-display font-medium text-brand-ink text-[15px] leading-tight truncate">{deal.name}</p>
                  <div className="mt-1.5 flex items-baseline gap-2">
                    <span className="text-base font-semibold text-brand-funk">{inr(deal.price)}</span>
                    <span className="text-xs text-brand-muted line-through">{inr(deal.mrp)}</span>
                    <span className="ml-auto text-[11px] font-medium text-emerald-600">Save {inr(deal.mrp - deal.price)}</span>
                  </div>
                </div>
              </>
            );

            return (
              <div
                key={deal.slug}
                aria-hidden={!visible}
                className="absolute left-1/2 top-0 -ml-[clamp(80px,22vw,130px)]"
                style={{
                  ...slotStyle(offset),
                  width: "clamp(160px, 44vw, 260px)",
                  transition: "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.7s ease",
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                <div className={`rounded-2xl overflow-hidden bg-white border ${front ? "border-brand-funk/30" : "border-brand-line"}`}>
                  {front ? (
                    <Link href={`/products/${deal.slug}`} className="block">
                      {card}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      tabIndex={visible ? 0 : -1}
                      aria-label={`Show ${deal.name}`}
                      onClick={() => {
                        setActive(i);
                        startTimer();
                      }}
                      className="block w-full text-left"
                    >
                      {card}
                    </button>
                  )}
                  <div className="px-3.5 pb-3.5 bg-white">
                    <button
                      type="button"
                      tabIndex={visible ? 0 : -1}
                      onClick={() => addDeal(deal.slug)}
                      className={`w-full inline-flex items-center justify-center gap-2 h-9 rounded-full text-[13px] font-medium tracking-wide text-white transition-colors ${
                        addedSlug === deal.slug ? "bg-emerald-500" : "bg-brand-funk hover:bg-brand-funkDark"
                      }`}
                    >
                      {addedSlug === deal.slug ? <Check size={14} strokeWidth={3} /> : <ShoppingBag size={14} strokeWidth={2} />}
                      {addedSlug === deal.slug ? "Added" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            aria-label="Next deal"
            onClick={() => {
              next();
              startTimer();
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-40 hidden sm:grid place-items-center w-10 h-10 rounded-full text-white bg-brand-funk hover:bg-brand-funkDark transition-colors"
          >
            <ArrowRight size={16} strokeWidth={2} />
          </button>
        </div>

        {/* ── Dots ── */}
        <div className="flex items-center justify-center gap-1.5 mt-4">
          <button
            aria-label="Previous deal"
            onClick={() => {
              prev();
              startTimer();
            }}
            className="sm:hidden mr-2 grid place-items-center w-8 h-8 rounded-full bg-white text-brand-ink border border-brand-line"
          >
            <ArrowLeft size={14} strokeWidth={2} />
          </button>
          {DEALS.map((d, i) => (
            <button
              key={d.slug}
              aria-label={`Deal ${i + 1}`}
              onClick={() => {
                setActive(i);
                startTimer();
              }}
              className={`rounded-full transition-all duration-300 ${
                i === active ? "w-6 h-1.5 bg-brand-funk" : "w-1.5 h-1.5 bg-brand-funk/25 hover:bg-brand-funk/50"
              }`}
            />
          ))}
          <button
            aria-label="Next deal"
            onClick={() => {
              next();
              startTimer();
            }}
            className="sm:hidden ml-2 grid place-items-center w-8 h-8 rounded-full text-white bg-brand-funk"
          >
            <ArrowRight size={14} strokeWidth={2} />
          </button>
        </div>

      </div>
    </section>
  );
}
