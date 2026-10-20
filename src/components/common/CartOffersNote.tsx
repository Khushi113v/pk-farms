"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BadgePercent, NotebookPen, X, Check, Gift } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { OFFERS } from "@/lib/offers-data";

function Modal({
  title,
  icon,
  onClose,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[90] grid place-items-center p-4">
      <div onClick={onClose} aria-hidden className="absolute inset-0 bg-brand-ink/55" />
      <div
        role="dialog"
        aria-label={title}
        className="relative w-full max-w-md max-h-[85vh] flex flex-col bg-white rounded-2xl border border-brand-line shadow-2xl overflow-hidden"
      >
        <div
          className="h-[3px] w-full shrink-0 bg-brand-funk hover:bg-brand-funkDark"
        />
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-line shrink-0">
          <div className="flex items-center gap-2 font-display font-medium text-brand-ink text-lg">
            <span className="text-brand-funk">{icon}</span>
            {title}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 grid place-items-center rounded-full text-brand-ink hover:bg-brand-cream transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body
  );
}

// Birthday and anniversary month gifts sit at the top of the list
const isGift = (code: string) => code === "BIRTHDAY15" || code === "ANNIVERSARY15";

function OffersModal({ onClose }: { onClose: () => void }) {
  const { coupon, applyCoupon, removeCoupon } = useCart();

  return (
    <Modal title="Available Offers" icon={<BadgePercent size={20} />} onClose={onClose}>
      <ul className="space-y-3">
        {[...OFFERS].sort((a, b) => Number(isGift(b.code)) - Number(isGift(a.code))).map((o) => (
          <li
            key={o.code}
            className={`rounded-xl border p-4 ${isGift(o.code) ? "border-[#E8D6AC] bg-[#F4EAD5]/60" : "border-brand-line bg-brand-cream/50"}`}
          >
            {isGift(o.code) && (
              <p className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8A6420]">
                <Gift size={13} />
                Special for you
              </p>
            )}
            <p className="font-display font-medium text-brand-ink text-sm">{o.title}</p>
            <p className="mt-1 text-xs text-brand-muted leading-relaxed">{o.desc}</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="px-3 py-1 rounded-lg border border-dashed border-brand-funk bg-brand-strip text-brand-funk font-medium tracking-wide text-xs tracking-wider">
                {o.code}
              </span>
              {coupon === o.code ? (
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="inline-flex items-center gap-1 h-8 px-3.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-medium tracking-wide text-xs"
                >
                  <Check size={13} strokeWidth={3} />
                  Applied · Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    applyCoupon(o.code);
                    onClose();
                  }}
                  className="h-8 px-5 rounded-full text-white font-medium tracking-wide text-xs border border-brand-ink/40 bg-brand-funk hover:bg-brand-funkDark"
                >
                  Apply
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </Modal>
  );
}

function NoteModal({ onClose }: { onClose: () => void }) {
  const { note, setNote } = useCart();
  const [draft, setDraft] = useState(note);

  return (
    <Modal title="Add Note" icon={<NotebookPen size={20} />} onClose={onClose}>
      <label htmlFor="cart-note" className="text-xs font-semibold text-brand-ink mb-1.5 block">
        Any instructions for your order?
      </label>
      <textarea
        id="cart-note"
        rows={5}
        maxLength={300}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="E.g. gift wrap, deliver after 6 PM, call before delivery…"
        className="w-full p-3.5 rounded-xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm resize-none"
      />
      <p className="mt-1 text-right text-[11px] text-brand-muted">{draft.length}/300</p>
      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="h-10 px-5 rounded-full border border-brand-line text-brand-ink font-semibold text-sm hover:border-brand-ink transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            setNote(draft.trim());
            onClose();
          }}
          className="h-10 px-6 rounded-full text-white font-medium tracking-wide text-sm border border-brand-ink/40 transition-colors bg-brand-funk hover:bg-brand-funkDark"
        >
          Save Note
        </button>
      </div>
    </Modal>
  );
}

export default function CartOffersNote({
  className = "",
  trailing,
  showOffers = true,
  showNote = true,
  onGradient = false,
}: {
  className?: string;
  trailing?: React.ReactNode;
  showOffers?: boolean;
  showNote?: boolean;
  onGradient?: boolean; // see-through white buttons for use on the brand-gradient strip
}) {
  const { note } = useCart();
  const [modal, setModal] = useState<"offers" | "note" | null>(null);

  const btn = `shrink-0 whitespace-nowrap inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 rounded-full border font-display font-bold text-xs transition-colors ${
    onGradient
      ? "h-[22px] border-white bg-white/30 text-white hover:bg-white/40"
      : "h-6 border-brand-funk/20 bg-[#F3F6EC] text-brand-ink hover:bg-brand-strip"
  }`;
  const iconCls = onGradient ? "text-white" : "text-brand-funk";

  return (
    <>
      <div className={`flex items-center gap-1.5 sm:gap-2 ${className}`}>
        {showOffers && (
        <button type="button" onClick={() => setModal("offers")} className={btn}>
          <BadgePercent size={14} className={iconCls} />
          <span>
            <span className="hidden sm:inline">View </span>Offers
          </span>
        </button>
        )}
        {showNote && (
        <button type="button" onClick={() => setModal("note")} className={btn}>
          <NotebookPen size={14} className={iconCls} />
          <span>
            <span className="hidden sm:inline">{note ? "Edit " : "Add "}</span>Note
          </span>
          {note && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
        </button>
        )}
        {trailing && <div className="ml-auto min-w-0">{trailing}</div>}
      </div>
      {modal === "offers" && <OffersModal onClose={() => setModal(null)} />}
      {modal === "note" && <NoteModal onClose={() => setModal(null)} />}
    </>
  );
}
