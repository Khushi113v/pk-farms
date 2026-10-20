export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  image: string;
  categoryBg: string;
  categoryText: string;
  author: string;
  content: ContentBlock[];
  productName?: string;
  productHref?: string;
  productImage?: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-to-spot-pure-bilona-ghee",
    title: "How to spot pure bilona ghee",
    excerpt:
      "Aroma, grain and colour: simple checks that tell you whether your ghee is the real thing.",
    category: "Buying Guide",
    readTime: "4 min read",
    date: "Sep 20, 2026",
    image: "/images/blog/ghee-guide.svg",
    categoryBg: "bg-[#F5EBD9]",
    categoryText: "text-[#7A5A1E]",
    author: "PK Farms",
    productName: "Pahadi Badri Cow Ghee",
    productHref: "/products/pahadi-badri-cow-ghee",
    productImage: "/images/products/ghee-badri-cow.svg",
    content: [
      {
        type: "p",
        text: "Real bilona ghee is made by setting curd, churning it into butter and slowly simmering that butter. The process takes time, and you can taste and smell it in the finished ghee.",
      },
      {
        type: "h",
        text: "What to look for",
      },
      {
        type: "list",
        items: [
          "A rich, nutty aroma that fills the room when you open the jar",
          "A grainy, slightly granular texture at room temperature",
          "A golden colour that is natural, not bright yellow",
          "A clean, slightly sweet taste with no oily aftertaste",
        ],
      },
      {
        type: "h",
        text: "Why texture changes",
      },
      {
        type: "p",
        text: "Pure ghee turns grainy in cool weather and melts in warm weather. Both are normal. What matters is the aroma, the taste and where the ghee comes from.",
      },
    ],
  },
  {
    slug: "raw-honey-vs-regular-honey",
    title: "Raw honey vs regular honey: what is the difference?",
    excerpt:
      "Why raw honey crystallises, what to check on the label and how to store it at home.",
    category: "Honey",
    readTime: "5 min read",
    date: "Sep 12, 2026",
    image: "/images/blog/honey-guide.svg",
    categoryBg: "bg-[#EEF3E6]",
    categoryText: "text-[#0B5B36]",
    author: "PK Farms",
    productName: "Multiflora Himalayan Honey",
    productHref: "/products/multiflora-himalayan-honey",
    productImage: "/images/products/honey-multiflora.svg",
    content: [
      {
        type: "p",
        text: "Raw honey is taken straight from the comb, lightly strained and bottled without heating. Regular honey is often heated and filtered so it stays liquid on the shelf, which also removes some of its natural character.",
      },
      {
        type: "h",
        text: "Crystallisation is a good sign",
      },
      {
        type: "p",
        text: "Raw honey thickens and crystallises over time. To make it liquid again, place the closed jar in a bowl of warm water for a few minutes. Do not use a microwave or boiling water.",
      },
      {
        type: "h",
        text: "Storing it at home",
      },
      {
        type: "list",
        items: [
          "Keep it at room temperature, away from direct sunlight",
          "Always use a clean, dry spoon",
          "Close the lid tightly after every use",
        ],
      },
    ],
  },
  {
    slug: "lakadong-turmeric-and-golden-milk",
    title: "Lakadong turmeric and the perfect golden milk",
    excerpt:
      "Why Lakadong turmeric is special, and a simple golden milk recipe to try tonight.",
    category: "Recipes",
    readTime: "3 min read",
    date: "Aug 30, 2026",
    image: "/images/blog/masala-guide.svg",
    categoryBg: "bg-[#E7F0E4]",
    categoryText: "text-[#08472A]",
    author: "PK Farms",
    productName: "Lakadong Turmeric Powder",
    productHref: "/products/lakadong-turmeric-powder",
    productImage: "/images/products/masala-turmeric.svg",
    content: [
      {
        type: "p",
        text: "Lakadong turmeric grows in the hills of Meghalaya and is known for its deep colour and high curcumin content. A little goes a long way, in the kitchen and in a warm cup of milk.",
      },
      {
        type: "h",
        text: "Golden milk in five minutes",
      },
      {
        type: "list",
        items: [
          "Warm one cup of milk on low heat",
          "Add half a teaspoon of Lakadong turmeric and a pinch of black pepper",
          "Stir in a teaspoon of PK Farms ghee",
          "Simmer for two minutes and sweeten with a spoon of honey once it cools slightly",
        ],
      },
    ],
  },
  {
    slug: "from-the-himalayan-farm-to-your-kitchen",
    title: "From the Himalayan farm to your kitchen",
    excerpt:
      "How we source ghee, honey and masalas directly from farmers and small producers in the hills.",
    category: "Our Story",
    readTime: "4 min read",
    date: "Aug 18, 2026",
    image: "/images/blog/farm-story.svg",
    categoryBg: "bg-[#F5EBD9]",
    categoryText: "text-[#7A5A1E]",
    author: "PK Farms",
    productName: "Pahadi Pantry Combo",
    productHref: "/products/pahadi-pantry-combo",
    productImage: "/images/products/combo-pahadi.svg",
    content: [
      {
        type: "p",
        text: "Every product at PK Farms starts with a person: a farmer who looks after the cows, a beekeeper who knows the valley, or a family that grinds spices the way they always have.",
      },
      {
        type: "h",
        text: "Direct sourcing",
      },
      {
        type: "p",
        text: "We buy directly from producers, so they earn a fair price and we know exactly where each batch comes from. That is how we keep the quality high and the story honest.",
      },
      {
        type: "h",
        text: "Packed to stay fresh",
      },
      {
        type: "p",
        text: "Ghee goes into glass jars and tins, honey into sealed jars and spices into resealable pouches, so every pack reaches you the way it left the farm.",
      },
    ],
  },
];

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
