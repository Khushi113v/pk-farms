import Image from "next/image";

// `emblem` = the illustrated round badge (transparent PNG) has been added; until then `src` is a placeholder photo
export type WhyUsCard = { title: string; text: string; src: string; emblem: boolean };

// Why choose us (product page): four illustrated emblems on a dotted path, each with a short promise
export default function ProductWhyChoose({ items }: { items: WhyUsCard[] }) {
  return (
    <section className="relative bg-[#F3F6EE] py-10 md:py-14 overflow-hidden">
      {/* Soft hills at the bottom */}
      <span aria-hidden className="absolute -bottom-28 -left-20 w-[60%] h-40 rounded-[50%] bg-[#E9F0E1]" />
      <span aria-hidden className="absolute -bottom-32 -right-24 w-[65%] h-44 rounded-[50%] bg-[#EDF2E7]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-brand-tan">Our promise</p>
          <h2 className="mt-2 font-hero font-bold text-brand-ink text-[30px] sm:text-4xl md:text-[46px] leading-[1.08]">
            Why choose <span className="italic text-brand-funk">PK Farms</span>
          </h2>
        </div>

        <div className="relative">
          {/* Dotted path linking the emblems (desktop) */}
          <span
            aria-hidden
            className="hidden lg:block absolute left-[12%] right-[12%] top-[80px] border-t-2 border-dashed border-brand-funk/25"
          />

          <ul className="relative grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8">
            {items.map((it) => (
              <li key={it.title} className="flex flex-col items-center text-center">
                <div className="relative w-[136px] h-[136px] md:w-[160px] md:h-[160px]">
                  {it.emblem ? (
                    // Illustrated badge, shown as it is
                    <Image
                      src={it.src}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-contain drop-shadow-[0_14px_18px_rgba(31,45,36,0.22)]"
                    />
                  ) : (
                    // Placeholder photo in a round frame
                    <div className="absolute inset-2 rounded-full bg-white p-1.5 shadow-[0_18px_36px_-22px_rgba(31,45,36,0.55)] ring-1 ring-brand-line">
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image src={it.src} alt="" fill sizes="160px" className="object-cover" />
                      </div>
                    </div>
                  )}
                </div>
                <h3 className="mt-3 font-hero font-bold text-brand-ink text-lg md:text-xl">{it.title}</h3>
                <p className="mt-1.5 max-w-[240px] text-[13px] md:text-sm text-brand-ink/70 leading-relaxed">{it.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
