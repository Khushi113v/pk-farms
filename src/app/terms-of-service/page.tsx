import type { Metadata } from "next";
import PolicyLayout from "@/components/common/PolicyLayout";

export const metadata: Metadata = {
  title: "Terms of Service — PK Farms",
  description: "The terms and conditions governing your use of the PK Farms website and products.",
};

export default function TermsOfServicePage() {
  return (
    <PolicyLayout
      title="Terms of Service"
      updated="September 1, 2026"
      sections={[
        {
          heading: "1. Acceptance of terms",
          body: [
            "By accessing or using the PK Farms website, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, please do not use our site or services.",
          ],
        },
        {
          heading: "2. Orders & payments",
          body: [
            "All orders are subject to availability and confirmation of the order price. Prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.",
            "We reserve the right to refuse or cancel any order at our discretion, including in cases of suspected fraud or pricing errors.",
          ],
        },
        {
          heading: "3. Product information",
          body: [
            "We make every effort to show our products, packaging and pack sizes accurately. Colour and texture can look slightly different on different screens, and natural products such as honey and ghee vary slightly from batch to batch.",
          ],
        },
        {
          heading: "4. Intellectual property",
          body: [
            "All content on this website — including the PK Farms name, logo, product designs, images and text — is the property of PK Farms and may not be used without written permission.",
          ],
        },
        {
          heading: "5. Limitation of liability",
          body: [
            "We take care to pack every order well, but natural variations in colour, aroma, crystallisation and texture of honey, ghee and spices are not considered defects.",
          ],
        },
        {
          heading: "6. Governing law",
          body: [
            "These terms are governed by the laws of India. Any disputes will be subject to the exclusive jurisdiction of the courts in Haryana.",
          ],
        },
      ]}
    />
  );
}
