"use client";
import { useState } from "react";
import { Tag, Check, X } from "lucide-react";
import { useCart } from "@/lib/cart-context";

// Thin coupon strip for the side cart: code input + Apply, or the applied code with a remove button.
export default function CartCoupon() {
  const { coupon, applyCoupon, removeCoupon, discount } = useCart();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  if (coupon) {
    return (
      <div className="border-t border-brand-line px-5 py-1.5 flex items-center justify-between gap-2 text-xs">
        <p className="flex items-center gap-1.5 min-w-0 text-emerald-700">
          <Check size={13} strokeWidth={3} className="shrink-0" />
          <span className="truncate">
            <span className="font-bold">{coupon}</span> applied
            {discount > 0 && <span className="font-semibold"> · −₹{discount}</span>}
          </span>
        </p>
        <button
          type="button"
          onClick={removeCoupon}
          className="shrink-0 inline-flex items-center gap-0.5 font-semibold text-brand-muted hover:text-red-500 transition-colors"
        >
          <X size={12} strokeWidth={2.5} />
          Remove
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!code.trim()) return;
        const ok = applyCoupon(code);
        setError(!ok);
        if (ok) setCode("");
      }}
      className="border-t border-brand-line px-5 py-1"
    >
      <div className="flex items-center gap-2">
        <span className="shrink-0 text-xs font-semibold text-brand-ink whitespace-nowrap">Have a coupon?</span>
        <div className="relative flex-1 min-w-0 max-w-[14rem] ml-auto">
          <Tag size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-brand-muted" />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(false);
            }}
            placeholder="Enter coupon code"
            aria-label="Coupon code"
            className={`w-full h-7 pl-7 pr-2 rounded-full bg-white border text-xs text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk ${ error ? "border-red-300" : "border-brand-line" }`}
          />
        </div>
        <button
          type="submit"
          className="shrink-0 h-7 px-3.5 rounded-full bg-brand-funk hover:bg-brand-funkDark text-white font-medium tracking-wide text-xs transition-colors"
        >
          Apply
        </button>
      </div>
      {error && <p className="mt-1 text-right text-[10px] font-semibold text-red-500">That code isn&apos;t valid — see View Offers.</p>}
    </form>
  );
}
