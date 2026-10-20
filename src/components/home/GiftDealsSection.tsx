"use client";
import { useCart } from "@/lib/cart-context";
import Image from "next/image";
import Link from "next/link";
import { Gift } from "lucide-react";
import { GIFT_MILESTONES, giftProgress } from "@/lib/gift-milestones";

const MILESTONES = GIFT_MILESTONES;

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function GiftDealsSection() {
  const { subtotal } = useCart();

  const nextLockedIdx = MILESTONES.findIndex((m) => subtotal < m.threshold);
  const allUnlocked = nextLockedIdx === -1;
  const nextMilestone = !allUnlocked ? MILESTONES[nextLockedIdx] : null;
  const amountNeeded = nextMilestone ? nextMilestone.threshold - subtotal : 0;

  const progressPct = giftProgress(subtotal);

  return (
    <section className="py-6 md:py-9 bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
        <div className="text-center mb-5 md:mb-6">
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-brand-strip px-3 py-1.5 rounded-full">
            <Gift size={14} strokeWidth={2} />
            Spend more, gift more
          </span>
          <h2 className="mt-2.5 font-display font-medium text-brand-ink text-[26px] sm:text-3xl md:text-4xl leading-[1.05]">
            Shop more, unlock{" "}
            <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">free gifts</span>.
          </h2>
          <p className="mt-2 text-sm text-brand-muted">
            Every milestone you reach adds a gift to your order, on us.
          </p>
        </div>

        {/* ── Gifts + progress line ── */}
        <div className="relative">
          {/* Line between the first and the last photo (centres of the outer columns) */}
          <div className="absolute top-[28px] sm:top-[42px] left-[12.5%] right-[12.5%] h-[3px] rounded-full bg-brand-line">
            <div className="h-full rounded-full bg-brand-funk transition-all duration-700" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="relative grid grid-cols-4 gap-x-1.5 sm:gap-x-4">
            {MILESTONES.map((m, i) => {
              const unlocked = subtotal >= m.threshold;
              const isNext = nextLockedIdx === i;
              return (
                <div key={m.threshold} className="flex flex-col items-center text-center">
                  <div
                    className={`relative z-10 w-[58px] h-[58px] sm:w-[88px] sm:h-[88px] rounded-full overflow-hidden border-2 sm:border-[3px] bg-white transition-all duration-500 ${
                      unlocked ? "border-brand-funk" : isNext ? "border-brand-funk/50" : "border-brand-line"
                    }`}
                  >
                    <Image
                      src={m.image}
                      alt={m.label}
                      fill
                      sizes="(max-width: 640px) 58px, 88px"
                      className={`object-cover transition-all duration-500 ${
                        unlocked ? "" : "grayscale opacity-60"
                      }`}
                      style={{ objectPosition: m.position }}
                    />
                  </div>

                  <span
                    className={`mt-2 sm:mt-3 font-display font-medium text-[13px] sm:text-lg leading-none ${
                      unlocked ? "text-brand-funk" : "text-brand-ink"
                    }`}
                  >
                    {inr(m.threshold)}
                  </span>

                  <p className={`mt-1.5 sm:mt-2 text-[10.5px] sm:text-[13px] font-semibold leading-tight sm:leading-snug ${unlocked || isNext ? "text-brand-ink" : "text-brand-muted"}`}>
                    {m.label}
                  </p>
                  <p className="hidden sm:block mt-0.5 text-[11px] text-brand-muted leading-snug">{m.subLabel}</p>

                  {unlocked ? (
                    <span className="mt-1.5 sm:mt-2 inline-block text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider text-white bg-brand-funk px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                      Unlocked
                    </span>
                  ) : isNext ? (
                    <span className="mt-1.5 sm:mt-2 inline-block text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider text-brand-funk bg-brand-strip px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                      Next gift
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Status ── */}
        <div className="mt-6 text-center">
          {allUnlocked ? (
            <p className="text-sm font-semibold text-brand-funk">You have unlocked every free gift. Happy shopping!</p>
          ) : subtotal === 0 ? (
            <p className="text-sm text-brand-muted">
              Add items worth <span className="font-semibold text-brand-funk">{inr(MILESTONES[0].threshold)}</span> to unlock your first
              gift: <strong className="text-brand-ink">{MILESTONES[0].label}</strong>
            </p>
          ) : (
            <p className="text-sm text-brand-muted">
              Add <span className="font-semibold text-brand-funk">{inr(amountNeeded)} more</span> to unlock your next gift:{" "}
              <strong className="text-brand-ink">{nextMilestone!.label}</strong>
            </p>
          )}

          <Link
            href="/shop"
            className="mt-3 inline-flex items-center gap-2 h-10 px-6 rounded-full text-white text-sm font-medium tracking-wide bg-brand-funk hover:bg-brand-funkDark transition-colors"
          >
            <Gift size={15} strokeWidth={2} />
            Shop now &amp; earn gifts
          </Link>
        </div>
      </div>
    </section>
  );
}
