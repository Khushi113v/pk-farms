"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
    <Breadcrumb title="Forgot Password" items={[{ label: "Sign In", href: "/login" }, { label: "Forgot Password" }]} />
    <section className="min-h-[calc(100vh-68px)] flex items-center justify-center bg-brand-cream py-14 px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-funk">Reset Password</p>
          <h1 className="mt-2 font-display font-medium text-brand-ink text-3xl md:text-4xl">
            Forgot your password?
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            Enter your email and we&apos;ll send you a link to reset it.
          </p>
        </div>

        <div className="bg-white border border-brand-line rounded-3xl p-6 sm:p-10">
          {sent ? (
            <div className="text-center py-4">
              <div className="mx-auto w-14 h-14 rounded-full bg-brand-strip grid place-items-center mb-4">
                <CheckCircle2 size={28} className="text-brand-funk" />
              </div>
              <h2 className="font-display font-medium text-brand-ink text-lg">Check your inbox</h2>
              <p className="mt-2 text-sm text-brand-muted">
                If an account exists for that email, we&apos;ve sent a link to reset your password.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-brand-ink mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full h-12 pl-11 pr-4 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="group mx-auto flex items-center justify-center gap-2 h-12 px-10 rounded-full text-white font-medium tracking-wide text-basetransition-colors bg-brand-funk hover:bg-brand-funkDark"
              >
                Send Reset Link
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-brand-muted">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 font-semibold text-brand-funk hover:text-brand-ink transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Sign In
          </Link>
        </p>
      </div>
    </section>
    </>
  );
}
