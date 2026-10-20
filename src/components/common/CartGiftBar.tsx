"use client";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { GIFT_MILESTONES, giftProgress } from "@/lib/gift-milestones";

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

// Slim free-gift progress for the top of the side cart: price chips, photos on a line, gift names
export default function CartGiftBar() {
  const { subtotal } = useCart();
  const nextIdx = GIFT_MILESTONES.findIndex((m) => subtotal < m.threshold);

  return (
    <div className="px-5 pt-2 pb-1.5 border-b border-brand-line bg-white">
      <div className="relative grid grid-cols-4">
        {/* Line through the centres of the photos */}
        <div className="absolute top-[35px] left-[12.5%] right-[12.5%] h-[2px] rounded-full bg-brand-line">
          <div className="h-full rounded-full bg-brand-funk transition-all duration-500" style={{ width: `${giftProgress(subtotal)}%` }} />
        </div>

        {GIFT_MILESTONES.map((m, i) => {
          const unlocked = subtotal >= m.threshold;
          return (
            <div key={m.threshold} className="relative flex flex-col items-center text-center">
              <span
                className={`h-[18px] px-1.5 rounded text-[10px] font-semibold leading-[18px] ${
                  unlocked ? "bg-brand-funk text-white" : "bg-brand-strip text-brand-funk"
                }`}
              >
                {inr(m.threshold)}
              </span>
              <span
                className={`relative mt-1 w-[26px] h-[26px] rounded-full overflow-hidden border-2 bg-white ${
                  unlocked ? "border-brand-funk" : nextIdx === i ? "border-brand-funk/50" : "border-brand-line"
                }`}
              >
                <Image
                  src={m.image}
                  alt=""
                  fill
                  sizes="26px"
                  className={`object-cover ${unlocked ? "" : "grayscale opacity-60"}`}
                  style={{ objectPosition: m.position }}
                />
              </span>
              <span
                className={`mt-1 px-0.5 text-[10px] leading-[1.15] line-clamp-2 ${
                  unlocked ? "font-semibold text-brand-funk" : "text-brand-muted"
                }`}
              >
                {m.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
