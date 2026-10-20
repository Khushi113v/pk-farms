// Free-gift milestones: the cart total that unlocks each gift. Used by the home page section and the side cart.
export type GiftMilestone = {
  threshold: number;
  label: string;
  subLabel: string;
  image: string;
  position: string;
};

export const GIFT_MILESTONES: GiftMilestone[] = [
  { threshold: 999, label: "Pahadi Garam Masala 100 g", subLabel: "Free with your order", image: "/images/products/masala-garam.svg", position: "center center" },
  { threshold: 1999, label: "Wild Forest Honey 250 g", subLabel: "Free with your order", image: "/images/products/honey-forest.svg", position: "center center" },
  { threshold: 2999, label: "Badri Cow Ghee 250 g", subLabel: "Free with your order", image: "/images/products/ghee-badri-cow.svg", position: "center center" },
  { threshold: 4999, label: "Multiflora Honey 500 g", subLabel: "Free with your order", image: "/images/products/honey-multiflora.svg", position: "center center" },
];

// Share of the line (0-100) that is filled. The line runs from the first gift to the last,
// so progress is measured step by step: every gap is the same length on screen.
export function giftProgress(subtotal: number) {
  const last = GIFT_MILESTONES.length - 1;
  if (subtotal >= GIFT_MILESTONES[last].threshold) return 100;
  if (subtotal < GIFT_MILESTONES[0].threshold) return 0;
  const k = GIFT_MILESTONES.findIndex((m, i) => subtotal >= m.threshold && subtotal < GIFT_MILESTONES[i + 1].threshold);
  const a = GIFT_MILESTONES[k].threshold;
  const b = GIFT_MILESTONES[k + 1].threshold;
  return ((k + (subtotal - a) / (b - a)) / last) * 100;
}
