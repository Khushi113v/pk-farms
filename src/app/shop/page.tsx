"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Check, SlidersHorizontal, X } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import ProductCard from "@/components/common/ProductCard";
import BrandBackdrop, { BRAND_BACKDROP_BG } from "@/components/common/BrandBackdrop";
import { PRODUCTS, searchProducts, CATEGORIES, STYLES, COLOUR_HEX, type Category, type Style, type Product } from "@/lib/product-data";

// Every colour a product comes in
const COLOURS = Array.from(new Set(PRODUCTS.map((p) => p.colour).filter((c): c is string => !!c)));

// The colour options of one card (a product and its colour siblings)
const colourVariants = (p: Product) => (p.group ? PRODUCTS.filter((x) => x.group === p.group) : [p]);

// URL values used by the header / footer menus
const CATEGORY_PARAM: Record<string, Category> = {
  ghee: "Ghee",
  honey: "Honey",
  spices: "Spices & Masala",
  combos: "Combos",
};
const STYLE_PARAM: Record<string, Style> = {
  jar: "Glass Jar",
  tin: "Tin",
  pouch: "Pouch",
  combo: "Gift Combo",
};

const MAX_PRICE = Math.max(...PRODUCTS.map((p) => p.price));

function FilterPanel({
  selectedCategories,
  toggleCategory,
  selectedStyles,
  toggleStyle,
  selectedColours,
  toggleColour,
  maxPrice,
  setMaxPrice,
  onClear,
}: {
  selectedCategories: Category[];
  toggleCategory: (c: Category) => void;
  selectedStyles: Style[];
  toggleStyle: (s: Style) => void;
  selectedColours: string[];
  toggleColour: (c: string) => void;
  maxPrice: number;
  setMaxPrice: (n: number) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-medium text-brand-ink text-base">Filters</h3>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-semibold text-brand-funk hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
          Category
        </p>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map((a) => (
            <label key={a} className="flex items-center gap-2.5 cursor-pointer group">
              <span
                className={`shrink-0 grid place-items-center w-[18px] h-[18px] rounded-md border-2 transition-colors ${ selectedCategories.includes(a) ? "bg-brand-funk border-brand-funk" : "border-brand-line group-hover:border-brand-funk/50" }`}
              >
                {selectedCategories.includes(a) && (
                  <Check size={12} strokeWidth={3} className="text-white" />
                )}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedCategories.includes(a)}
                onChange={() => toggleCategory(a)}
              />
              <span className="text-sm text-brand-ink">{a}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Style */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
          Packaging
        </p>
        <div className="flex flex-col gap-2.5">
          {STYLES.map((c) => (
            <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
              <span
                className={`shrink-0 grid place-items-center w-[18px] h-[18px] rounded-md border-2 transition-colors ${ selectedStyles.includes(c) ? "bg-brand-funk border-brand-funk" : "border-brand-line group-hover:border-brand-funk/50" }`}
              >
                {selectedStyles.includes(c) && (
                  <Check size={12} strokeWidth={3} className="text-white" />
                )}
              </span>
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedStyles.includes(c)}
                onChange={() => toggleStyle(c)}
              />
              <span className="text-sm text-brand-ink">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colour — only shown when products come in colours */}
      {COLOURS.length > 0 && (
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
          Colour
        </p>
        <div className="flex flex-wrap gap-2">
          {COLOURS.map((c) => {
            const on = selectedColours.includes(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => toggleColour(c)}
                className={`inline-flex items-center gap-2 h-8 pl-1.5 pr-3 rounded-full border text-xs transition-colors ${
                  on
                    ? "border-brand-funk bg-brand-strip text-brand-funk"
                    : "border-brand-line text-brand-ink hover:border-brand-funk/40"
                }`}
              >
                <span
                  aria-hidden
                  className="w-5 h-5 rounded-full border border-black/10"
                  style={{ backgroundColor: COLOUR_HEX[c] ?? "#ddd" }}
                />
                {c}
              </button>
            );
          })}
        </div>
      </div>
      )}

      {/* Price */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-muted mb-3">
          Max price
        </p>
        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          step={50}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-brand-funk"
        />
        <p className="mt-1 text-sm font-semibold text-brand-ink">Up to ₹{maxPrice}</p>
      </div>
    </div>
  );
}

function SearchChip({ query }: { query: string }) {
  return (
    <span className="inline-flex items-center gap-2 bg-brand-strip border border-brand-funk/30 rounded-full pl-3.5 pr-1.5 py-1.5 text-sm font-semibold text-brand-funk">
      Results for “{query}”
      <Link
        href="/shop"
        aria-label="Clear search"
        className="grid place-items-center w-6 h-6 rounded-full bg-white text-brand-funk hover:bg-brand-funk hover:text-white transition-colors"
      >
        <X size={13} strokeWidth={3} />
      </Link>
    </span>
  );
}

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") ?? "";
  const styleParam = searchParams.get("style") ?? "";
  const query = (searchParams.get("q") ?? "").trim();

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<Style[]>([]);
  const [selectedColours, setSelectedColours] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Menu links change the URL without remounting — keep the filters in step with it
  useEffect(() => {
    setSelectedCategories(CATEGORY_PARAM[categoryParam] ? [CATEGORY_PARAM[categoryParam]] : []);
    setSelectedStyles(STYLE_PARAM[styleParam] ? [STYLE_PARAM[styleParam]] : []);
  }, [categoryParam, styleParam]);

  const toggleCategory = (c: Category) =>
    setSelectedCategories((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  const toggleColour = (c: string) =>
    setSelectedColours((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  const toggleStyle = (c: Style) =>
    setSelectedStyles((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedStyles([]);
    setSelectedColours([]);
    setMaxPrice(MAX_PRICE);
  };

  const filtered = useMemo(() => {
    const matches = query ? searchProducts(query) : PRODUCTS;
    // One card per product — its colour options live inside the card
    const unique = matches.filter((p, i) => !p.group || matches.findIndex((x) => x.group === p.group) === i);
    return unique.filter((p) => {
      if (selectedCategories.length && (!p.category || !selectedCategories.includes(p.category))) return false;
      if (selectedStyles.length && (!p.style || !selectedStyles.includes(p.style))) return false;
      if (selectedColours.length && !colourVariants(p).some((v) => v.colour && selectedColours.includes(v.colour))) return false;
      if (p.price > maxPrice) return false;
      return true;
    });
  }, [query, selectedCategories, selectedStyles, selectedColours, maxPrice]);

  const activeFilterCount =
    selectedCategories.length + selectedStyles.length + selectedColours.length + (maxPrice < MAX_PRICE ? 1 : 0);

  return (
    <>
      <Breadcrumb title="Shop All" items={[{ label: "Shop" }]} />

      <section className={`relative overflow-clip py-10 md:py-14 ${BRAND_BACKDROP_BG}`}>
        <BrandBackdrop wave={false} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Mobile filter toggle */}
          <div className="lg:hidden mb-5 flex items-center justify-between">
            <span className="inline-flex items-center gap-2 bg-white border border-brand-line rounded-full pl-1.5 pr-3 py-1.5">
              <span className="grid place-items-center w-6 h-6 rounded-full bg-brand-funk text-white text-[11px] font-bold">
                {filtered.length}
              </span>
              <span className="text-sm font-semibold text-brand-ink">Products</span>
            </span>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white border border-brand-line text-sm font-bold text-brand-ink"
            >
              <SlidersHorizontal size={15} strokeWidth={2.5} />
              Filters
              {activeFilterCount > 0 && (
                <span className="grid place-items-center w-5 h-5 rounded-full bg-brand-funk text-white text-[11px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="grid lg:grid-cols-[260px_1fr] gap-8">
            {/* Sidebar — desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 bg-white rounded-3xl border border-brand-line p-6">
                <FilterPanel
                  selectedCategories={selectedCategories}
                  toggleCategory={toggleCategory}
                  selectedStyles={selectedStyles}
                  toggleStyle={toggleStyle}
                  selectedColours={selectedColours}
                  toggleColour={toggleColour}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  onClear={clearFilters}
                />
              </div>
            </aside>

            {/* Product grid */}
            <div>
              <div className="hidden lg:flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-2 bg-white border border-brand-line rounded-full pl-1.5 pr-3 py-1.5">
                  <span className="grid place-items-center w-6 h-6 rounded-full bg-brand-funk text-white text-[11px] font-bold">
                    {filtered.length}
                  </span>
                  <span className="text-sm font-semibold text-brand-ink">Products</span>
                </span>
                {query && <SearchChip query={query} />}
              </div>
              {query && (
                <div className="lg:hidden mb-4">
                  <SearchChip query={query} />
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="bg-white rounded-3xl border border-brand-line p-12 text-center">
                  <p className="font-display font-medium text-brand-ink text-lg">
                    No products match these filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-3 text-sm font-semibold text-brand-funk hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                  {filtered.map((p) => {
                    // show the colour the shopper filtered for
                    const cardSlug =
                      (selectedColours.length &&
                        colourVariants(p).find((v) => v.colour && selectedColours.includes(v.colour))?.slug) ||
                      p.slug;
                    // re-key so the card resets to the chosen colour
                    return <ProductCard key={cardSlug} slug={cardSlug} />;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      <div
        aria-hidden
        onClick={() => setMobileFiltersOpen(false)}
        className={`lg:hidden fixed inset-0 z-40 bg-brand-ink/50 transition-opacity duration-300 ${ mobileFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none" }`}
      />
      <div
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-y-auto ${ mobileFiltersOpen ? "translate-x-0" : "translate-x-full" }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-medium text-brand-ink text-lg">Filters</h2>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
              className="w-9 h-9 grid place-items-center rounded-full hover:bg-brand-soft"
            >
              <X size={20} />
            </button>
          </div>
          <FilterPanel
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            selectedStyles={selectedStyles}
            toggleStyle={toggleStyle}
            selectedColours={selectedColours}
            toggleColour={toggleColour}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onClear={clearFilters}
          />
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(false)}
            className="mt-8 w-full h-12 rounded-full text-white font-medium tracking-wide text-sm bg-brand-funk hover:bg-brand-funkDark"
          >
            Show {filtered.length} products
          </button>
        </div>
      </div>
    </>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopContent />
    </Suspense>
  );
}
