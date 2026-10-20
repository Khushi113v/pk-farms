import type { Metadata } from "next";
import PolicyLayout from "@/components/common/PolicyLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — PK Farms",
  description: "How PK Farms collects, uses and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      title="Privacy Policy"
      updated="September 1, 2026"
      sections={[
        {
          heading: "1. Information we collect",
          body: [
            "When you shop with PK Farms, create an account, or contact our support team, we collect information such as your name, email address, phone number, shipping address and order history.",
            "We also automatically collect certain technical information — like browser type, device information and pages visited — to help us improve the site experience.",
          ],
        },
        {
          heading: "2. How we use your information",
          body: [
            "We use your information to process orders, provide customer support, personalise product recommendations, and send updates about your order status.",
            "With your consent, we may also send newsletters, offers and product launches. You can unsubscribe at any time from any marketing email.",
          ],
        },
        {
          heading: "3. Sharing your information",
          body: [
            "We never sell your personal data. We share information only with trusted partners who help us operate — such as payment processors, shipping providers and analytics tools — and only to the extent needed to provide our services.",
          ],
        },
        {
          heading: "4. Data security",
          body: [
            "We use industry-standard encryption and security practices to protect your data. Payment details are processed through secure, PCI-compliant gateways and are never stored on our servers.",
          ],
        },
        {
          heading: "5. Your rights",
          body: [
            "You can request access to, correction of, or deletion of your personal data at any time by writing to hello@pkfarms.in. We will respond within a reasonable timeframe.",
          ],
        },
        {
          heading: "6. Changes to this policy",
          body: [
            "We may update this policy from time to time. Significant changes will be communicated via email or a notice on our website.",
          ],
        },
      ]}
    />
  );
}
