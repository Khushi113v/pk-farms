export const FREE_SHIPPING_THRESHOLD = 999;
export const GIFT_WRAP_FEE = 99;
export const COD_FEE = 50;

// `discount` returns the amount taken off the cart subtotal when the code is applied (0 = no price change).
export type Offer = { code: string; title: string; desc: string; discount: (subtotal: number) => number };

export const OFFERS: Offer[] = [
  {
    code: "WELCOME10",
    title: "Flat 10% off on your first order",
    desc: "Valid on all products for new customers. Applies at checkout.",
    discount: (subtotal) => Math.round(subtotal * 0.1),
  },
  {
    code: "BIRTHDAY15",
    title: "Birthday month gift: 15% off",
    desc: "A gift from us, valid all through your birthday month. Add your date of birth in My Profile.",
    discount: (subtotal) => Math.round(subtotal * 0.15),
  },
  {
    code: "ANNIVERSARY15",
    title: "Anniversary month gift: 15% off",
    desc: "A gift from us, valid all through your anniversary month. Add the date in My Profile.",
    discount: (subtotal) => Math.round(subtotal * 0.15),
  },
  {
    code: "CART5",
    title: "Extra 5% off your saved cart",
    desc: "Sent by email when you leave items in your cart. Valid on your cart total.",
    discount: (subtotal) => Math.round(subtotal * 0.05),
  },
  {
    code: "FREESHIP",
    title: "Free shipping above ₹999",
    desc: "Shipping is free automatically once your cart crosses ₹999.",
    discount: () => 0,
  },
  {
    code: "COMBO10",
    title: "Extra 10% off on “Complete your order” picks",
    desc: "Add any product from the cart suggestions and the offer price is applied instantly.",
    discount: () => 0,
  },
  {
    code: "FESTIVE100",
    title: "₹100 off on orders above ₹1500",
    desc: "Valid when your cart total is ₹1500 or more.",
    discount: (subtotal) => (subtotal >= 1500 ? 100 : 0),
  },
];

export function findOffer(code: string) {
  const c = code.trim().toUpperCase();
  return OFFERS.find((o) => o.code === c);
}
