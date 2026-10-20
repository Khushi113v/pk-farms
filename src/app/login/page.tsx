"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, KeyRound, ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { useProfile } from "@/lib/profile-context";

const INPUT =
  "w-full h-12 pl-11 pr-4 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm";
const ICON = "absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted";
const BUTTON =
  "group mx-auto flex items-center justify-center gap-2 h-12 px-10 rounded-full text-white font-medium tracking-wide text-base transition-colors bg-brand-funk hover:bg-brand-funkDark";

export default function LoginPage() {
  const router = useRouter();
  const { profile, saveProfile } = useProfile();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [wait, setWait] = useState(0);

  // Resend countdown
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);

  const sendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    // TODO: call the SMS/OTP service here so the code reaches +91 {mobile}
    setOtpSent(true);
    setWait(30);
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setError("");
    // TODO: verify the OTP with the server before signing the customer in
    saveProfile({ ...profile, name: name.trim(), phone: mobile });
    router.push("/my-account");
  };

  return (
    <>
      <Breadcrumb title="Sign In" items={[{ label: "Sign In" }]} />
      <section className="min-h-[calc(100vh-68px)] flex items-center justify-center bg-brand-cream py-14 px-4">
        <div className="w-full max-w-xl">
          <div className="text-center mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-funk">Sign In</p>
            <h1 className="mt-2 font-display font-medium text-brand-ink text-3xl md:text-4xl">Welcome to PK Farms</h1>
            <p className="mt-2 text-sm text-brand-muted">
              {otpSent ? `We sent a 6-digit OTP to +91 ${mobile}.` : "Enter your name and mobile number to get an OTP."}
            </p>
          </div>

          <div className="bg-white border border-brand-line rounded-3xl p-6 sm:p-10">
            {!otpSent ? (
              <form onSubmit={sendOtp} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-brand-ink mb-1.5">
                    Name
                  </label>
                  <div className="relative">
                    <User size={16} className={ICON} />
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className={INPUT}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="mobile" className="block text-xs font-semibold text-brand-ink mb-1.5">
                    Mobile number
                  </label>
                  <div className="relative">
                    <Phone size={16} className={ICON} />
                    <input
                      id="mobile"
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit mobile number"
                      className={INPUT}
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <button type="submit" className={BUTTON}>
                  Send OTP
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-5">
                <div>
                  <label htmlFor="otp" className="block text-xs font-semibold text-brand-ink mb-1.5">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <KeyRound size={16} className={ICON} />
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      required
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="6-digit OTP"
                      className={`${INPUT} tracking-[0.4em]`}
                    />
                  </div>
                </div>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <button type="submit" className={BUTTON}>
                  Verify &amp; Sign In
                  <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                </button>

                <p className="text-center text-sm text-brand-muted">
                  {wait > 0 ? (
                    <>Resend OTP in {wait}s</>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setWait(30)}
                      className="font-semibold text-brand-funk hover:text-brand-ink transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                  <span className="mx-2">·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setOtp("");
                      setError("");
                    }}
                    className="font-semibold text-brand-funk hover:text-brand-ink transition-colors"
                  >
                    Change number
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
