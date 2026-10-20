import type { Metadata } from "next";
import Image from "next/image";
import { Sparkles, Compass, Target, HeartHandshake } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import BrandBackdrop, { BRAND_BACKDROP_BG } from "@/components/common/BrandBackdrop";

export const metadata: Metadata = {
  title: "About Us — PK Farms",
  description:
    "PK Farms — A2 desi cow ghee, raw honey, wood pressed oils and pure spices. 100% natural, no preservatives.",
};

const PILLARS = [
  {
    icon: Compass,
    title: "Our Vision",
    desc: "A kitchen in every home stocked with food that is pure, honest and traceable to the farm it came from.",
    accent: "#0B5B36",
    accentSoft: "#E7F0E4",
  },
  {
    icon: Target,
    title: "Our Mission",
    desc: "To bring pure, natural food to every table, with fair prices for the farmer and quality you can trust.",
    accent: "#C4553C",
    accentSoft: "#EEF3E6",
  },
  {
    icon: HeartHandshake,
    title: "Our Promise",
    desc: "No preservatives, no added colour and no shortcuts, so every jar and bottle is one you will want to buy again.",
    accent: "#A67C2E",
    accentSoft: "#F5EBD9",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <Breadcrumb title="About Us" items={[{ label: "About Us" }]} />

      {/* Intro section — image one side, content other side */}
      <section className={`relative ${BRAND_BACKDROP_BG} py-9 md:py-12 overflow-hidden`}>
        <BrandBackdrop />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative aspect-[4/3.9] rounded-3xl overflow-hidden border border-brand-line">
                <Image
                  src="/images/products/ghee.png"
                  alt="PK Farms Pure Desi Cow Ghee"
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="object-cover object-center"
                />
              </div>
              {/* Decorative sticker */}
              <span
                className="hidden md:inline-flex absolute -bottom-5 -right-5 items-center gap-2 bg-white border border-brand-line rounded-2xl px-4 py-2.5 font-display font-medium text-brand-ink text-sm"
              >
                <Sparkles size={16} className="text-brand-funk" strokeWidth={2.5} />
                Made with care
              </span>
            </div>

            {/* Content */}
            <div>
              <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-brand-strip px-3 py-1.5 rounded-full border border-brand-funk/30">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-funk" />
                About PK Farms
              </span>
              <h1 className="mt-4 font-display font-medium text-brand-ink text-[30px] sm:text-4xl md:text-5xl leading-[1.08]">
                Pure food,{" "}
                <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
                  sourced
                </span>{" "}
                with care.
              </h1>

              <div className="mt-5 space-y-4 text-brand-muted text-[15px] md:text-base leading-relaxed">
                <p>
                  PK Farms began with a simple belief: everyday food should be pure.
                  The ghee on your roti, the honey in your tea and the oil in your
                  kadhai should be exactly what the label says, and nothing more.
                </p>
                <p>
                  Our range is small and carefully made: A2 desi cow ghee from the
                  bilona process, raw wild honey, groundnut oil from a wooden cold
                  press and pure, aromatic heeng. Every product is 100% natural with
                  no preservatives.
                </p>
                <p>
                  From a spoon of ghee on hot rotis to a pinch of heeng in your tadka,
                  we want you to taste the difference. We keep listening to our
                  customers, so every batch is a little better than the last.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Promise */}
      <section className="relative py-9 md:py-12 overflow-hidden bg-white">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-brand-strip px-3 py-1.5 rounded-full border border-brand-funk/30">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-funk" />
              What drives us
            </span>
            <h2 className="mt-4 font-display font-medium text-brand-ink text-[28px] sm:text-4xl md:text-5xl leading-[1.05]">
              The{" "}
              <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
                why
              </span>{" "}
              behind PK Farms.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-7">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="group relative flex flex-col items-center text-center bg-white rounded-2xl p-7 md:p-8 pt-8 border transition-all duration-300"
                  style={{
                    borderColor: `${p.accent}40`,
                  }}
                >
                  <span
                    className="relative grid place-items-center w-[60px] h-[60px] md:w-[68px] md:h-[68px] rounded-2xl border-2 -mt-[52px] bg-white"
                    style={{ borderColor: p.accent }}
                  >
                    <span
                      className="absolute inset-1 rounded-xl"
                      style={{ backgroundColor: p.accentSoft }}
                      aria-hidden
                    />
                    <Icon
                      size={24}
                      strokeWidth={2}
                      style={{ color: p.accent }}
                      className="relative group-hover:scale-110 transition-transform"
                    />
                  </span>

                  <h3 className="mt-5 font-display font-medium text-brand-ink text-lg md:text-[20px] leading-[1.15]">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-brand-muted text-sm leading-relaxed">
                    {p.desc}
                  </p>

                  <span
                    aria-hidden
                    className="mt-4 block h-[3px] rounded-full w-8 group-hover:w-20 transition-all duration-500"
                    style={{
                      background: `${p.accent}`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
