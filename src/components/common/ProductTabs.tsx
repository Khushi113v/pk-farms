"use client";
import { useState } from "react";
import { FileText, ListChecks, Apple, CookingPot, FlaskConical } from "lucide-react";

const ICONS = {
  description: FileText,
  info: ListChecks,
  nutrition: Apple,
  use: CookingPot,
  lab: FlaskConical,
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
    <div>
      {/* Tab bar: a soft tray with the active tab raised as a white card; scrolls sideways on phones */}
      <div
        role="tablist"
        className="flex gap-1.5 overflow-x-auto rounded-2xl bg-brand-soft/70 border border-brand-line p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              className={`shrink-0 lg:flex-1 inline-flex items-center justify-center gap-2 whitespace-nowrap h-10 md:h-11 pl-1.5 pr-4 md:pr-5 rounded-xl text-[13px] md:text-sm font-semibold transition-all ${
                on
                  ? "bg-white text-brand-funk shadow-[0_6px_18px_-10px_rgba(11,91,54,0.45)] ring-1 ring-brand-funk/20"
                  : "text-brand-ink/70 hover:text-brand-funk hover:bg-white/60"
              }`}
            >
              <span
                className={`grid place-items-center w-7 h-7 md:w-8 md:h-8 rounded-lg transition-colors ${
                  on ? "bg-brand-funk text-white" : "bg-white/80 text-brand-funk"
                }`}
              >
                <Icon size={15} strokeWidth={2} />
              </span>
              {t.title}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        aria-label={current.title}
        className="mt-3 rounded-2xl border border-brand-line bg-white p-5 md:p-7"
      >
        <h3 className="font-hero font-bold text-brand-ink text-xl md:text-2xl">{current.title}</h3>
        <span aria-hidden className="mt-2 mb-4 block h-[3px] w-10 rounded-full bg-gradient-to-r from-brand-funk to-brand-tan" />
        <div className="text-sm md:text-[15px] text-brand-ink/80 leading-relaxed">{current.content}</div>
      </div>
    </div>
  );
}
