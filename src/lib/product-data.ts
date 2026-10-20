export const CATEGORIES = ["Ghee", "Honey", "Spices & Masala", "Combos"] as const;
export type Category = (typeof CATEGORIES)[number];

// Packaging types — the same options sit under every category
export const STYLES = ["Glass Jar", "Tin", "Pouch", "Gift Combo"] as const;
export type Style = (typeof STYLES)[number];

// Picks the Storage & Use guidance on the product page
export type CareKind = "ghee" | "honey" | "masala" | "combo";

// Placeholders in a specifications list that follow the selected pack on the product page
export const SPEC_COLOUR = "__colour__";
export const SPEC_DISCOUNT = "__discount__";

// Products here have no colour options; kept so the shared components stay unchanged
export const COLOUR_HEX: Record<string, string> = {};

// `image` / `images` are optional per-pack shots; anything left out falls back to the product's own image(s).
export type SizeOption = { label: string; price: number; mrp: number; image?: string; images?: string[] };

export type Product = {
  slug: string;
  name: string;
  hint: string;
  description: string;
  image: string;
  images: string[];
  // Products sharing a `group` are colour siblings (unused for now).
  colour?: string;
  group?: string;
  sizes?: SizeOption[]; // pack sizes
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  category: Category;
  style: Style; // packaging type
  includes?: string; // what comes in the pack
  care?: CareKind; // picks the Storage & Use instructions
  tileBg: string;
  benefits: string[];
  specifications: { label: string; value: string }[];
};

const IMG = (f: string) => `/images/products/${f}`;

const packs = (image: string, rows: [string, number, number][]): SizeOption[] =>
  rows.map(([label, price, mrp]) => ({ label, price, mrp, image }));

// Shared defaults, overridden per product below
const base = {
  tileBg: "#FBF4E8",
  rating: 4.8,
  reviewCount: 600,
  benefits: [] as string[],
  specifications: [] as { label: string; value: string }[],
};

type Input = Pick<Product, "slug" | "name" | "hint" | "description" | "category" | "style" | "care"> &
  Partial<Product> & { file: string; rows: [string, number, number][]; defaultPack: string };

function product(o: Input): Product {
  const { file, rows, defaultPack, ...rest } = o;
  const sizes = packs(IMG(file), rows);
  const def = sizes.find((s) => s.label === defaultPack) ?? sizes[0];
  return {
    ...base,
    group: o.slug,
    image: IMG(file),
    images: Array(7).fill(IMG(file)),
    sizes,
    price: def.price,
    mrp: def.mrp,
    ...rest,
  };
}

const row = (label: string, value: string) => ({ label, value });
const specs = (o: { source: string; type: string; ingredients: string; shelf: string }) => [
  row("Type", o.type),
  row("Sourced from", o.source),
  row("Ingredients", o.ingredients),
  row("Shelf life", o.shelf),
  row("Packaging", "Food-grade, sealed"),
  row("Discount", SPEC_DISCOUNT),
];

const HIGHLIGHT = "No preservatives, no added colour or flavour";

