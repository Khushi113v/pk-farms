"use client";
import { MdOutlineLocalLaundryService, MdOutlineWbSunny, MdOutlineIron, MdOutlineInventory2 } from "react-icons/md";
import { useProductVariant } from "@/components/common/ProductVariants";
import { SPEC_COLOUR, SPEC_DISCOUNT } from "@/lib/product-data";
import type { CareKind } from "@/lib/product-data";
import { CARE, SHIPPING_ROWS } from "@/lib/product-care";

function Table({ rows }: { rows: { label: string; value: string }[] }) {
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
  return <Table rows={resolved} />;
}

export function ShippingTable() {
  return <Table rows={SHIPPING_ROWS} />;
}

const CARE_ICONS = {
  wash: MdOutlineLocalLaundryService,
  dry: MdOutlineWbSunny,
  iron: MdOutlineIron,
  store: MdOutlineInventory2,
};

export function CareList({ kind }: { kind: CareKind }) {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
      {CARE[kind].map((step) => {
        const Icon = CARE_ICONS[step.icon];
        return (
          <li key={step.title} className="flex items-start gap-4">
            <span className="shrink-0 grid place-items-center w-10 h-10 rounded-full bg-brand-strip text-brand-funk">
              <Icon size={20} />
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
