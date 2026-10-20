import type { Metadata } from "next";
import Breadcrumb from "@/components/common/Breadcrumb";
import FAQSection from "@/components/home/FAQSection";
import { FAQS, GHEE_FAQS, HONEY_FAQS, MASALA_FAQS } from "@/lib/product-faqs";

export const metadata: Metadata = {
  title: "FAQs — PK Farms",
  description: "Answers about ghee, honey, masalas, delivery and returns at PK Farms.",
};

// Home questions first, then the product questions without repeats
const ALL = [...FAQS, ...GHEE_FAQS, ...HONEY_FAQS, ...MASALA_FAQS].filter(
  (item, i, list) => list.findIndex((x) => x.q === item.q) === i
);

export default function FaqPage() {
  return (
    <>
      <Breadcrumb title="FAQs" items={[{ label: "FAQs" }]} />
      <FAQSection items={ALL} />
    </>
  );
}
