import type { Product } from "@/lib/product-data";

export type QA = { q: string; a: string };

// General questions shown on the home page and the FAQs page
export const FAQS: QA[] = [
  {
    q: "What is PK Farms?",
    a: "PK Farms brings pure, natural food to your kitchen: A2 desi cow ghee, raw honey, wood pressed groundnut oil and pure heeng, all 100% natural with no preservatives.",
  },
  {
    q: "Is your ghee really made the traditional way?",
    a: "Yes. Our ghee is churned the bilona way: curd is set from cow milk, churned into butter by hand and slowly simmered into ghee. No shortcuts and no additives.",
  },
  {
    q: "Is your honey raw?",
    a: "Yes. Our honey is raw and unheated, and never mixed with sugar syrup. It may crystallise over time, which is a natural sign of purity.",
  },
  {
    q: "What does wood pressed mean?",
    a: "Our groundnut oil is extracted slowly in a traditional wooden press (kachi ghani) without high heat or chemicals, so it keeps its natural aroma and nutrients.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders usually arrive in 3 to 7 working days, and shipping is free on orders above ₹999. You will get tracking details as soon as your order is dispatched.",
  },
  {
    q: "Can I return my order?",
    a: "Food items cannot be returned once opened. If your order arrives damaged or incorrect, write to us within 48 hours with a photo and we will replace it.",
  },
];

export const GHEE_FAQS: QA[] = [
  {
    q: "Why does my ghee look grainy or liquid?",
    a: "Pure ghee changes texture with temperature. It turns grainy in cooler weather and melts in warm weather. The taste and quality stay the same.",
  },
  {
    q: "Do I need to refrigerate it?",
    a: "No. Store it at room temperature in a cool, dry place with the lid closed. Always use a dry spoon.",
  },
  {
    q: "What is the shelf life?",
    a: "Unopened, our ghee stays fresh for up to 9 to 12 months. Once opened, we suggest finishing it within 3 months for the best flavour.",
  },
];

export const HONEY_FAQS: QA[] = [
  {
    q: "Why has my honey crystallised?",
    a: "Raw honey crystallises naturally. Place the closed jar in warm water for a few minutes and it will turn liquid again.",
  },
  {
    q: "Is it safe for children?",
    a: "Honey is not recommended for babies under 12 months. It is fine for older children and adults.",
  },
  {
    q: "How should I store it?",
    a: "Keep it at room temperature, away from direct sunlight, with the lid tightly closed. Do not refrigerate.",
  },
];

export const OIL_FAQS: QA[] = [
  {
    q: "Is the oil refined?",
    a: "No. It is unrefined and cold pressed in a wooden press, so it keeps its natural colour, aroma and nutrients.",
  },
  {
    q: "Why is there sediment at the bottom?",
    a: "Unrefined oil can settle slightly over time. It is natural and safe; shake the bottle gently before use.",
  },
  {
    q: "What can I cook with it?",
    a: "It is ideal for everyday Indian cooking, from tadka and sabzi to deep frying.",
  },
];

export const SPICE_FAQS: QA[] = [
  {
    q: "What is compounded heeng?",
    a: "Compounded heeng is pure asafoetida resin blended with edible starch and gum so it is easy to use in everyday cooking.",
  },
  {
    q: "How much should I use?",
    a: "Heeng is strong. A small pinch in hot ghee or oil is enough for a pot of dal or sabzi.",
  },
  {
    q: "How long does it stay fresh?",
    a: "Unopened, up to 12 months. Keep the lid tightly closed after use to retain the aroma.",
  },
];

export const HAMPER_FAQS: QA[] = [
  {
    q: "Can I choose the size of each product?",
    a: "Yes. Pick any size for each product on this page. The combo discount is applied to whatever sizes you choose.",
  },
  {
    q: "Is it good for gifting?",
    a: "Yes. Both products are packed together with care, so the hamper makes a thoughtful gift for festivals, housewarmings and family.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders usually arrive in 3 to 7 working days, and shipping is free on orders above ₹999. Both products arrive together in one parcel.",
  },
  {
    q: "What if something arrives damaged?",
    a: "Write to us within 48 hours of delivery with a photo and we will replace the damaged item.",
  },
];

export function productFaqs(p: Product): QA[] {
  if (p.category === "Honey") return HONEY_FAQS;
  if (p.category === "Oils") return OIL_FAQS;
  if (p.category === "Spices") return SPICE_FAQS;
  return GHEE_FAQS;
}
