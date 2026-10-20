"use client";
import { useState } from "react";
import { Plus, MessageCircleQuestion } from "lucide-react";
import BrandBackdrop, { BRAND_BACKDROP_BG } from "@/components/common/BrandBackdrop";

import { FAQS, type QA } from "@/lib/product-faqs";


// `items` overrides the default home-page questions (used on product pages).
export default function FAQSection({ items = FAQS, compact = false }: { items?: QA[]; compact?: boolean }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section
      className={`relative ${BRAND_BACKDROP_BG} py-8 md:py-10 overflow-hidden`}
    >
      <BrandBackdrop wave={false} />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center ${compact ? "mb-6 md:mb-8" : "mb-8 md:mb-10"}`}>
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-brand-strip px-3 py-1.5 rounded-full border border-brand-funk/30">
            <MessageCircleQuestion size={14} strokeWidth={2.5} />
            You asked, we answered
          </span>
          <h2
            className={`mt-4 font-display font-medium text-brand-ink leading-[1.05] ${ compact ? "text-[26px] sm:text-3xl md:text-4xl" : "text-[30px] sm:text-4xl md:text-5xl" }`}
          >
            Frequently{" "}
            <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
              asked
            </span>{" "}
            questions.
          </h2>
        </div>

        {/* Accordion */}
        <div className="flex flex-col gap-2">
          {items.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.q}
                className={`bg-white rounded-2xl border border-brand-line overflow-hidden transition-all`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className={`w-full flex items-center justify-between gap-4 px-4 md:px-5 py-2 md:py-2.5 text-left font-display font-medium text-brand-ink text-[15px] md:text-base leading-snug transition-colors ${ isOpen ? "text-brand-funk" : "hover:text-brand-funk" }`}
                >
                  <span>{item.q}</span>
                  <span
                    className={`shrink-0 grid place-items-center w-8 h-8 md:w-9 md:h-9 rounded-full text-white transition-all ${ isOpen ? "rotate-45" : "" } bg-brand-funk hover:bg-brand-funkDark`}
                  >
                    <Plus size={16} strokeWidth={2.75} />
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`grid transition-all duration-300 ease-out ${ isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0" }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-4 md:px-5 pb-4 pt-0 text-brand-ink/75 text-sm leading-relaxed border-t border-brand-line/70">
                      <p className="pt-3">{item.a}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Small helper footer */}
        {/* <p className="mt-6 text-center text-sm text-brand-muted">
          Still curious?{" "}
          <a href="#" className="font-semibold text-brand-funk underline underline-offset-4">
            Ping us on WhatsApp
          </a>{" "}
          — we reply within an hour.
        </p> */}
      </div>
    </section>
  );
}
