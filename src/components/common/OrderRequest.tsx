"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, RotateCcw, ImagePlus, Trash2, Clock } from "lucide-react";
import type { OrderStatus } from "@/lib/orders-data";

type Kind = "cancel" | "return";

const REASONS: Record<Kind, string[]> = {
  cancel: [
    "Ordered by mistake",
    "Found a better price elsewhere",
    "Want to change size or colour",
    "Delivery is taking too long",
    "Need to change the address",
    "Other",
  ],
  return: [
    "Size does not fit",
    "Received a wrong item",
    "Item is damaged or defective",
    "Colour is different from the photos",
    "Quality is not as expected",
    "Other",
  ],
};

const COPY: Record<Kind, { title: string; button: string; submit: string; done: string }> = {
  cancel: { title: "Cancel Order", button: "Cancel", submit: "Submit Cancellation", done: "Cancellation requested" },
  return: { title: "Return Order", button: "Return", submit: "Submit Return", done: "Return requested" },
};

const KEY = "pk-farms-order-requests";
const MAX_FILES = 4;

function readRequests(): Record<string, Kind> {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

// Same popup for both: a reason list, a box for anything not listed, and (returns only) photos
function RequestModal({
  kind,
  orderId,
  onClose,
  onSubmitted,
}: {
  kind: Kind;
  orderId: string;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState<{ file: File; url: string }[]>([]);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const copy = COPY[kind];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => () => files.forEach((f) => URL.revokeObjectURL(f.url)), [files]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files];
    for (const file of Array.from(list)) {
      if (next.length >= MAX_FILES) break;
      next.push({ file, url: URL.createObjectURL(file) });
    }
    setFiles(next);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return setError("Please select a reason.");
    if (reason === "Other" && !details.trim()) return setError("Please write your reason in the box below.");
    if (kind === "return" && files.length === 0) return setError("Please upload at least one photo of the product.");
    // TODO: send { orderId, kind, reason, details, files } to the server
    onSubmitted();
    onClose();
  };

  const field =
    "w-full rounded-xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm";

  return createPortal(
    <div className="fixed inset-0 z-[90] grid place-items-center p-4">
      <div onClick={onClose} aria-hidden className="absolute inset-0 bg-brand-ink/55" />
      <div
        role="dialog"
        aria-label={copy.title}
        className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-white rounded-2xl border border-brand-line overflow-hidden"
      >
        <div className="h-[3px] w-full shrink-0 bg-brand-funk" />
        <div className="flex items-center justify-between px-5 py-4 border-b border-brand-line shrink-0">
          <h2 className="font-display font-medium text-brand-ink text-lg">
            {copy.title} <span className="text-brand-muted text-sm font-body">#{orderId}</span>
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

        <form onSubmit={submit} className="overflow-y-auto p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-ink mb-1.5">
              Reason for {kind === "cancel" ? "cancellation" : "return"}
            </label>
            <select
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              className={`${field} h-11 px-3`}
            >
              <option value="">Select a reason</option>
              {REASONS[kind].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {reason === "Other" && (
            <div>
              <label className="block text-xs font-semibold text-brand-ink mb-1.5">
                Other reason
              </label>
              <textarea
                rows={3}
              autoFocus
                maxLength={300}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Write your reason here…"
                className={`${field} p-3.5 resize-none`}
              />
            </div>
          )}

          {kind === "return" && (
            <div>
              <label className="block text-xs font-semibold text-brand-ink mb-1.5">
                Upload photos <span className="font-normal text-brand-muted">(up to {MAX_FILES})</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {files.map((f, i) => (
                  <div key={f.url} className="relative w-16 h-16 rounded-lg overflow-hidden border border-brand-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.url} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      aria-label="Remove photo"
                      onClick={() => setFiles((list) => list.filter((_, idx) => idx !== i))}
                      className="absolute top-0.5 right-0.5 grid place-items-center w-5 h-5 rounded-full bg-white/90 text-red-500"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
                {files.length < MAX_FILES && (
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="grid place-items-center w-16 h-16 rounded-lg border border-dashed border-brand-funk/50 bg-brand-cream text-brand-funk hover:bg-brand-strip transition-colors"
                    aria-label="Add photo"
                  >
                    <ImagePlus size={20} strokeWidth={1.6} />
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => addFiles(e.target.files)}
                className="sr-only"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center h-11 rounded-full text-white font-medium tracking-wide text-sm transition-colors bg-brand-funk hover:bg-brand-funkDark"
          >
            {copy.submit}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

// Cancel is offered only before the order ships; Return only after it is delivered
export default function OrderRequestButton({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const kind: Kind | null = status === "Processing" ? "cancel" : status === "Delivered" ? "return" : null;
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState<Kind | null>(null);

  useEffect(() => {
    setRequested(readRequests()[orderId] ?? null);
  }, [orderId]);

  if (!kind) return null;

  const markRequested = () => {
    setRequested(kind);
    try {
      localStorage.setItem(KEY, JSON.stringify({ ...readRequests(), [orderId]: kind }));
    } catch {}
  };

  if (requested === kind) {
    return (
      <span className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-brand-cream border border-brand-line text-brand-muted text-xs md:text-sm font-semibold whitespace-nowrap">
        <Clock size={13} />
        {COPY[kind].done}
      </span>
    );
  }

  const isCancel = kind === "cancel";
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 h-9 px-4 rounded-full border text-xs md:text-sm font-bold whitespace-nowrap transition-colors ${
          isCancel
            ? "border-red-200 text-red-500 hover:bg-red-50"
            : "border-brand-funk/40 text-brand-funk hover:bg-brand-strip"
        }`}
      >
        {isCancel ? <X size={13} strokeWidth={2.5} /> : <RotateCcw size={13} strokeWidth={2.5} />}
        {COPY[kind].button}
      </button>
      {open && <RequestModal kind={kind} orderId={orderId} onClose={() => setOpen(false)} onSubmitted={markRequested} />}
    </>
  );
}
