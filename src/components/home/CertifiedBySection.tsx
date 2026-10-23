import Image from "next/image";
import { BadgeCheck } from "lucide-react";

// Certifications PK Farms holds. Add one entry per official logo placed in /public/images/certified/.
// Only list certifications that are actually held, using each body's official logo.
// The section stays hidden while this list is empty.
type Cert = { name: string; logo: string; note?: string };

const CERTS: Cert[] = [
  { name: "FSSAI", logo: "/images/certified/fssai.png", note: "Licensed food business" }, // TODO: add licence no.
  { name: "AGMARK", logo: "/images/certified/agmark.png", note: "Govt. of India quality mark" },
  { name: "ISO", logo: "/images/certified/iso.png", note: "Quality management certified" }, // TODO: add standard, e.g. ISO 22000
];

export default function CertifiedBySection() {
  if (CERTS.length === 0) return null;

  return (
    <section className="relative bg-white pt-10 pb-2 md:pt-14 md:pb-4">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <p className="inline-flex items-center gap-2 text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-brand-tan">
            <BadgeCheck size={15} strokeWidth={2} />
            Quality you can trust
          </p>
          <h2 className="mt-2 font-hero font-bold text-brand-ink text-[30px] sm:text-4xl md:text-[46px] leading-[1.05]">
            Certified <span className="italic text-brand-funk">By</span>
          </h2>
          <p className="mt-3 flex items-center justify-center gap-3 text-brand-ink/70 text-sm md:text-base">
            <span className="h-px w-8 bg-brand-tan" />
            <span className="italic">Tested, licensed and approved</span>
            <span className="h-px w-8 bg-brand-tan" />
          </p>
        </div>

        {/* Logos */}
        <ul className="flex flex-wrap justify-center gap-2.5 sm:gap-5 md:gap-8">
          {CERTS.map((c) => (
            <li
              key={c.name}
              className="group w-[calc(33.333%-0.67rem)] sm:w-[220px] md:w-[250px] flex flex-col items-center text-center rounded-2xl border border-brand-line bg-brand-cream/50 px-2 py-4 sm:px-5 sm:py-6 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:border-brand-funk/30 hover:shadow-[0_18px_32px_-24px_rgba(31,45,36,0.4)]"
            >
              <div className="relative w-full max-w-[150px] h-14 sm:h-20 md:h-24">
                <Image src={c.logo} alt={`${c.name} certification`} fill sizes="150px" className="object-contain" />
              </div>
              <p className="mt-3 font-display font-semibold text-brand-ink text-[13px] sm:text-base">{c.name}</p>
              {c.note && <p className="mt-0.5 text-[11px] md:text-xs text-brand-muted leading-snug">{c.note}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
