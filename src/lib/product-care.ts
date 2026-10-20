import type { CareKind } from "@/lib/product-data";

// Icons reuse the shared set: wash = clean handling, dry = keep dry / cool, iron = use, store = storage
export type CareStep = { icon: "wash" | "dry" | "iron" | "store"; title: string; text: string };

// Storage & use instructions for each kind of product
export const CARE: Record<CareKind, CareStep[]> = {
  ghee: [
    { icon: "wash", title: "Use a dry spoon", text: "Always scoop with a clean, dry spoon. Even a drop of water can spoil the ghee." },
    { icon: "dry", title: "Keep it cool", text: "Store at room temperature, away from direct sunlight and heat. Refrigeration is not required." },
    { icon: "iron", title: "Natural texture", text: "Ghee turns grainy or liquid with the weather. This is normal and a sign that it is pure." },
    { icon: "store", title: "Close the lid tightly", text: "Keep the lid tightly closed after every use. Best consumed within 3 months of opening." },
  ],
  honey: [
    { icon: "wash", title: "Use a dry spoon", text: "Use a clean, dry spoon every time to keep moisture out of the jar." },
    { icon: "dry", title: "Store at room temperature", text: "Keep away from direct sunlight. Do not refrigerate, as it speeds up crystallisation." },
    { icon: "iron", title: "Crystals are normal", text: "Raw honey crystallises naturally. Place the jar in warm water to turn it liquid again." },
    { icon: "store", title: "Seal after use", text: "Close the lid tightly. Do not heat above 40°C to keep its natural goodness." },
  ],
  masala: [
    { icon: "wash", title: "Keep it dry", text: "Use a dry spoon and never add spices straight from a steaming pan to the pouch." },
    { icon: "dry", title: "Away from light", text: "Store in a cool, dark place. Sunlight fades colour and aroma." },
    { icon: "iron", title: "Use a little at a time", text: "Whole-spice powders are strong. Start small and adjust to taste." },
    { icon: "store", title: "Reseal the pouch", text: "Press out the air and seal the pouch, or move the spice to an airtight jar." },
  ],
  combo: [
    { icon: "wash", title: "Handle with care", text: "Keep the jars upright and store in the gift box until you are ready to use them." },
    { icon: "dry", title: "Cool and dry place", text: "Store ghee, honey and spices away from direct sunlight and moisture." },
    { icon: "iron", title: "Use dry spoons", text: "Always use a clean, dry spoon for ghee and honey." },
    { icon: "store", title: "Seal after use", text: "Close every lid and pouch tightly after use." },
  ],
};

export const SHIPPING_ROWS: { label: string; value: string }[] = [
  { label: "Processing time", value: "24–48 hours" },
  { label: "Delivery time", value: "3–7 business days, depending on your location" },
  { label: "Shipping charges", value: "Free on orders above ₹999. A flat fee applies below this, shown at checkout." },
  { label: "Order tracking", value: "A tracking link is sent by email and SMS once your order ships" },
  { label: "Damaged in transit", value: "Write to us within 48 hours of delivery with a photo and we will replace it" },
  { label: "Returns", value: "Food items cannot be returned once opened. Unopened packs can be returned within 7 days." },
  { label: "Refunds", value: "Processed in 5–7 business days to the original payment method" },
];
