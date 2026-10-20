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
  oil: [
    { icon: "wash", title: "Keep the cap closed", text: "Close the cap tightly after every use to keep air and moisture out." },
    { icon: "dry", title: "Cool, dark place", text: "Store away from direct sunlight and the heat of the stove." },
    { icon: "iron", title: "Natural sediment", text: "Unrefined oil can show slight sediment at the bottom. This is natural; shake gently before use." },
    { icon: "store", title: "Best within 3 months of opening", text: "For the freshest taste and aroma, use within 3 months of opening." },
  ],
  spices: [
    { icon: "wash", title: "Use a dry spoon", text: "Always use a clean, dry spoon. Moisture makes heeng lump and lose aroma." },
    { icon: "dry", title: "Away from heat", text: "Keep the jar away from the stove and direct sunlight." },
    { icon: "iron", title: "A pinch is enough", text: "Heeng is strong. Add a small pinch to hot ghee or oil at the start of your tadka." },
    { icon: "store", title: "Close the lid tightly", text: "Keep the lid tightly closed so the aroma stays locked in." },
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
