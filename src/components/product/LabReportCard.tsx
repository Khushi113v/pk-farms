import { BadgeCheck, Download, Check } from "lucide-react";

const CHIP_TONES = [
  "bg-[#E7F0E4] text-[#0B5B36]",
  "bg-[#F8EAD9] text-[#9A5B1E]",
  "bg-[#EEE7F5] text-[#6B4A8F]",
  "bg-[#E5EEF7] text-[#2F5D8A]",
  "bg-[#F7E6E2] text-[#A2432F]",
];

// Lab report card under the buy buttons: seal, what each batch is tested for, and a download link.
// `href` is the report PDF; until one is set the button is shown but does nothing.
export default function LabReportCard({ name, tests, href }: { name: string; tests: string[]; href?: string }) {
  const cls = (extra: string) =>
    `items-center justify-center gap-2 h-9 px-4 rounded-full bg-brand-funk hover:bg-brand-funkDark text-white text-[13px] font-semibold whitespace-nowrap shadow-[0_8px_18px_-10px_rgba(11,91,54,0.8)] transition-colors ${extra}`;
  const label = (
    <>
      <Download size={15} strokeWidth={2.25} />
      Download Report
    </>
  );
  const button = (extra: string) =>
    href ? (
      <a href={href} download target="_blank" rel="noopener noreferrer" className={cls(extra)}>
        {label}
      </a>
    ) : (
      <button type="button" className={cls(extra)}>
        {label}
      </button>
    );
  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl border border-brand-funk/20 bg-[linear-gradient(135deg,#F1F7EC_0%,#FFFFFF_55%,#FBF6EA_100%)] p-4">
      {/* Large faint seal in the corner */}
      <BadgeCheck
        aria-hidden
        size={120}
        strokeWidth={0.8}
        className="pointer-events-none absolute -right-6 -top-8 text-brand-funk/[0.06]"
      />

      <div className="relative flex items-center gap-3.5">
        {/* Seal */}
        <span className="relative shrink-0 grid place-items-center w-14 h-14 rounded-full bg-white border-2 border-dashed border-brand-funk/45 shadow-[0_8px_18px_-12px_rgba(11,91,54,0.6)]">
          <BadgeCheck size={28} strokeWidth={1.6} className="text-brand-funk" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-hero font-bold text-brand-ink text-[17px] md:text-lg leading-tight">Lab Tested &amp; Verified</p>
          <p className="mt-0.5 text-xs md:text-[13px] text-brand-muted truncate">
            Lab test report · <span className="text-brand-ink/80">{name}</span>
          </p>
        </div>

        {button("hidden xl:inline-flex shrink-0")}
      </div>

      {/* What each batch is tested for */}
      <ul className="relative mt-3.5 flex flex-wrap gap-1.5">
        {tests.map((t, i) => (
          <li
            key={t}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] md:text-xs font-semibold ${CHIP_TONES[i % CHIP_TONES.length]}`}
          >
            <Check size={11} strokeWidth={3} />
            {t}
          </li>
        ))}
      </ul>

      {button("relative mt-3.5 flex w-full xl:hidden")}
    </div>
  );
}
