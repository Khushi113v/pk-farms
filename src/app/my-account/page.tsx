"use client";
import { useEffect, useState } from "react";
import { User, Mail, Phone, Cake, Heart } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useProfile, type Profile } from "@/lib/profile-context";

const INPUT =
  "w-full h-12 pl-11 pr-4 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm";
const ICON = "absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted";
const LABEL = "block text-xs font-semibold text-brand-ink mb-1.5";

export default function MyAccountPage() {
  const { profile, saveProfile, hydrated } = useProfile();
  const [form, setForm] = useState<Profile>(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (hydrated) setForm(profile);
  }, [hydrated, profile]);

  const set = (k: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSaved(false);
    setForm((f) => ({ ...f, [k]: e.target.value }));
  };
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <Breadcrumb title="My Profile" items={[{ label: "My Profile" }]} />

      <section className="py-10 md:py-16 bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-funk">Account</p>
            <h1 className="mt-2 font-display font-medium text-brand-ink text-2xl md:text-3xl">My Profile</h1>
            <p className="mt-2 text-sm text-brand-muted">Manage your personal information and preferences.</p>
          </div>

          <div className="bg-white border border-brand-line rounded-2xl p-5 md:p-6">
            <h2 className="font-display font-medium text-brand-ink text-lg mb-5">Personal Information</h2>
            <form
              className="grid sm:grid-cols-2 gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                saveProfile(form);
                setSaved(true);
              }}
            >
              <div>
                <label className={LABEL}>Full name</label>
                <div className="relative">
                  <User size={16} className={ICON} />
                  <input type="text" value={form.name} onChange={set("name")} className={INPUT} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Email</label>
                <div className="relative">
                  <Mail size={16} className={ICON} />
                  <input type="email" value={form.email} onChange={set("email")} className={INPUT} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={LABEL}>Phone number</label>
                <div className="relative">
                  <Phone size={16} className={ICON} />
                  <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={set("phone")} className={INPUT} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Date of birth</label>
                <div className="relative">
                  <Cake size={16} className={ICON} />
                  <input type="date" max={today} value={form.dob} onChange={set("dob")} className={INPUT} />
                </div>
              </div>
              <div>
                <label className={LABEL}>Anniversary</label>
                <div className="relative">
                  <Heart size={16} className={ICON} />
                  <input type="date" value={form.anniversary} onChange={set("anniversary")} className={INPUT} />
                </div>
              </div>
              <p className="sm:col-span-2 -mt-1 text-xs text-brand-muted">
                Add both dates and we will send you a gift on your birthday and anniversary.
              </p>
              <div className="sm:col-span-2 flex items-center gap-4">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center h-11 px-8 rounded-full text-white font-medium tracking-wide text-sm transition-colors bg-brand-funk hover:bg-brand-funkDark"
                >
                  Save Changes
                </button>
                {saved && <span className="text-sm text-emerald-600">Saved</span>}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
