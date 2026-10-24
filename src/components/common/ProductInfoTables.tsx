"use client";
import { Utensils, ThermometerSun, Sparkles, PackageCheck, BadgeCheck, FileDown, Check } from "lucide-react";
import { useProductVariant } from "@/components/common/ProductVariants";
import { SPEC_COLOUR, SPEC_DISCOUNT } from "@/lib/product-data";
import type { CareKind } from "@/lib/product-data";
import { CARE, SHIPPING_ROWS } from "@/lib/product-care";
import type { NutritionRow, UseStep, LabTest } from "@/lib/product-details";

export function InfoTable({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="max-w-2xl rounded-xl overflow-hidden border border-brand-line">
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={`grid grid-cols-[130px_1fr] sm:grid-cols-[180px_1fr] gap-4 px-4 py-3 text-sm ${
            i % 2 === 0 ? "bg-brand-cream/60" : "bg-white"
          }`}
        >
          <span className="font-semibold text-brand-ink">{r.label}</span>
          <span className="text-brand-ink/75">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

// Specifications: Color and Discount follow the selected colour and size
export function SpecTable({ rows }: { rows: { label: string; value: string }[] }) {
  const { colour, price, mrp } = useProductVariant();
  const discount = mrp > price ? `${Math.round(((mrp - price) / mrp) * 100)}%` : "None";
  const resolved = rows.map((r) =>
    r.value === SPEC_COLOUR ? { ...r, value: colour ?? "-" } : r.value === SPEC_DISCOUNT ? { ...r, value: discount } : r
  );
  return <InfoTable rows={resolved} />;
}

export function ShippingTable() {
  return <InfoTable rows={SHIPPING_ROWS} />;
}

const CARE_ICONS = {
  wash: Utensils,
  dry: ThermometerSun,
  iron: Sparkles,
  store: PackageCheck,
};

export function CareList({ kind }: { kind: CareKind }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
      {CARE[kind].map((step) => {
        const Icon = CARE_ICONS[step.icon];
        return (
          <li key={step.title} className="flex items-start gap-4">
            <span className="shrink-0 grid place-items-center w-10 h-10 rounded-full bg-brand-strip text-brand-funk">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <span>
              <span className="block font-display font-medium text-brand-ink text-base">{step.title}</span>
              <span className="mt-1 block text-sm leading-relaxed">{step.text}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

// Nutrition label: typical values per 100 g, sub-rows indented under their parent
export function NutritionTable({ rows }: { rows: NutritionRow[] }) {
  return (
    <div className="max-w-2xl rounded-xl overflow-hidden border border-brand-line">
      <div className="grid grid-cols-[1fr_auto] gap-4 px-4 py-3 text-sm font-bold text-white bg-brand-funk">
        <span>Nutrient</span>
        <span>Per 100 g</span>
      </div>
      {rows.map((r, i) => (
        <div
          key={r.label}
          className={`grid grid-cols-[1fr_auto] gap-4 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-brand-cream/60" : "bg-white"}`}
        >
          <span className="font-semibold text-brand-ink">{r.label}</span>
          <span className="text-brand-ink/75">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

// How to use: numbered ideas, then the storage tips
export function HowToUse({ steps, kind }: { steps: UseStep[]; kind: CareKind }) {
  return (
    <div className="space-y-8">
      <ol className="grid sm:grid-cols-2 gap-3 md:gap-4">
        {steps.map((s, i) => (
          <li key={s.title} className="flex items-start gap-3.5 rounded-xl bg-brand-cream border border-brand-line p-4">
            <span className="shrink-0 grid place-items-center w-8 h-8 rounded-full bg-brand-funk text-white text-sm font-bold">
              {i + 1}
            </span>
            <span>
              <span className="block font-display font-semibold text-brand-ink text-[15px]">{s.title}</span>
              <span className="mt-1 block text-sm leading-relaxed">{s.text}</span>
            </span>
          </li>
        ))}
      </ol>
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-brand-tan">Storage tips</p>
        <CareList kind={kind} />
      </div>
    </div>
  );
}

const CHIP_TONES = [
  "bg-[#E7F0E4] text-[#0B5B36]",
  "bg-[#F8EAD9] text-[#9A5B1E]",
  "bg-[#EEE7F5] text-[#6B4A8F]",
  "bg-[#E5EEF7] text-[#2F5D8A]",
  "bg-[#F7E6E2] text-[#A2432F]",
];

// Lab report: the quality checks, shown as information. Add `report` (a PDF path) later to show a download button.
export function LabReport({ tests, report }: { tests: LabTest[]; report?: string }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <span className="shrink-0 grid place-items-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-brand-strip border-2 border-dashed border-brand-funk/50">
          <BadgeCheck size={30} strokeWidth={1.6} className="text-brand-funk" />
        </span>
        <div>
          <p className="font-hero font-bold text-brand-ink text-lg md:text-xl">Lab Tested &amp; Verified</p>
          <p className="mt-0.5 text-sm">Quality checks we run before a batch is packed.</p>
        </div>
      </div>

      <div className="max-w-3xl rounded-xl overflow-hidden border border-brand-line">
        <div className="grid grid-cols-[130px_1fr] sm:grid-cols-[180px_1fr] gap-4 px-4 py-3 text-sm font-bold text-white bg-brand-funk">
          <span>Test</span>
          <span>What it checks</span>
        </div>
        {tests.map((t, i) => (
          <div
            key={t.name}
            className={`grid grid-cols-[130px_1fr] sm:grid-cols-[180px_1fr] gap-4 px-4 py-3 text-sm ${i % 2 === 0 ? "bg-brand-cream/60" : "bg-white"}`}
          >
            <span className="flex items-start gap-2 font-semibold text-brand-ink">
              <Check size={15} strokeWidth={3} className="shrink-0 mt-0.5 text-brand-funk" />
              {t.name}
            </span>
            <span className="text-brand-ink/75">{t.detail}</span>
          </div>
        ))}
      </div>

      {report && (
        <a
          href={report}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-brand-funk hover:bg-brand-funkDark text-white text-sm font-semibold transition-colors"
        >
          <FileDown size={16} strokeWidth={2} />
          View Lab Report
        </a>
      )}
    </div>
  );
}
