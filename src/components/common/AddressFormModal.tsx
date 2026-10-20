"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Address } from "@/lib/addresses-data";
import type { NewAddress } from "@/lib/address-context";

const EMPTY: NewAddress = {
  label: "Home",
  type: "shipping",
  isDefault: false,
  name: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
};

const inputCls =
  "w-full h-11 px-4 rounded-xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm";

export default function AddressFormModal({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewAddress) => void;
  initial?: Address | null;
}) {
  const [form, setForm] = useState<NewAddress>(initial ?? EMPTY);

  useEffect(() => {
    if (open) setForm(initial ?? EMPTY);
  }, [open, initial]);

  if (!open) return null;

  const handleChange =
    (field: keyof NewAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        field === "isDefault" ? (e.target as HTMLInputElement).checked : e.target.value;
      setForm((f) => ({ ...f, [field]: value }) as NewAddress);
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div onClick={onClose} aria-hidden className="absolute inset-0 bg-brand-ink/50" />
      <div className="relative w-full max-w-lg bg-white rounded-3xl border border-brand-line shadow-[0_25px_60px_-25px_rgba(31,45,36,0.5)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-line sticky top-0 bg-white">
          <h2 className="font-display font-medium text-brand-ink text-lg">
            {initial ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 grid place-items-center rounded-full text-brand-ink hover:bg-brand-cream transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-brand-ink mb-1.5">Address label</label>
            <select value={form.label} onChange={handleChange("label")} className={inputCls}>
              <option>Home</option>
              <option>Work</option>
              <option>Other</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-brand-ink mb-1.5">Address type</label>
            <select value={form.type ?? "shipping"} onChange={handleChange("type")} className={inputCls}>
              <option value="billing">Billing address</option>
              <option value="shipping">Shipping address</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-ink mb-1.5">Full name</label>
            <input
              required
              value={form.name}
              onChange={handleChange("name")}
              placeholder="Jane Doe"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-ink mb-1.5">Phone number</label>
            <input
              required
              type="tel"
              value={form.phone}
              onChange={handleChange("phone")}
              placeholder="+91 98765 43210"
              className={inputCls}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-brand-ink mb-1.5">House / Flat no. &amp; Building</label>
            <input
              required
              value={form.line1}
              onChange={handleChange("line1")}
              placeholder="e.g. 112, Palm Residency"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-ink mb-1.5">Locality / Area</label>
            <input
              required
              value={form.line2}
              onChange={handleChange("line2")}
              placeholder="e.g. Indiranagar"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-ink mb-1.5">
              Landmark <span className="font-normal text-brand-muted">(optional)</span>
            </label>
            <input
              value={form.landmark ?? ""}
              onChange={handleChange("landmark")}
              placeholder="e.g. Near CMH Hospital"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-ink mb-1.5">City</label>
            <input required value={form.city} onChange={handleChange("city")} className={inputCls} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-ink mb-1.5">State</label>
            <input required value={form.state} onChange={handleChange("state")} className={inputCls} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-ink mb-1.5">Pincode</label>
            <input
              required
              value={form.pincode}
              onChange={handleChange("pincode")}
              inputMode="numeric"
              className={inputCls}
            />
          </div>

          <label className="sm:col-span-2 flex items-center gap-2 text-sm text-brand-ink cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={handleChange("isDefault")}
              className="w-4 h-4 rounded border-brand-line text-brand-funk focus:ring-brand-funk/40"
            />
            Set as default address
          </label>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center h-12 rounded-full text-white font-medium tracking-wide text-basetransition-colors bg-brand-funk hover:bg-brand-funkDark"
            >
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
