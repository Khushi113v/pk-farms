import type { Metadata } from "next";
import Image from "next/image";
import {
  Sparkles,
  Droplets,
  Leaf,
  ShieldCheck,
  RefreshCw,
  Heart,
} from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

export const metadata: Metadata = {
  title: "Why PK Farms? — PK Farms",
  description:
    "Why families choose PK Farms — traditional methods, pure ingredients, direct sourcing and honest packaging.",
};

const PILLARS = [
  {
    icon: Sparkles,
    title: "Traditional methods",
    desc: "Bilona-churned ghee and hand-collected honey, made the way it has been for generations.",
    accent: "#0B5B36",
    accentSoft: "#E7F0E4",
  },
  {
    icon: Droplets,
    title: "Pure ingredients",
    desc: "No preservatives, no added colour, no fillers. Just the food, as nature made it.",
    accent: "#C4553C",
    accentSoft: "#EEF3E6",
  },
  {
    icon: Leaf,
    title: "Honest sourcing",
    desc: "We work closely with farmers and producers, so you know where your food comes from.",
    accent: "#A67C2E",
    accentSoft: "#F5EBD9",
  },
  {
    icon: ShieldCheck,
    title: "Safe packaging",
    desc: "Glass jars and sealed bottles that keep every product fresh.",
    accent: "#08472A",
    accentSoft: "#E7F0E4",
  },
  {
    icon: RefreshCw,
    title: "Easy replacement",
    desc: "If your order arrives damaged, tell us within 48 hours and we will replace it.",
    accent: "#B24A32",
    accentSoft: "#EEF3E6",
  },
  {
    icon: Heart,
    title: "Made with care",
    desc: "Every product is chosen by PK Farms, with your family and your kitchen in mind.",
    accent: "#D9B878",
    accentSoft: "#FBF4E8",
  },
];

export default function WhyPkFarmsPage() {
  return (
    <>
      <Breadcrumb title="Why PK Farms?" items={[{ label: "Why PK Farms?" }]} />

      {/* Pillars grid */}
      <section className="relative py-8 md:py-10 overflow-hidden bg-white">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-brand-strip px-3 py-1.5 rounded-full border border-brand-funk/30">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-funk" />
              What makes us different
            </span>
            <h2 className="mt-4 font-display font-medium text-brand-ink text-[28px] sm:text-4xl md:text-5xl leading-[1.05]">
              Made for every{" "}
              <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
                occasion
              </span>
              .
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-7">
            {PILLARS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="group relative flex flex-col items-center text-center bg-white rounded-2xl p-4 sm:p-6 md:p-8 pt-6 md:pt-8 border transition-all duration-300"
                  style={{
                    borderColor: `${p.accent}40`,
                  }}
                >
                  <span
                    className="relative grid place-items-center w-[52px] h-[52px] md:w-[68px] md:h-[68px] rounded-2xl border-2 -mt-[42px] md:-mt-[52px] bg-white"
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

                  <h3 className="mt-5 font-display font-medium text-brand-ink text-[15px] md:text-[20px] leading-[1.15]">
                    {p.title}
                  </h3>

                  <p className="mt-3 text-brand-muted text-xs md:text-sm leading-relaxed">
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

      {/* Intro — image + content */}
      <section className="relative bg-brand-cream py-8 md:py-10 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.25] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1F2D241F 1px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
            <div className="relative">
              <div className="relative aspect-[4/3.4] rounded-3xl overflow-hidden border border-brand-line">
                <Image
                  src="/images/products/oils.png"
                  alt="PK Farms Wood Pressed Groundnut Oil"
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="object-cover object-center"
                />
              </div>
              <span className="hidden md:inline-flex absolute -bottom-5 -right-5 items-center gap-2 bg-white border border-brand-line rounded-2xl px-4 py-2.5 font-display font-medium text-brand-ink text-sm">
                <Sparkles size={16} className="text-brand-funk" strokeWidth={2.5} />
                Farm to kitchen
              </span>
            </div>

            <div>
              <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-brand-strip px-3 py-1.5 rounded-full border border-brand-funk/30">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-funk" />
                Our approach
              </span>
              <h1 className="mt-4 font-display font-medium text-brand-ink text-[28px] sm:text-4xl md:text-5xl leading-[1.08]">
                Why pure{" "}
                <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
                  food
                </span>{" "}
                matters.
              </h1>

              <div className="mt-5 space-y-4 text-brand-muted text-[15px] md:text-base leading-relaxed">
                <p>
                  What you eat shapes how you feel. Pure food is simple, honest and
                  tastes the way it should, so you can focus on your family and your
                  meals instead of reading long ingredient lists.
                </p>
                <p>
                  That is why we pay attention to the things you notice only when they
                  are missing: the aroma of the ghee, the texture of the honey, the
                  freshness of the spices and a pack that stays sealed and safe.
                </p>
                <p>
                  Every PK Farms product is made to be tasted and trusted, whether
                  it is a spoon of ghee on a busy Monday or a jar of honey for your
                  morning tea.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
