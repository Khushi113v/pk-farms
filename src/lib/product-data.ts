export const CATEGORIES = ["Ghee", "Honey", "Oils", "Spices"] as const;
export type Category = (typeof CATEGORIES)[number];

// Packaging types
export const STYLES = ["Glass Jar", "Bottle"] as const;
export type Style = (typeof STYLES)[number];

// Curated collections shown in the header Shop menu and on /shop?collection=…
export const COLLECTIONS = [
  { slug: "best-sellers", label: "Best Sellers" },
  { slug: "new-arrivals", label: "New Arrivals" },
] as const;
export type Collection = (typeof COLLECTIONS)[number]["slug"];

// Picks the Storage & Use guidance on the product page
export type CareKind = "ghee" | "honey" | "oil" | "spices";

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
  collections?: Collection[];
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
    images: [IMG(file)],
    sizes,
    price: def.price,
    mrp: def.mrp,
    ...rest,
  };
}

const row = (label: string, value: string) => ({ label, value });
// Every product is sold as Pack of 1 or Pack of 2 (two units, with a small saving).
const PACK_OF_2_SAVING = 0.05;
const packRows = (price: number, mrp: number): [string, number, number][] => [
  ["Pack of 1", price, mrp],
  ["Pack of 2", Math.round(price * 2 * (1 - PACK_OF_2_SAVING)), mrp * 2],
];

const specs = (o: { source: string; type: string; ingredients: string; shelf: string; packaging: string; net: string }) => [
  row("Type", o.type),
  row("Net quantity", `${o.net} per unit`),
  row("Sourced from", o.source),
  row("Ingredients", o.ingredients),
  row("Shelf life", o.shelf),
  row("Packaging", o.packaging),
  row("Discount", SPEC_DISCOUNT),
];

const BASE_PRODUCTS: Product[] = [
  product({
    slug: "pure-desi-cow-ghee",
    name: "Pure Desi Cow Ghee",
    hint: "A2 cow milk, traditional bilona process",
    description:
      "Made from the A2 milk of grass-fed desi cows and churned the traditional bilona way. Rich aroma, a natural grainy texture and a golden colour, with nothing added.",
    file: "ghee.png",
    category: "Ghee",
    style: "Glass Jar",
    care: "ghee",
    rows: packRows(1199, 1399),
    defaultPack: "Pack of 1",
    collections: ["best-sellers"],
    rating: 4.9,
    reviewCount: 1240,
    tileBg: "#FBF1D7",
    includes: "1 glass jar of ghee",
    benefits: ["Traditional bilona process", "A2 cow milk source", "100% natural, no preservatives"],
    specifications: specs({ source: "Grass-fed desi cows", type: "A2 desi cow ghee", ingredients: "100% A2 cow milk butter", shelf: "9 months", packaging: "Glass jar", net: "500 g" }),
  }),
  product({
    slug: "raw-honey",
    name: "Raw Honey",
    hint: "Pure wild honey, unprocessed",
    description:
      "Pure wild honey collected from natural forests and bottled raw. Never heated and never blended with sugar syrup, so the natural flavour and goodness stay intact.",
    file: "honey.png",
    category: "Honey",
    style: "Glass Jar",
    care: "honey",
    rows: packRows(649, 749),
    defaultPack: "Pack of 1",
    collections: ["best-sellers"],
    rating: 4.8,
    reviewCount: 934,
    tileBg: "#FBEFD8",
    includes: "1 glass jar of honey",
    benefits: ["Pure wild honey", "Raw and unprocessed", "100% natural, no preservatives"],
    specifications: specs({ source: "Natural forest beehives", type: "Raw wild honey", ingredients: "100% honey", shelf: "24 months", packaging: "Glass jar", net: "500 g" }),
  }),
  product({
    slug: "wood-pressed-groundnut-oil",
    name: "Wood Pressed Groundnut Oil",
    hint: "Wooden cold pressed, pure & natural",
    description:
      "Extracted slowly in a traditional wooden press from select groundnuts. Cold pressed and unrefined, it keeps the natural nutty aroma and is ideal for everyday Indian cooking.",
    file: "oils.png",
    category: "Oils",
    style: "Bottle",
    care: "oil",
    rows: packRows(399, 449),
    defaultPack: "Pack of 1",
    collections: ["new-arrivals", "best-sellers"],
    rating: 4.8,
    reviewCount: 612,
    tileBg: "#FBF3D6",
    includes: "1 bottle of oil",
    benefits: ["Wooden cold pressed", "Unrefined, natural aroma", "100% natural, no preservatives"],
    specifications: specs({ source: "Select groundnuts", type: "Cold pressed groundnut oil", ingredients: "100% groundnut", shelf: "9 months", packaging: "Bottle", net: "1 L" }),
  }),
  product({
    slug: "heeng-compounded-asafoetida",
    name: "Heeng",
    hint: "Compounded asafoetida, pure & aromatic",
    description:
      "Strong, aromatic heeng that brings depth to dal, sabzi and tadka. A small pinch is all you need. Packed in a glass jar with a gold lid to keep the aroma locked in.",
    file: "spices.png",
    category: "Spices",
    style: "Glass Jar",
    care: "spices",
    rows: packRows(249, 299),
    defaultPack: "Pack of 1",
    collections: ["new-arrivals"],
    rating: 4.7,
    reviewCount: 404,
    tileBg: "#F8EFDB",
    includes: "1 glass jar of heeng",
    benefits: ["Strong, pure aroma", "A pinch is enough", "100% natural, no preservatives"],
    specifications: specs({ source: "Selected asafoetida resin", type: "Compounded asafoetida", ingredients: "Asafoetida, edible starch, edible gum", shelf: "12 months", packaging: "Glass jar", net: "50 g" }),
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
