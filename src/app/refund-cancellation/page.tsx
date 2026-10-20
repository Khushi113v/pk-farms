import type { Metadata } from "next";
import PolicyLayout from "@/components/common/PolicyLayout";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — PK Farms",
  description: "How to cancel an order at PK Farms, and when and how refunds are issued.",
};

export default function RefundCancellationPage() {
  return (
    <PolicyLayout
      title="Refund & Cancellation Policy"
      updated="October 1, 2026"
      sections={[
        {
          heading: "1. Cancelling an order",
          body: [
            "You can cancel an order before it is shipped. Go to My Orders, open the order and choose cancel, or write to us at hello@pkfarms.in with your order ID.",
            "Once an order has been shipped it cannot be cancelled. You can still request a replacement if it arrives damaged, as described in our Shipping & Return Policy.",
          ],
        },
        {
          heading: "2. Cancellation after dispatch",
          body: [
            "Orders can be cancelled until they are dispatched. Once an order has shipped, it can no longer be cancelled, but you can still request help if it arrives damaged or incorrect.",
          ],
        },
        {
          heading: "3. When you are eligible for a refund",
          body: [
            "A full refund is issued if you cancel before dispatch, if your order arrives damaged, defective or incorrect, or if we are unable to fulfil it.",
            "For damaged, defective or incorrect items, please contact us within 48 hours of delivery with clear photos of the product and the packaging.",
          ],
        },
        {
          heading: "4. Items that are not refundable",
          body: [
            "Food products that have been opened or used, items without their original sealed packaging, and orders reported after 48 hours of delivery cannot be refunded.",
          ],
        },
        {
          heading: "5. How and when refunds are paid",
          body: [
            "Approved refunds are processed within 5–7 business days, to the original payment method. Your bank may take a few more days to show the amount.",
            "For Cash on Delivery orders, the refund is sent by bank transfer or UPI. We will ask you for the details when your refund is approved.",
            "Discount codes used on the order, including birthday and anniversary gifts, are not reissued after a cancellation unless the order is cancelled before dispatch.",
          ],
        },
        {
          heading: "6. Replacement instead of a refund",
          body: [
            "If your order arrives damaged, leaking or incorrect, write to us within 48 hours of delivery with photos. We will send a replacement or refund the amount.",
          ],
        },
        {
          heading: "7. Contact us",
          body: [
            "For any cancellation or refund question, write to hello@pkfarms.in or call +91 98765 43210. Please keep your order ID handy so we can help you quickly.",
          ],
        },
      ]}
    />
  );
}
