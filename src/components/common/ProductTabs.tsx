"use client";
import { useState } from "react";
import { FileText, ListChecks, Truck, Droplets } from "lucide-react";

const ICONS = {
  description: FileText,
  specs: ListChecks,
  shipping: Truck,
  care: Droplets,
};

export type ProductTab = {
  title: string;
  icon: keyof typeof ICONS;
  content: React.ReactNode;
};

export default function ProductTabs({ tabs }: { tabs: ProductTab[] }) {
  const [active, setActive] = useState(0);
  const current = tabs[active];

  return (
    <div className="rounded-2xl border border-brand-line bg-white overflow-hidden">
      {/* Tab row: underline style, scrolls sideways on small screens */}
      <div
        role="tablist"
        className="flex items-stretch overflow-x-auto border-b border-brand-line bg-brand-cream/60 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {tabs.map((t, i) => {
          const on = i === active;
          const Icon = ICONS[t.icon];
          return (
            <button
              key={t.title}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActive(i)}
              className={`relative shrink-0 md:flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap px-5 py-4 text-sm tracking-wide transition-colors ${
                on ? "text-brand-funk bg-white" : "text-brand-ink/70 hover:text-brand-funk"
              }`}
            >
              <Icon size={16} strokeWidth={1.75} />
              {t.title}
              <span
                aria-hidden
                className={`absolute left-1/2 -translate-x-1/2 w-12 bottom-0 h-0.5 transition-colors ${on ? "bg-brand-funk" : "bg-transparent"}`}
              />
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div role="tabpanel" aria-label={current.title} className="p-5 md:p-8">
        <div className="text-sm md:text-[15px] text-brand-ink/80 leading-relaxed">{current.content}</div>
      </div>
    </div>
  );
}
