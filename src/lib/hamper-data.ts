import { getProductBySlug } from "@/lib/product-data";

// Hampers: combos of two products, each picked in any of its sizes, with an extra combo discount.
// Photo: /images/hampers/<slug>.png (transparent background). Until it is added, the first product's photo is used.

export type Hamper = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  items: string[]; // product slugs, in the order shown
  off: number; // extra % off on the combined price
  tag?: string;
  occasion: string; // short "perfect for" line
};

export const HAMPERS: Hamper[] = [
  {
    slug: "ghee-honey-wellness-duo",
    name: "Ghee & Honey Wellness Duo",
    tagline: "Pure Desi Cow Ghee + Raw Honey",
    description:
      "The two everyday essentials of a healthy Indian kitchen. Bilona A2 ghee for cooking and roti, and raw wild honey for warm water, tea and breakfast.",
    items: ["pure-desi-cow-ghee", "raw-honey"],
    off: 10,
    tag: "Best Seller",
    occasion: "Gifting, festivals and daily wellness",
  },
  {
    slug: "tadka-essentials-combo",
    name: "Tadka Essentials Combo",
    tagline: "Pure Desi Cow Ghee + Heeng",
    description:
      "Everything for the perfect tadka. Hot bilona ghee and a pinch of strong heeng turn simple dal and sabzi into home-style comfort food.",
    items: ["pure-desi-cow-ghee", "heeng-compounded-asafoetida"],
    off: 8,
    tag: "Popular",
    occasion: "Everyday cooking and new kitchens",
  },
  {
    slug: "pure-cooking-combo",
    name: "Pure Cooking Combo",
    tagline: "Wood Pressed Groundnut Oil + Pure Desi Cow Ghee",
    description:
      "One for frying, one for finishing. Unrefined wood pressed groundnut oil for daily cooking, and bilona ghee for roti, rice and sweets.",
    items: ["wood-pressed-groundnut-oil", "pure-desi-cow-ghee"],
    off: 10,
    tag: "Best Value",
    occasion: "Families switching to healthier cooking",
  },
  {
    slug: "everyday-kitchen-combo",
    name: "Everyday Kitchen Combo",
    tagline: "Wood Pressed Groundnut Oil + Heeng",
    description:
      "The daily duo for Indian cooking. Cold pressed groundnut oil with a jar of aromatic heeng for tadka, dal and sabzi.",
    items: ["wood-pressed-groundnut-oil", "heeng-compounded-asafoetida"],
    off: 8,
    occasion: "Daily cooking and hostel or first homes",
  },
];

export const HAMPER_IMG = (slug: string) => `/images/hampers/${slug}.png`;

export function getHamperBySlug(slug: string) {
  return HAMPERS.find((h) => h.slug === slug);
}

// Price of a hamper with the chosen size of each product (default: each product's default size)
export function hamperPrice(h: Hamper, sizeLabels?: (string | undefined)[]) {
  let unit = 0;
  let mrp = 0;
  h.items.forEach((slug, i) => {
    const p = getProductBySlug(slug);
    if (!p) return;
    const s = p.sizes?.find((x) => x.label === sizeLabels?.[i]) ?? p.sizes?.find((x) => x.price === p.price);
    unit += s?.price ?? p.price;
    mrp += s?.mrp ?? p.mrp;
  });
  const price = Math.round(unit * (1 - h.off / 100));
  return { price, mrp, save: mrp - price, offPct: Math.round(((mrp - price) / mrp) * 100) };
}

// Cart items for hampers use this slug prefix so the cart can link back to the hamper page
export const HAMPER_PREFIX = "hamper-";
export const itemHref = (slug: string) =>
  slug.startsWith(HAMPER_PREFIX) ? `/hampers/${slug.slice(HAMPER_PREFIX.length)}` : `/products/${slug}`;
