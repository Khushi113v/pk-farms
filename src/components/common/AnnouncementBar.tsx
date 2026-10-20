"use client";
import { Leaf, Truck, Heart, Gift, ShieldCheck, Sparkles } from "lucide-react";

const ITEMS = [
  { icon: Leaf, text: "Pure pahadi ghee, honey and masalas from the Himalayas" },
  { icon: Truck, text: "Free delivery on orders above ₹999" },
  { icon: Heart, text: "Loved by families across India" },
  { icon: Gift, text: "Combo offers inside — save more on every pack" },
  { icon: ShieldCheck, text: "Lab-tested, no preservatives, no added colour" },
  { icon: Sparkles, text: "Earn 2% loyalty points on every order" },
];

// Duplicate for a seamless marquee loop
const LOOP = [...ITEMS, ...ITEMS];

export default function AnnouncementBar() {
  return (
    <div
      className="relative text-white overflow-hidden bg-brand-funk hover:bg-brand-funkDark"
    >
      <div className="relative flex items-center h-10 overflow-hidden">
        <div className="flex items-center gap-10 whitespace-nowrap animate-marquee will-change-transform">
          {LOOP.map(({ icon: Icon, text }, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 text-[13px] md:text-sm font-semibold tracking-wide text-white"
            >
              <Icon size={16} strokeWidth={2} className="text-white/95" />
              <span>{text}</span>
              <span aria-hidden className="text-white/50 mx-2">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
