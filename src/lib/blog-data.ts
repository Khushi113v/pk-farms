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
    image: "/images/blogs/blog-ghee.png",
    categoryBg: "bg-[#F5EBD9]",
    categoryText: "text-[#7A5A1E]",
    author: "PK Farms",
    productName: "Pure Desi Cow Ghee",
    productHref: "/products/pure-desi-cow-ghee",
    productImage: "/images/products/ghee.png",
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
    image: "/images/blogs/blog-honey.png",
    categoryBg: "bg-[#EEF3E6]",
    categoryText: "text-[#0B5B36]",
    author: "PK Farms",
    productName: "Raw Honey",
    productHref: "/products/raw-honey",
    productImage: "/images/products/honey.png",
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
    slug: "how-to-use-heeng-in-everyday-cooking",
    title: "How to use heeng in everyday cooking",
    excerpt:
      "A pinch of heeng can change a whole dish. Here is how to use it without overpowering your food.",
    category: "Recipes",
    readTime: "3 min read",
    date: "Aug 30, 2026",
    image: "/images/blogs/blog-heeng.png",
    categoryBg: "bg-[#E7F0E4]",
    categoryText: "text-[#08472A]",
    author: "PK Farms",
    productName: "Heeng",
    productHref: "/products/heeng-compounded-asafoetida",
    productImage: "/images/products/spices.png",
    content: [
      {
        type: "p",
        text: "Heeng (asafoetida) is one of the strongest spices in the Indian kitchen. Used well, it adds a deep, savoury flavour to dal, sabzi and kadhi.",
      },
      {
        type: "h",
        text: "Simple rules",
      },
      {
        type: "list",
        items: [
          "Always add heeng to hot ghee or oil, never to a dry pan",
          "Start with a small pinch for a family-sized pot",
          "Add it first in the tadka, before cumin or mustard seeds",
          "Keep the jar closed tightly so the aroma stays strong",
        ],
      },
    ],
  },
  {
    slug: "why-wood-pressed-groundnut-oil",
    title: "Why choose wood pressed groundnut oil?",
    excerpt:
      "How a traditional wooden press keeps oil natural, and why it suits everyday Indian cooking.",
    category: "Buying Guide",
    readTime: "4 min read",
    date: "Aug 18, 2026",
    image: "/images/blogs/blog-oil.png",
    categoryBg: "bg-[#F5EBD9]",
    categoryText: "text-[#7A5A1E]",
    author: "PK Farms",
    productName: "Wood Pressed Groundnut Oil",
    productHref: "/products/wood-pressed-groundnut-oil",
    productImage: "/images/products/oils.png",
    content: [
      {
        type: "p",
        text: "Most refined oils are extracted with high heat and chemicals. In a wooden press, groundnuts are crushed slowly at low temperature, so the oil keeps its natural aroma, colour and nutrients.",
      },
      {
        type: "h",
        text: "What you will notice",
      },
      {
        type: "list",
        items: [
          "A rich, nutty aroma while cooking",
          "A natural golden colour",
          "Slight sediment at the bottom, which is a sign it is unrefined",
        ],
      },
      {
        type: "h",
        text: "How to store it",
      },
      {
        type: "p",
        text: "Keep the bottle tightly closed in a cool, dark place, away from the stove, and use it within three months of opening.",
      },
    ],
  },
];

export function getPostBySlug(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
