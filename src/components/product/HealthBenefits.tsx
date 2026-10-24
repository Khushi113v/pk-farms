import Image from "next/image";
import { Check } from "lucide-react";

export type BenefitRow = { tag: string; title: string; text: string; src: string };

// Dotted grid used as a soft decoration beside the text
function Dots({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`absolute w-24 h-14 opacity-60 bg-[radial-gradient(#C9BFA3_1.2px,transparent_1.2px)] [background-size:12px_12px] ${className}`}
    />
  );
}

// Health benefits: one row per benefit, image and text swapping sides on every row
export default function HealthBenefits({ product, rows }: { product: string; rows: BenefitRow[] }) {
  return (
    <section className="relative bg-[linear-gradient(to_bottom,#FFFFFF_0%,#FBF8F1_100%)] pt-6 pb-10 md:pt-8 md:pb-14 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-brand-tan">Goodness in every spoon</p>
          <h2 className="mt-2 font-hero font-bold text-brand-ink text-[30px] sm:text-4xl md:text-[46px] leading-[1.08]">
            Health <span className="italic text-brand-funk">benefits</span>
          </h2>
          <p className="mt-3 text-brand-ink/70 text-sm md:text-base">Why {product} deserves a place in your kitchen.</p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">
          {rows.map((r, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={r.title} className="grid md:grid-cols-2 items-center gap-5 md:gap-10">
                {/* Text */}
                <div className={`relative ${flip ? "md:order-2" : ""}`}>
                  <Dots className={flip ? "-top-6 right-0" : "-top-6 -left-4"} />
                  <span className="relative inline-flex items-center gap-1.5 rounded-full border border-brand-funk/25 bg-brand-strip px-3 py-1 text-[11px] md:text-xs font-bold uppercase tracking-[0.12em] text-brand-funk">
                    <Check size={12} strokeWidth={3} />
                    {r.tag}
                  </span>
                  <h3 className="relative mt-3 font-hero font-bold text-brand-ink text-[22px] sm:text-[26px] md:text-[30px] leading-[1.15]">
                    {r.title}
                  </h3>
                  <span aria-hidden className="mt-3 block h-[3px] w-12 rounded-full bg-gradient-to-r from-brand-funk to-brand-tan" />
                  <p className="mt-3 max-w-md text-brand-ink/75 text-[15px] md:text-base leading-relaxed">{r.text}</p>
                </div>

                {/* Image */}
                <div className={`relative w-full max-w-[380px] mx-auto ${flip ? "md:order-1 md:mr-0" : "md:ml-0"}`}>
                  <span aria-hidden className="absolute -inset-3 md:-inset-4 rounded-[32px] bg-brand-strip/70 blur-2xl" />
                  <div className="relative aspect-[4/3] rounded-[24px] md:rounded-[28px] overflow-hidden border border-brand-funk/25 bg-brand-soft shadow-[0_24px_50px_-28px_rgba(11,91,54,0.45)]">
                    <Image src={r.src} alt={r.title} fill sizes="(max-width: 768px) 92vw, 380px" className="object-cover" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-8 md:mt-10 text-center text-[11px] md:text-xs text-brand-muted">
          Based on traditional use and general nutrition. Not a substitute for medical advice.
        </p>
      </div>
    </section>
  );
}
