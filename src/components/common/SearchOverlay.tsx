"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { PRODUCTS, searchProducts, sizeImage, defaultVariant } from "@/lib/product-data";

const POPULAR = ["Ghee", "Honey", "Groundnut oil", "Heeng"];
const MAX_RESULTS = 6;

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = useMemo(() => searchProducts(query), [query]);
  const trimmed = query.trim();

  useEffect(() => {
    if (!open) return;
    setQuery("");
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const submit = (q: string) => {
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[90]">
      <div onClick={onClose} aria-hidden className="absolute inset-0 bg-brand-ink/55" />
      <div
        role="dialog"
        aria-label="Search products"
        className="relative mx-auto mt-3 sm:mt-16 w-[calc(100%-1.5rem)] max-w-2xl max-h-[85vh] flex flex-col bg-white rounded-2xl border border-brand-line shadow-2xl overflow-hidden"
      >
        <div
          className="h-[3px] w-full shrink-0 bg-brand-funk hover:bg-brand-funkDark"
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit(query);
          }}
          className="flex items-center gap-2 px-4 py-3 border-b border-brand-line shrink-0"
        >
          <Search size={18} className="shrink-0 text-brand-funk" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ghee, honey, oil, spices…"
            className="flex-1 min-w-0 h-10 bg-transparent text-brand-ink placeholder:text-brand-muted focus:outline-none text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="shrink-0 text-xs font-semibold text-brand-muted hover:text-brand-ink"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 w-9 h-9 grid place-items-center rounded-full text-brand-ink hover:bg-brand-cream transition-colors"
          >
            <X size={18} />
          </button>
        </form>

        <div className="overflow-y-auto p-4">
          {!trimmed ? (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2.5">Popular searches</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setQuery(t)}
                    className="px-3.5 py-1.5 rounded-full border border-brand-line text-sm font-semibold text-brand-ink hover:border-brand-funk hover:text-brand-funk hover:bg-brand-strip transition-colors"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center">
              <p className="font-display font-medium text-brand-ink">No products found for “{trimmed}”</p>
              <p className="mt-1 text-sm text-brand-muted">
                Try a different word, or browse all {PRODUCTS.length} products.
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-funk hover:underline"
              >
                Browse shop <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-2">
                {results.length} {results.length === 1 ? "result" : "results"}
              </p>
              <ul className="divide-y divide-brand-line">
                {results.slice(0, MAX_RESULTS).map((p) => {
                  const v = defaultVariant(p);
                  return (
                    <li key={p.slug}>
                      <Link
                        href={`/products/${p.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-3 py-2.5 rounded-xl hover:bg-brand-cream/70 transition-colors px-1.5"
                      >
                        <span
                          className="relative w-14 h-14 shrink-0 rounded-xl overflow-hidden border border-brand-line"
                          style={{ backgroundColor: `${p.tileBg}99` }}
                        >
                          <Image src={sizeImage(p, v.size)} alt="" fill sizes="56px" className="object-cover object-top" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-display font-medium text-brand-ink text-sm truncate">{p.name}</span>
                          <span className="block text-xs text-brand-muted truncate">
                            {[p.colour, p.style].filter(Boolean).join(" · ")}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block font-display font-medium text-brand-ink text-sm">₹{p.price}</span>
                          <span className="block text-[11px] text-brand-muted line-through">₹{p.mrp}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <button
                type="button"
                onClick={() => submit(query)}
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 h-10 rounded-full bg-brand-strip text-brand-funk font-medium tracking-wide text-sm hover:bg-[#D9E6D3] transition-colors"
              >
                View all results for “{trimmed}”
                <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
