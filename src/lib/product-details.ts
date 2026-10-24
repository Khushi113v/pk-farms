import type { CareKind } from "@/lib/product-data";

// Content for the product page sections below the buy box, one set per kind of product.
// Images that are not added yet fall back to an existing photo (see `fallback`), so the page
// always looks complete. Drop a file at the `image` path and it shows automatically.

export type NutritionRow = { label: string; value: string; sub?: boolean };
export type UseStep = { title: string; text: string };
export type LabTest = { name: string; detail: string };

// What each quality check looks at
const TEST: Record<string, string> = {
  Purity: "Confirms the product is what it says it is, with nothing mixed in.",
  Adulteration: "Checks for cheaper oils, fats, starch or other fillers.",
  "Sugar syrup": "Checks that no rice, corn or cane sugar syrup has been added.",
  Moisture: "Low moisture keeps it fresh for longer and stops spoilage.",
  "Free fatty acids": "Shows freshness. Low levels mean the ghee has not turned rancid.",
  "Acid value": "Shows freshness. A low value means the oil is fresh and well pressed.",
  HMF: "Shows the honey has not been heated or stored too long.",
  "Heavy metals": "Checks for lead, arsenic and other harmful metals.",
};
const tests = (...names: string[]): LabTest[] => names.map((name) => ({ name, detail: TEST[name] }));
export type Benefit = { tag: string; title: string; text: string; image: string; fallback: string };

type Details = {
  short: string; // e.g. "ghee", used in headings like "People love our ghee"
  nutrition: NutritionRow[]; // typical values per 100 g
  uses: UseStep[];
  labTests: LabTest[];
  benefits: Benefit[];
};

// Benefit photos are shared between products where the scene fits more than one
const B = (name: string) => `/images/benefits/${name}.png`;

