import type { Product } from "@/lib/product-data";

export type QA = { q: string; a: string };

// General questions shown on the home page and the FAQs page
export const FAQS: QA[] = [
  {
    q: "What is PK Farms?",
    a: "PK Farms brings pure pahadi food from the Himalayas to your kitchen: bilona ghee, raw honey and stone-ground masalas, sourced directly from farmers and small producers.",
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
    q: "Are your spices free of colour and fillers?",
    a: "Yes. Our masalas are sun-dried and stone-ground in small batches, with no added colour, fillers or preservatives.",
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

export const MASALA_FAQS: QA[] = [
  {
    q: "How hot is the chilli powder?",
    a: "Bird's eye chilli is very hot. Start with a small pinch and add more to taste.",
  },
  {
    q: "How long do the spices stay fresh?",
    a: "Unopened, up to 12 months. Once opened, keep the pouch sealed or move the spice to an airtight jar and use within 6 months for the best aroma.",
  },
  {
    q: "Are the spices ground fresh?",
    a: "They are stone-ground in small batches and packed soon after, so the aroma stays strong.",
  },
];

export function productFaqs(p: Product): QA[] {
  if (p.category === "Honey") return HONEY_FAQS;
  if (p.category === "Spices & Masala") return MASALA_FAQS;
  return GHEE_FAQS;
}
