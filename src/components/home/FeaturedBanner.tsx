import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, Droplets, ShieldCheck } from "lucide-react";
import { getProductBySlug } from "@/lib/product-data";

const PRODUCT = getProductBySlug("wood-pressed-groundnut-oil");

const POINTS = [
  { Icon: Droplets, label: "Wood cold pressed" },
  { Icon: Leaf, label: "Unrefined" },
  { Icon: ShieldCheck, label: "No chemicals" },
];

// Rotating round seal, drawn with SVG text on a circle
function Seal() {
  return (
    <div className="relative w-[92px] h-[92px] md:w-[110px] md:h-[110px] rounded-full bg-white/85 backdrop-blur-sm shadow-[0_12px_28px_-14px_rgba(31,45,36,0.45)] grid place-items-center">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-[spin_18s_linear_infinite]" aria-hidden>
        <defs>
          <path id="seal-circle" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-brand-funk" style={{ fontSize: 9.5, letterSpacing: 2.6, fontWeight: 700 }}>
          <textPath href="#seal-circle">WOOD PRESSED • KACHI GHANI • PURE •</textPath>
        </text>
      </svg>
      <span className="grid place-items-center w-11 h-11 md:w-12 md:h-12 rounded-full bg-brand-funk text-white">
        <Droplets size={20} strokeWidth={1.75} />
      </span>
    </div>
  );
}

// Promotional banner: the wooden oil press scene, text on the open wall, the bottle standing on the table.
// From large screens up the banner keeps the photo's own proportions (2048 × 768), so the table top
// sits at the same height (~80% down) and the bottle's position always lines up with it.
export default function FeaturedBanner() {
  return (
    <section className="relative bg-white py-6 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[28px] overflow-hidden bg-[#F6EAD0] flex flex-col md:block md:h-[500px] lg:h-auto lg:aspect-[2048/768]">
          {/* Scene */}
          <div className="relative h-[280px] sm:h-[340px] md:absolute md:inset-0 md:h-auto">
            <Image
              src="/images/peanut-background.png"
              alt="Traditional wooden oil press with groundnuts and a bowl of oil on a rustic table"
              fill
              sizes="(min-width: 1280px) 1216px, 100vw"
              className="object-cover object-[78%_center] md:object-right lg:object-center"
            />
            {/* Light wash on the left so the text reads on the wall */}
            <div className="hidden md:block absolute inset-0 bg-[linear-gradient(to_right,rgba(250,243,228,0.92)_0%,rgba(250,243,228,0.7)_32%,rgba(250,243,228,0)_55%)]" />
            {/* Phones: fade into the text area below */}
            <div className="md:hidden absolute inset-0 bg-[linear-gradient(to_top,#F6EAD0_0%,rgba(246,234,208,0)_30%)]" />

            {/* Bottle standing on the table */}
            {PRODUCT && (
              <Link
                href={`/products/${PRODUCT.slug}`}
                aria-label={PRODUCT.name}
                className="absolute left-[-2%] w-[56%] top-[4%] bottom-[9%] sm:left-[4%] sm:w-[44%] md:left-[38%] md:w-[32%] md:top-[8%] md:bottom-[9%] lg:left-[42%] lg:w-[27%]"
              >
                <span className="absolute left-1/2 -translate-x-1/2 bottom-[-1%] w-[70%] h-[5%] rounded-[50%] bg-[#3A2A18]/45 blur-[6px]" />
                <Image
                  src={PRODUCT.image}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 220px, 40vw"
                  className="object-contain object-bottom drop-shadow-[0_6px_8px_rgba(31,45,36,0.25)]"
                />
              </Link>
            )}

            {/* Seal */}
            <div className="absolute right-4 top-4 md:right-auto md:left-[68%] md:top-[8%] lg:left-[62%] lg:top-[10%]">
              <Seal />
            </div>
          </div>

          {/* Text */}
          <div className="relative md:absolute md:inset-y-0 md:left-0 md:w-[46%] lg:w-[42%] flex items-center px-6 pt-2 pb-8 md:p-0 md:pl-12 lg:pl-16">
            <div className="w-full text-center md:text-left">
              <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-brand-tan">Wooden Cold Pressed</p>
              <h2 className="mt-2 md:mt-3 font-hero font-bold text-brand-ink text-[30px] sm:text-[36px] md:text-[38px] lg:text-[46px] leading-[1.08] tracking-[-0.01em]">
                Pressed slow, <span className="italic text-brand-funk">kept pure</span>.
              </h2>
              <p className="mt-3 text-brand-ink/75 text-sm md:text-[15px] leading-relaxed max-w-md mx-auto md:mx-0">
                Extracted the traditional way in a wooden kolhu and left unrefined, so every drop keeps its natural aroma and nutrition.
              </p>

              <ul className="mt-4 md:mt-5 flex flex-wrap justify-center md:justify-start gap-2">
                {POINTS.map(({ Icon, label }) => (
                  <li
                    key={label}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-brand-line px-3 py-1.5 text-[11px] md:text-xs font-semibold text-brand-ink"
                  >
                    <Icon size={14} strokeWidth={2} className="text-brand-funk" />
                    {label}
                  </li>
                ))}
              </ul>

              <div className="mt-5 md:mt-6 flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-3">
                <Link
                  href="/shop?category=oils"
                  className="inline-flex items-center gap-2 h-11 md:h-12 px-7 rounded-full bg-brand-funk hover:bg-brand-funkDark text-white text-sm md:text-[15px] font-semibold tracking-wide shadow-[0_10px_20px_-12px_rgba(11,91,54,0.7)] transition-colors"
                >
                  Shop Now
                  <ArrowRight size={16} strokeWidth={2} />
                </Link>
                {PRODUCT && (
                  <p className="text-sm text-brand-ink/70">
                    Starting at <span className="font-bold text-brand-ink text-base">₹{PRODUCT.price.toLocaleString("en-IN")}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