export const DETAILS: Record<CareKind, Details> = {
  ghee: {
    short: "ghee",
    nutrition: [
      { label: "Energy", value: "897 kcal" },
      { label: "Total fat", value: "99.7 g" },
      { label: "Saturated fat", value: "62 g", sub: true },
      { label: "Monounsaturated fat", value: "29 g", sub: true },
      { label: "Polyunsaturated fat", value: "4 g", sub: true },
      { label: "Trans fat", value: "< 1 g", sub: true },
      { label: "Cholesterol", value: "256 mg" },
      { label: "Carbohydrate", value: "0 g" },
      { label: "Protein", value: "0 g" },
      { label: "Added sugar", value: "0 g" },
    ],
    uses: [
      { title: "Tadka & cooking", text: "Heat a spoon of ghee for tadka, sabzi and dal. Its high smoke point makes it great for frying too." },
      { title: "On roti & rice", text: "Spread on hot roti or paratha, or add a spoon to hot rice and khichdi." },
      { title: "Sweets & halwa", text: "Use for laddoo, halwa and kheer for a rich, traditional taste." },
      { title: "A spoon a day", text: "Many families take a spoon with warm milk or on an empty stomach, as an old daily habit." },
    ],
    labTests: tests("Purity", "Adulteration", "Moisture", "Free fatty acids", "Heavy metals"),
    benefits: [
      {
        tag: "Good fats",
        title: "Steady energy for the whole day.",
        text: "Ghee is a rich source of natural fats that give slow, steady energy, which is why it has been part of the Indian plate for generations.",
        image: B("family-breakfast"),
        fallback: "/images/why-choose/why-traditional.png",
      },
      {
        tag: "Easy digestion",
        title: "Gentle on the stomach.",
        text: "In Ayurveda, ghee is valued for supporting digestion. A spoon on dal or rice helps the meal feel lighter and more satisfying.",
        image: B("dal-rice"),
        fallback: "/images/blogs/blog-ghee.png",
      },
      {
        tag: "Nourishing",
        title: "Carries vitamins A, D, E and K.",
        text: "These vitamins dissolve in fat, and ghee helps the body absorb them from the food you eat alongside it.",
        image: B("golden-pour"),
        fallback: "/images/about.png",
      },
      {
        tag: "Safe cooking",
        title: "High smoke point, no burning.",
        text: "Ghee stays stable at high heat, so it does not break down and smoke the way many refined oils do when you fry or temper.",
        image: B("kadhai-tadka"),
        fallback: "/images/why-choose/why-care.png",
      },
    ],
  },
  honey: {
    short: "honey",
    nutrition: [
      { label: "Energy", value: "304 kcal" },
      { label: "Carbohydrate", value: "82.4 g" },
      { label: "Total sugars (natural)", value: "82 g", sub: true },
      { label: "Added sugar", value: "0 g", sub: true },
      { label: "Protein", value: "0.3 g" },
      { label: "Total fat", value: "0 g" },
      { label: "Sodium", value: "4 mg" },
    ],
    uses: [
      { title: "With warm water", text: "Stir a spoon into a glass of warm (not hot) water with a little lemon in the morning." },
      { title: "In place of sugar", text: "Sweeten tea, milk, smoothies and desserts with honey instead of refined sugar." },
      { title: "With breakfast", text: "Drizzle over toast, oats, pancakes, fruit or curd." },
      { title: "Never boil it", text: "Add honey once food has cooled a little. Heating above 40°C takes away its natural goodness." },
    ],
    labTests: tests("Purity", "Sugar syrup", "Moisture", "HMF", "Heavy metals"),
    benefits: [
      {
        tag: "Natural sweetness",
        title: "A better choice than sugar.",
        text: "Raw honey brings sweetness along with natural enzymes and minerals, so you can cut down on refined sugar without losing taste.",
        image: B("honey-tea"),
        fallback: "/images/why-choose/why-pure.png",
      },
      {
        tag: "Soothing",
        title: "Comfort for the throat.",
        text: "A spoon of honey in warm water or with tulsi and ginger is a time-tested home remedy for a scratchy throat.",
        image: B("warm-water"),
        fallback: "/images/blogs/blog-honey.png",
      },
      {
        tag: "Antioxidants",
        title: "Goodness that stays raw.",
        text: "Because it is never heated, our honey keeps its natural antioxidants and pollen, just as the bees made it.",
        image: B("honeycomb"),
        fallback: "/images/hero/banner-honey.png",
      },
      {
        tag: "Quick energy",
        title: "Natural fuel for busy days.",
        text: "Its natural sugars give a quick lift, making honey a handy pick-me-up before a workout or a long day.",
        image: B("family-breakfast"),
        fallback: "/images/why-choose/why-sourcing.png",
      },
    ],
  },
  oil: {
    short: "groundnut oil",
    nutrition: [
      { label: "Energy", value: "884 kcal" },
      { label: "Total fat", value: "100 g" },
      { label: "Saturated fat", value: "17 g", sub: true },
      { label: "Monounsaturated fat", value: "46 g", sub: true },
      { label: "Polyunsaturated fat", value: "32 g", sub: true },
      { label: "Trans fat", value: "0 g", sub: true },
      { label: "Cholesterol", value: "0 mg" },
      { label: "Vitamin E", value: "15.7 mg" },
      { label: "Carbohydrate", value: "0 g" },
      { label: "Protein", value: "0 g" },
    ],
    uses: [
      { title: "Everyday cooking", text: "Use for sabzi, dal tadka, curries and stir-fries, just like any cooking oil." },
      { title: "Deep frying", text: "Its high smoke point makes it ideal for pakoras, puris and other fried snacks." },
      { title: "Pickles & chutneys", text: "Its nutty aroma is perfect for homemade achaar and chutneys." },
      { title: "Shake before use", text: "Being unrefined, a little natural sediment may settle. Shake gently before pouring." },
    ],
    labTests: tests("Purity", "Adulteration", "Acid value", "Heavy metals"),
    benefits: [
      {
        tag: "Heart friendly",
        title: "Rich in good fats.",
        text: "Groundnut oil is high in monounsaturated and polyunsaturated fats, the kind of fats recommended for a balanced, heart-friendly diet.",
        image: B("groundnuts"),
        fallback: "/images/peanut-background.png",
      },
      {
        tag: "Vitamin E",
        title: "A natural source of vitamin E.",
        text: "Wood pressing keeps the oil's natural vitamin E, an antioxidant that refining and high heat usually strip away.",
        image: B("golden-pour"),
        fallback: "/images/blogs/blog-oil.png",
      },
      {
        tag: "No chemicals",
        title: "Pressed slowly, never refined.",
        text: "No hexane, no bleaching, no deodorising. Just groundnuts pressed in a wooden ghani, so the oil stays as nature made it.",
        image: B("wooden-ghani"),
        fallback: "/images/hero/banner-oil.png",
      },
      {
        tag: "High heat",
        title: "Made for Indian cooking.",
        text: "A high smoke point means it stays stable for tadka and frying, without burning or giving off harsh smoke.",
        image: B("kadhai-tadka"),
        fallback: "/images/why-choose/why-traditional.png",
      },
    ],
  },
  spices: {
    short: "heeng",
    nutrition: [
      { label: "Energy", value: "330 kcal" },
      { label: "Carbohydrate", value: "68 g" },
      { label: "Dietary fibre", value: "4 g", sub: true },
      { label: "Protein", value: "4 g" },
      { label: "Total fat", value: "1 g" },
      { label: "Sodium", value: "25 mg" },
    ],
    uses: [
      { title: "In your tadka", text: "Add a small pinch to hot ghee or oil before the jeera and other spices." },
      { title: "Dal & sabzi", text: "A pinch makes dal, chhole, rajma and potato sabzi lighter and more aromatic." },
      { title: "Instead of onion & garlic", text: "Heeng adds a deep savoury flavour to food cooked without onion and garlic." },
      { title: "Go easy", text: "It is strong. Start with a very small pinch for a family-size pot." },
    ],
    labTests: tests("Purity", "Adulteration", "Moisture", "Heavy metals"),
    benefits: [
      {
        tag: "Digestion",
        title: "Lighter meals, less bloating.",
        text: "Heeng has been used in Indian kitchens for centuries to make lentils and beans easier to digest.",
        image: B("dal-rice"),
        fallback: "/images/blogs/blog-heeng.png",
      },
      {
        tag: "Flavour",
        title: "Big flavour from a tiny pinch.",
        text: "Its strong aroma turns mellow and savoury in hot oil, giving everyday food a deep, rich taste.",
        image: B("kadhai-tadka"),
        fallback: "/images/hero/banner-heeng.png",
      },
      {
        tag: "Tradition",
        title: "A trusted home remedy.",
        text: "Grandmothers have long reached for heeng for an upset stomach. A pinch in warm water is an old family habit.",
        image: B("warm-water"),
        fallback: "/images/why-choose/why-care.png",
      },
    ],
  },
};

// "Why choose us" on the product page: illustrated emblems in /images/why-us/
export type WhyUsItem = { title: string; text: string; image: string; fallback: string };
export const WHY_US: WhyUsItem[] = [
  {
    title: "Pure & Natural",
    text: "No preservatives, no added colour, no fillers. Just what nature made.",
    image: "/images/why-us/pure.png",
    fallback: "/images/why-choose/why-pure.png",
  },
  {
    title: "Traditional Methods",
    text: "Bilona ghee and wood pressed oil, made slowly the way our elders did.",
    image: "/images/why-us/traditional.png",
    fallback: "/images/why-choose/why-traditional.png",
  },
  {
    title: "Straight from Farms",
    text: "Sourced directly from farmers and beekeepers in the hills we know.",
    image: "/images/why-us/farm.png",
    fallback: "/images/why-choose/why-sourcing.png",
  },
  {
    title: "Lab Tested",
    text: "Every batch is checked for purity before it is packed for you.",
    image: "/images/why-us/lab-tested.png",
    fallback: "/images/why-choose/why-care.png",
  },
];
