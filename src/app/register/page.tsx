"use client";
import { useState } from "react";
import Link from "next/link";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
    <Breadcrumb title="Register" items={[{ label: "Register" }]} />
    <section className="min-h-[calc(100vh-68px)] flex items-center justify-center bg-brand-cream py-14 px-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-7">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-funk">Create Account</p>
          <h1 className="mt-2 font-display font-medium text-brand-ink text-3xl md:text-4xl">
            Join PK Farms
          </h1>
          <p className="mt-2 text-sm text-brand-muted">
            Create an account to track orders and save your favourites.
          </p>
        </div>

        <div className="bg-white border border-brand-line rounded-3xl p-6 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-brand-ink mb-1.5">
                Full name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Priya Sharma"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm"
                />
              </div>
            </div>

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

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-brand-ink mb-1.5">
                Phone number
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  id="phone"
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-brand-ink mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Create a password"
                  className="w-full h-12 pl-11 pr-11 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-ink transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm" className="block text-xs font-semibold text-brand-ink mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                <input
                  id="confirm"
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="Re-enter your password"
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

            <label className="flex items-start gap-2 text-sm text-brand-ink cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-brand-line text-brand-funk focus:ring-brand-funk/40"
              />
              <span>
                I agree to the{" "}
                <Link
                  href="/terms-of-service"
                  className="font-semibold text-brand-funk hover:text-brand-ink transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="font-semibold text-brand-funk hover:text-brand-ink transition-colors"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
              type="submit"
              className="group mx-auto flex items-center justify-center gap-2 h-12 px-10 rounded-full text-white font-medium tracking-wide text-basetransition-colors bg-brand-funk hover:bg-brand-funkDark"
            >
              Create Account
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-brand-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-funk hover:text-brand-ink transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </section>
    </>
  );
}
