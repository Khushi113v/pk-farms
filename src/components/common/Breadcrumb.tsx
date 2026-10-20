import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = {
  label: string;
  href?: string;
};

// Page banner: plain warm background with the title and trail.
export default function Breadcrumb({
  title,
  items,
}: {
  title: string;
  items: Crumb[];
}) {
  return (
    <section className="relative overflow-hidden bg-[#F4EDDA] border-b border-brand-line">

      <div className="relative h-[120px] md:h-[170px] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-display font-medium text-brand-funk text-[26px] sm:text-[34px] md:text-[42px] leading-tight">
          {title}
        </h1>
        <ol className="mt-2 md:mt-3 flex items-center flex-nowrap justify-center gap-1 sm:gap-1.5 max-w-full text-[12px] sm:text-[13px] tracking-wide whitespace-nowrap">
          <li>
            <Link href="/" className="text-brand-ink/80 hover:text-brand-funk transition-colors">
              Home
            </Link>
          </li>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.label} className="flex items-center gap-1 sm:gap-1.5 min-w-0">
                <ChevronRight size={13} strokeWidth={1.75} className="text-brand-ink/60" />
                {isLast || !item.href ? (
                  <span className="text-brand-ink font-medium truncate max-w-[40vw] sm:max-w-none">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-brand-ink/80 hover:text-brand-funk transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
