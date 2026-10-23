import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Wheat } from "lucide-react";
import { CATEGORIES, PRODUCTS, type Category } from "@/lib/product-data";

// Each card is an arched "farm window": the farm photo in the background with the product standing in the field.
type Theme = { tagline: string; param: string };

const THEME: Partial<Record<Category, Theme>> = {
  Ghee: { tagline: "A2 bilona ghee", param: "ghee" },
  Honey: { tagline: "Raw wild honey", param: "honey" },
  Oils: { tagline: "Wood pressed oils", param: "oils" },
  Spices: { tagline: "Pure aromatic spices", param: "spices" },
};

const CARDS = CATEGORIES.map((name) => {
  const items = PRODUCTS.filter((p) => p.category === name);
  const t = THEME[name];
  return {
    name,
    tagline: t?.tagline ?? items[0]?.hint ?? "",
    href: `/shop?category=${t?.param ?? name.toLowerCase()}`,
    image: items[0]?.image,
    count: items.length,
  };
}).filter((c) => c.image);

export default function ShopByCategorySection() {
  return (
    <section className="relative bg-white py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-7 md:mb-9 flex items-end justify-between gap-6">
          <div>
            <p className="inline-flex items-center gap-2 text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-brand-tan">
              <Wheat size={15} strokeWidth={2} />
              Fresh from our farms
            </p>
            <h2 className="mt-2 font-hero font-bold text-brand-ink text-[28px] sm:text-4xl md:text-[44px] leading-[1.05]">
              Shop by <span className="italic text-brand-funk">Category</span>
            </h2>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-funk hover:text-brand-funkDark"
          >
            View all products
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
        </div>

        {/* 4 in a row on desktop, 2 on phones */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-7 md:gap-x-6">
          {CARDS.map((c) => (
            <Link key={c.name} href={c.href} className="group flex flex-col items-center text-center">
              {/* Arched farm window */}
              {/* Arched farm window. The arch is narrower than the farm photo, so the photo always
                  shows at its full height (only the sides are trimmed). That keeps the stone's top
                  surface at the same height (back edge ~75%, front lip ~86%) in every card size, and
                  the product lines up with it. Nothing in the arch moves on hover, so the product
                  never slides off the stone. */}
              <div className="relative w-full h-[190px] sm:h-[210px] md:h-[230px] rounded-t-[999px] rounded-b-[28px] overflow-hidden isolate ring-1 ring-brand-line transition-shadow duration-500 group-hover:ring-brand-funk/40 group-hover:shadow-[0_22px_36px_-22px_rgba(31,45,36,0.45)]">
                <Image
                  src="/images/background.png"
                  alt=""
                  aria-hidden
                  fill
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-[53%_center] opacity-85"
                />
                {/* Light wash at the top so the product reads clearly against the sky */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/10 to-transparent" />

                {/* Contact shadow on the stone, right under the product */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[13.5%] w-[34%] h-[5%] rounded-[50%] bg-[#3A2A18]/45 blur-[5px]" />

                {/* Product standing on the middle of the stone's top surface */}
                <div className="absolute inset-x-[20%] top-[8%] bottom-[15%]">
                  <Image
                    src={c.image as string}
                    alt={c.name}
                    fill
                    sizes="(max-width: 1024px) 35vw, 18vw"
                    className="object-contain object-bottom drop-shadow-[0_3px_4px_rgba(31,45,36,0.25)]"
                  />
                </div>
              </div>

              {/* Name + link */}
              <h3 className="mt-4 font-hero font-bold text-brand-ink text-xl md:text-2xl leading-tight group-hover:text-brand-funk transition-colors">
                {c.name}
              </h3>
              <p className="mt-0.5 text-xs md:text-sm text-brand-muted">{c.tagline}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 text-[11px] md:text-xs font-bold uppercase tracking-[0.16em] text-brand-tan group-hover:text-brand-funk transition-colors">
                Shop now
                <ArrowRight size={13} strokeWidth={2.25} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
