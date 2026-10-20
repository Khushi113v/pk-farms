"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/common/ProductCard";
import { useAutoScroll } from "@/lib/use-auto-scroll";

export default function ProductSlider({ slugs }: { slugs: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  useAutoScroll(trackRef, { interval: 3200 });

  const go = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="font-display font-medium text-brand-ink text-xl md:text-2xl">
          You may also{" "}
          <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
            like
          </span>
        </h2>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous products"
            className="grid place-items-center w-10 h-10 rounded-full bg-white text-brand-ink border border-brand-line transition-all"
          >
            <ChevronLeft size={16} strokeWidth={2.75} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next products"
            className="grid place-items-center w-10 h-10 rounded-full text-white transition-all bg-brand-funk hover:bg-brand-funkDark"
          >
            <ChevronRight size={16} strokeWidth={2.75} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slugs.map((slug) => (
          <div
            key={slug}
            className="snap-start shrink-0 flex w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)] [&>*]:w-full"
          >
            <ProductCard slug={slug} />
          </div>
        ))}
      </div>
    </div>
  );
}
