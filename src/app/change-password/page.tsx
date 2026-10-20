"use client";
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function ChangePasswordPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <Breadcrumb
        title="Change Password"
        items={[{ label: "My Profile", href: "/my-account" }, { label: "Change Password" }]}
      />

      <section className="py-10 md:py-16 bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-funk">Security</p>
            <h1 className="mt-2 font-display font-medium text-brand-ink text-2xl md:text-3xl">
              Change Password
            </h1>
            <p className="mt-2 text-sm text-brand-muted">
              Choose a strong password you don&apos;t use for other accounts.
            </p>
          </div>

          <div className="bg-white border border-brand-line rounded-2xl p-6 sm:p-8">
            <form className="grid gap-5">
              <div>
                <label className="block text-xs font-semibold text-brand-ink mb-1.5">Old password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input
                    type={showOld ? "text" : "password"}
                    placeholder="Enter old password"
                    className="w-full h-12 pl-11 pr-11 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld((s) => !s)}
                    aria-label={showOld ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink transition-colors"
                  >
                    {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-ink mb-1.5">New password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="Enter new password"
                    className="w-full h-12 pl-11 pr-11 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    aria-label={showNew ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink transition-colors"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-ink mb-1.5">Confirm password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter new password"
                    className="w-full h-12 pl-11 pr-11 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink transition-colors"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center h-12 px-9 rounded-full text-white font-medium tracking-wide text-basetransition-colors bg-brand-funk hover:bg-brand-funkDark"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
