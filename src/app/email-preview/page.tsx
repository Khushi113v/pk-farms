"use client";
import { useMemo, useState } from "react";
import { TEMPLATES } from "@/emails/templates";

// Development page: shows each email design exactly as written, in a frame. Nothing is sent from here.
export default function EmailPreviewPage() {
  const [id, setId] = useState(TEMPLATES[0].id);

  const mail = useMemo(() => TEMPLATES.find((t) => t.id === id)!.build(), [id]);

  return (
    <section className="py-8 md:py-10 bg-brand-cream min-h-[80vh]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-medium text-brand-ink text-2xl md:text-3xl">Email templates</h1>
        <p className="mt-1 text-sm text-brand-muted">Design preview only. Nothing is sent from this page.</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setId(t.id)}
              className={`h-9 px-4 rounded-full border text-sm transition-colors ${
                id === t.id
                  ? "bg-brand-funk border-brand-funk text-white"
                  : "bg-white border-brand-line text-brand-ink hover:border-brand-funk/50"
              }`}
            >
              {t.label}
            </button>
          ))}

        </div>

        <p className="mt-4 text-sm">
          <span className="text-brand-muted">Subject: </span>
          <span className="font-semibold text-brand-ink">{mail.subject}</span>
        </p>

        <div className="mt-3 mx-auto rounded-xl border border-brand-line bg-white overflow-hidden transition-all" style={{ maxWidth: 680 }}>
          <iframe key={id} title={mail.subject} srcDoc={mail.html} className="w-full block" style={{ height: 1100, border: 0 }} />
        </div>
      </div>
    </section>
  );
}
