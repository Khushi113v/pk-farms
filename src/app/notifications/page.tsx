"use client";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useProfile } from "@/lib/profile-context";
import { getNotifications } from "@/lib/notifications";

export default function NotificationsPage() {
  const { profile, hydrated } = useProfile();
  const items = hydrated ? getNotifications(profile) : [];

  return (
    <>
      <Breadcrumb title="Notifications" items={[{ label: "Notifications" }]} />

      <section className="py-10 md:py-16 bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-funk">Account</p>
            <h1 className="mt-2 font-display font-medium text-brand-ink text-2xl md:text-3xl">Notifications</h1>
            <p className="mt-2 text-sm text-brand-muted">Gifts, offers and updates for you.</p>
          </div>

          <ul className="space-y-3">
            {items.map((n) => {
              const gift = n.kind === "birthday" || n.kind === "anniversary";
              return (
                <li
                  key={n.id}
                  className={`flex items-start gap-4 rounded-2xl border p-4 md:p-5 ${
                    gift ? "bg-[#F4EAD5]/60 border-[#E8D6AC]" : "bg-white border-brand-line"
                  }`}
                >
                  <span className="relative shrink-0 w-16 h-20 rounded-xl overflow-hidden border border-brand-line">
                    <Image src={n.image} alt="" fill sizes="64px" className="object-cover object-top" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-medium text-brand-ink text-base">{n.title}</p>
                    <p className="mt-1 text-sm text-brand-ink/75 leading-relaxed">{n.text}</p>
                    {n.code && (
                      <p className="mt-2 inline-flex items-center rounded-full border border-dashed border-brand-funk/50 bg-white px-3 py-1 text-xs font-semibold tracking-wider text-brand-funk">
                        {n.code}
                      </p>
                    )}
                    {n.kind === "profile" && (
                      <p className="mt-2">
                        <Link href="/my-account" className="text-sm font-medium text-brand-funk underline underline-offset-2">
                          Go to My Profile
                        </Link>
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