const BASE_PRODUCTS: Product[] = [
  product({
    slug: "pahadi-badri-cow-ghee",
    name: "Pahadi Badri Cow Ghee",
    hint: "Bilona-churned desi ghee from Himalayan cows",
    description:
      "Slow-churned the traditional bilona way from the curd of free-grazing Badri cows in the Garhwal hills. Rich aroma, grainy texture and a golden colour you can see and taste.",
    file: "ghee-badri-cow.svg",
    category: "Ghee",
    style: "Glass Jar",
    care: "ghee",
    rows: [["250 g", 599, 699], ["500 g", 1099, 1299], ["1 kg", 2049, 2399]],
    defaultPack: "500 g",
    rating: 4.9,
    reviewCount: 1240,
    includes: "1 glass jar of ghee",
    benefits: ["Made by the traditional bilona method", "Sourced from free-grazing Badri cows", HIGHLIGHT],
    specifications: specs({ source: "Garhwal, Uttarakhand", type: "Desi cow ghee", ingredients: "100% cow milk butter (bilona)", shelf: "9 months" }),
  }),
  product({
    slug: "a2-gir-cow-ghee-tin",
    name: "A2 Gir Cow Ghee",
    hint: "Hand-churned A2 ghee in a durable tin",
    description:
      "Made from the A2 milk of Gir cows and hand-churned in small batches. Packed in a sturdy food-grade tin that keeps the ghee fresh and travels well.",
    file: "ghee-a2-tin.svg",
    category: "Ghee",
    style: "Tin",
    care: "ghee",
    rows: [["500 g", 1199, 1399], ["1 kg", 2249, 2599], ["2 kg", 4299, 4999]],
    defaultPack: "1 kg",
    reviewCount: 862,
    tileBg: "#EAF2E3",
    includes: "1 tin of ghee",
    benefits: ["A2 milk from Gir cows", "Sturdy tin that keeps ghee fresh", HIGHLIGHT],
    specifications: specs({ source: "Gir cow farms", type: "A2 cow ghee", ingredients: "100% A2 cow milk butter", shelf: "12 months" }),
  }),
  product({
    slug: "multiflora-himalayan-honey",
    name: "Multiflora Himalayan Honey",
    hint: "Raw, unprocessed honey from high-altitude flowers",
    description:
      "Collected by local beekeepers from wild flowers across the Himalayan valleys. Raw, unheated and never blended with syrup, so you get the real taste of the mountains.",
    file: "honey-multiflora.svg",
    category: "Honey",
    style: "Glass Jar",
    care: "honey",
    rows: [["250 g", 349, 399], ["500 g", 649, 749], ["1 kg", 1199, 1399]],
    defaultPack: "500 g",
    rating: 4.8,
    reviewCount: 934,
    tileBg: "#FDEFC9",
    includes: "1 glass jar of honey",
    benefits: ["Raw and unheated", "Collected by local Himalayan beekeepers", "No sugar syrup, no added colour"],
    specifications: specs({ source: "Himachal & Uttarakhand", type: "Multiflora raw honey", ingredients: "100% honey", shelf: "24 months" }),
  }),
  product({
    slug: "wild-forest-honey",
    name: "Wild Forest Honey",
    hint: "Dark, rich honey from Himalayan forests",
    description:
      "A deep, dark honey gathered from wild forest blossoms. Bold in flavour with a hint of earthy sweetness, perfect with warm water or on its own by the spoon.",
    file: "honey-forest.svg",
    category: "Honey",
    style: "Glass Jar",
    care: "honey",
    rows: [["250 g", 399, 469], ["500 g", 749, 869], ["1 kg", 1399, 1599]],
    defaultPack: "250 g",
    rating: 4.7,
    reviewCount: 705,
    tileBg: "#F9E3B4",
    includes: "1 glass jar of honey",
    benefits: ["Dark, bold forest flavour", "Raw and unprocessed", "No sugar syrup, no added colour"],
    specifications: specs({ source: "Himalayan forests", type: "Wild forest honey", ingredients: "100% honey", shelf: "24 months" }),
  }),
  product({
    slug: "lakadong-turmeric-powder",
    name: "Lakadong Turmeric Powder",
    hint: "High-curcumin turmeric from Meghalaya",
    description:
      "Lakadong turmeric is prized for its deep colour and high curcumin content. Sun-dried, stone-ground and packed fresh for your kitchen and your golden milk.",
    file: "masala-turmeric.svg",
    category: "Spices & Masala",
    style: "Pouch",
    care: "masala",
    rows: [["100 g", 179, 219], ["200 g", 329, 399], ["500 g", 749, 899]],
    defaultPack: "200 g",
    rating: 4.8,
    reviewCount: 612,
    tileBg: "#FBEBC2",
    includes: "1 resealable pouch",
    benefits: ["8–10% curcumin content", "Sun-dried and stone-ground", "No added colour or fillers"],
    specifications: specs({ source: "Lakadong, Meghalaya", type: "Turmeric powder", ingredients: "100% Lakadong turmeric", shelf: "12 months" }),
  }),
  product({
    slug: "birds-eye-chilli-powder",
    name: "Bird's Eye Chilli Powder",
    hint: "Fiery hand-pounded Himalayan chilli",
    description:
      "Small but fierce, hand-pounded from sun-dried Himalayan bird's eye chillies. A little goes a long way in curries, chutneys and pahadi dishes.",
    file: "masala-chilli.svg",
    category: "Spices & Masala",
    style: "Pouch",
    care: "masala",
    rows: [["100 g", 199, 249], ["250 g", 449, 549]],
    defaultPack: "100 g",
    rating: 4.6,
    reviewCount: 404,
    tileBg: "#F9DDD3",
    includes: "1 resealable pouch",
    benefits: ["Hand-pounded, small batch", "Intense heat and aroma", "No added colour or fillers"],
    specifications: specs({ source: "Uttarakhand hills", type: "Chilli powder", ingredients: "100% bird's eye chilli", shelf: "12 months" }),
  }),
  product({
    slug: "pahadi-garam-masala",
    name: "Pahadi Garam Masala",
    hint: "Stone-ground whole-spice blend",
    description:
      "A warm, balanced blend of whole spices roasted and stone-ground the pahadi way. Add it at the end of cooking for a full, fragrant finish.",
    file: "masala-garam.svg",
    category: "Spices & Masala",
    style: "Pouch",
    care: "masala",
    rows: [["100 g", 229, 279], ["250 g", 519, 629]],
    defaultPack: "100 g",
    rating: 4.7,
    reviewCount: 318,
    tileBg: "#EFE3D3",
    includes: "1 resealable pouch",
    benefits: ["Roasted and stone-ground", "Balanced, aromatic blend", "No added colour or fillers"],
    specifications: specs({ source: "Himalayan villages", type: "Garam masala", ingredients: "Cumin, coriander, cardamom, cinnamon, clove, black pepper, bay leaf", shelf: "12 months" }),
  }),
  product({
    slug: "pahadi-pantry-combo",
    name: "Pahadi Pantry Combo",
    hint: "Ghee + honey + turmeric gift set",
    description:
      "A gift-ready set of our best sellers: Badri cow ghee (500 g), Multiflora honey (500 g) and Lakadong turmeric (200 g). Everything a pahadi kitchen needs, in one box.",
    file: "combo-pahadi.svg",
    category: "Combos",
    style: "Gift Combo",
    care: "combo",
    rows: [["Set of 3", 1999, 2399]],
    defaultPack: "Set of 3",
    rating: 4.9,
    reviewCount: 186,
    tileBg: "#FBF1D7",
    includes: "Ghee 500 g, honey 500 g, turmeric 200 g",
    benefits: ["Our three best sellers in one box", "Gift-ready packaging", "Save over the single-item prices"],
    specifications: [
      row("Includes", "Badri cow ghee 500 g, Multiflora honey 500 g, Lakadong turmeric 200 g"),
      row("Sourced from", "Himalayan farms"),
      row("Packaging", "Gift box"),
      row("Shelf life", "9 months"),
      row("Discount", SPEC_DISCOUNT),
    ],
  }),
];

