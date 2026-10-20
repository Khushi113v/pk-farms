"use client";
import Link from "next/link";
import { Gift, X } from "lucide-react";
import { useProfile } from "@/lib/profile-context";
import { getNotifications } from "@/lib/notifications";

// Slim strip at the very top of the site when a birthday or anniversary gift is on
export default function OccasionBanner() {
  const { profile, hydrated, dismissedBanner, dismissBanner } = useProfile();
  if (!hydrated) return null;
  const gift = getNotifications(profile).find((n) => n.banner);
  if (!gift || dismissedBanner === gift.id) return null;

  return (
    <div className="bg-[#F4EAD5] text-brand-ink border-b border-[#E8D6AC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-center gap-2 text-[12px] sm:text-[13px]">
        <Gift size={15} strokeWidth={1.75} className="shrink-0 text-[#8A6420]" />
        <p className="truncate">
          <span className="font-semibold">{gift.title}</span>
          <span> Use code </span>
          <span className="font-semibold text-brand-funk">{gift.code}</span>
        </p>
        <Link href="/notifications" className="shrink-0 underline underline-offset-2 text-brand-funk hover:text-brand-funkDark">
          View
        </Link>
        <button
          type="button"
          aria-label="Close"
          onClick={() => dismissBanner(gift.id)}
          className="shrink-0 ml-1 grid place-items-center w-6 h-6 rounded-full hover:bg-white/60"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
