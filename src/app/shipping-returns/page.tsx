import type { Metadata } from "next";
import PolicyLayout from "@/components/common/PolicyLayout";

export const metadata: Metadata = {
  title: "Shipping & Return Policy — PK Farms",
  description: "PK Farms' shipping timelines, charges, returns, replacement and refund policy.",
};

export default function ShippingReturnsPage() {
  return (
    <PolicyLayout
      title="Shipping & Return Policy"
      updated="October 7, 2026"
      sections={[
        {
          heading: "1. Shipping timelines",
          body: [
            "Orders are typically processed within 24–48 hours and delivered within 3–7 business days depending on your location. Metro cities usually receive orders faster than remote areas.",
            "You'll receive a tracking link via email and SMS as soon as your order is shipped.",
          ],
        },
        {
          heading: "2. Shipping charges",
          body: [
            "We offer free shipping on all orders above ₹999. Orders below this amount incur a flat shipping fee, calculated at checkout.",
          ],
        },
        {
          heading: "3. Replacements",
          body: [
            "If your order arrives damaged, leaking or incorrect, you can request a replacement within 48 hours of delivery with clear photos of the packaging and product.",
            "Food products cannot be returned or exchanged once opened, for hygiene and safety. Unopened, sealed packs can be returned within 7 days of delivery.",
          ],
        },
        {
          heading: "4. Return policy",
          body: [
            "To be eligible for a return, all of the following must be true:",
            "• The return is requested within 7 days of purchase.",
            "• The price tags are intact.",
            "• The goods are not defective due to your fault (damage after delivery, such as stains, tears, burns or alterations, is not covered).",
            "• The goods are in their original packaging.",
            "• The product is unused, unworn and unwashed.",
            "• You have recorded a video of the product, clearly showing the original packaging, and share it with us.",
            "• You provide a valid reason for the return, for example a wrong item, a damaged pack or a leaking jar.",
          ],
        },
        {
          heading: "5. How to request a return",
          body: [
            "Write to hello@pkfarms.in or call +91 98765 43210 with your order ID, the reason for the return and your video.",
          ],
        },
        {
          heading: "6. Refunds",
          body: [
            "If your order arrives damaged, defective or incorrect, please contact us within 48 hours of delivery with photos, and we will arrange a replacement or a refund.",
            "Approved refunds are processed within 5–7 business days to your original payment method. For Cash on Delivery orders, refunds are issued via bank transfer or UPI. See our Refund & Cancellation Policy for more.",
          ],
        },
        {
          heading: "7. Order issues",
          body: [
            "If your order hasn't arrived within the expected window, or arrives incomplete, contact us at hello@pkfarms.in or call +91 98765 43210 and we'll resolve it quickly.",
          ],
        },
      ]}
    />
  );
}