export const PRODUCTS: Product[] = BASE_PRODUCTS;

export function getProductBySlug(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function variantLabel(colour?: string, size?: SizeOption) {
  return [colour, size?.label].filter(Boolean).join(" · ") || undefined;
}

// The size whose price matches the product's headline price is the default pack.
export function defaultSizeIndex(p: { sizes?: SizeOption[]; price: number }) {
  const i = p.sizes?.findIndex((s) => s.price === p.price) ?? -1;
  return i >= 0 ? i : 0;
}

export function defaultVariant(p: Product) {
  const size = p.sizes?.[defaultSizeIndex(p)];
  return { size, label: variantLabel(p.colour, size) };
}

// Plain (serialisable) data for one colour listing — what the detail page needs to switch colours in place.
export type ColourOption = Pick<Product, "slug" | "colour" | "image" | "images" | "sizes" | "price" | "mrp">;

const toOption = (x: Product): ColourOption => ({
  slug: x.slug,
  colour: x.colour,
  image: x.image,
  images: x.images,
  sizes: x.sizes,
  price: x.price,
  mrp: x.mrp,
});

// All colour listings of this product's group (or just the product itself when it has none).
export function colourOptions(p: Product): ColourOption[] {
  const group = p.group ? PRODUCTS.filter((x) => x.group === p.group && x.colour) : [];
  return group.length > 1 ? group.map(toOption) : [toOption(p)];
}

// Every word typed must appear somewhere in the product's searchable text.
export function searchProducts(query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  return PRODUCTS.filter((p) => {
    const hay = [p.name, p.colour, p.hint, p.category, p.style, p.description, ...(p.sizes?.map((s) => s.label) ?? [])]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

export function sizeImage(p: Pick<Product, "image">, size?: SizeOption) {
  return size?.image ?? p.image;
}

export function sizeGallery(p: Pick<Product, "image" | "images">, size?: SizeOption) {
  if (size?.images?.length) return size.images;
  if (size?.image) return p.images.map(() => size.image as string);
  return p.images;
}
