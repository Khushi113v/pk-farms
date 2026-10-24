import type { Metadata } from "next";
import { Gift, Percent, PackageCheck } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import HamperCard from "@/components/hampers/HamperCard";
import BrandBackdrop, { BRAND_BACKDROP_BG } from "@/components/common/BrandBackdrop";
import { HAMPERS } from "@/lib/hamper-data";
import { hamperImage } from "@/lib/hamper-image";

export const metadata: Metadata = {
  title: "Hampers & Combos — PK Farms",
  description: "Combos of pure ghee, raw honey, wood pressed oil and heeng at a special combo price.",
};

const PERKS = [
  { icon: Percent, text: "Extra combo discount" },
  { icon: Gift, text: "Perfect for gifting" },
  { icon: PackageCheck, text: "Packed with care" },
];

export default function HampersPage() {
  return (
    <>
      <Breadcrumb title="Hampers & Combos" items={[{ label: "Hampers" }]} />

      <section className={`relative overflow-clip py-8 md:py-12 ${BRAND_BACKDROP_BG}`}>
        <BrandBackdrop wave={false} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Intro */}
          <div className="text-center max-w-2xl mx-auto mb-7 md:mb-9">
            <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-brand-tan">Better together</p>
            <h2 className="mt-2 font-hero font-bold text-brand-ink text-[28px] sm:text-4xl md:text-[42px] leading-[1.1]">
              Combos made for <span className="italic text-brand-funk">your kitchen</span>
            </h2>
            <p className="mt-2 text-brand-ink/70 text-sm md:text-base">
              Two of our favourites in one pack, at a special combo price. Choose the size of each on the next page.
            </p>
            <ul className="mt-4 flex flex-wrap justify-center gap-2">
              {PERKS.map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-line px-3 py-1.5 text-xs md:text-[13px] font-semibold text-brand-ink"
                >
                  <Icon size={14} strokeWidth={2} className="text-brand-funk" />
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {HAMPERS.map((h) => (
              <HamperCard key={h.slug} hamper={h} image={hamperImage(h.slug, h.items[0])} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
