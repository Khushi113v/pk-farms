"use client";
import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, Instagram, Youtube, Facebook } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import BrandBackdrop, { BRAND_BACKDROP_BG } from "@/components/common/BrandBackdrop";

const INFO = [
  {
    icon: Phone,
    title: "Call us",
    lines: ["+91 98765 43210", "Mon–Sat, 10am–7pm"],
    accent: "#0B5B36",
    accentSoft: "#E7F0E4",
  },
  {
    icon: Mail,
    title: "Email us",
    lines: ["hello@pkfarms.in", "We reply within a day"],
    accent: "#C4553C",
    accentSoft: "#EEF3E6",
  },
  {
    icon: MapPin,
    title: "Visit us",
    // TODO: replace with the PK Farms address
    lines: ["PK Farms, [Street address]", "[City, State]", "Pincode: [XXXXXX]"],
    accent: "#A67C2E",
    accentSoft: "#F5EBD9",
  },
  {
    icon: Clock,
    title: "Working hours",
    lines: ["Mon–Sat: 10am – 7pm", "Sunday: Closed"],
    accent: "#08472A",
    accentSoft: "#E7F0E4",
  },
];

export default function ContactUsPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Breadcrumb title="Contact Us" items={[{ label: "Contact Us" }]} />

      <section className={`relative ${BRAND_BACKDROP_BG} py-9 md:py-12 overflow-hidden`}>
        <BrandBackdrop wave={false} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-brand-strip px-3 py-1.5 rounded-full border border-brand-funk/30">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-funk" />
              We&apos;d love to hear from you
            </span>
            <h1 className="mt-4 font-display font-medium text-brand-ink text-[28px] sm:text-4xl md:text-5xl leading-[1.05]">
              Get in{" "}
              <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
                touch
              </span>{" "}
              with us.
            </h1>
            <p className="mt-4 text-brand-muted text-[15px] md:text-base leading-relaxed">
              Questions about a product, an order, or just want to say hi? Our team
              usually replies within a day.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-8 md:gap-10">
            {/* Info cards */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
              {INFO.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 bg-white rounded-2xl p-5 border transition-all duration-300"
                    style={{
                      borderColor: `${item.accent}40`,
                    }}
                  >
                    <span
                      className="shrink-0 grid place-items-center w-12 h-12 rounded-2xl border-2"
                      style={{ borderColor: item.accent, backgroundColor: item.accentSoft }}
                    >
                      <Icon size={20} strokeWidth={2} style={{ color: item.accent }} />
                    </span>
                    <div>
                      <h3 className="font-display font-medium text-brand-ink text-base">
                        {item.title}
                      </h3>
                      {item.lines.map((line) => (
                        <p key={line} className="text-brand-muted text-sm leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Socials */}
              <div className="flex items-center gap-3 bg-white rounded-2xl p-5 border-2 border-brand-line">
                <span className="font-display font-medium text-brand-ink text-sm mr-1">
                  Follow us
                </span>
                {[
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Youtube, label: "YouTube" },
                  { Icon: Facebook, label: "Facebook" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 grid place-items-center rounded-full border border-brand-line text-brand-ink hover:bg-brand-ink hover:text-white hover:border-brand-ink transition"
                  >
                    <Icon size={16} strokeWidth={2} />
                  </a>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-6 md:p-8 border border-brand-line">
              <h2 className="font-display font-medium text-brand-ink text-xl md:text-2xl mb-1">
                Send us a message
              </h2>
              <p className="text-brand-muted text-sm mb-6">
                Fill in the form and we&apos;ll get back to you shortly.
              </p>

              {sent ? (
                <div className="rounded-2xl bg-brand-strip border border-brand-funk/30 p-6 text-center">
                  <p className="font-display font-medium text-brand-ink text-lg">
                    Thanks for reaching out!
                  </p>
                  <p className="text-brand-muted text-sm mt-1">
                    We&apos;ve received your message and will reply within a day.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-brand-ink mb-1.5">
                      Your name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange("name")}
                      placeholder="Priya Sharma"
                      className="w-full h-12 px-4 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-semibold text-brand-ink mb-1.5">
                      Phone number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={handleChange("phone")}
                      placeholder="+91 98765 43210"
                      className="w-full h-12 px-4 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-brand-ink mb-1.5">
                      Email address
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange("email")}
                      placeholder="priya@email.com"
                      className="w-full h-12 px-4 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-brand-ink mb-1.5">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={form.message}
                      onChange={handleChange("message")}
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 rounded-2xl bg-brand-cream border border-brand-line text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15 text-sm resize-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="group inline-flex items-center gap-2 pl-6 pr-2 py-2 rounded-full text-white font-medium tracking-wide text-[15px]transition-colors bg-brand-funk hover:bg-brand-funkDark"
                    >
                      <span>Send message</span>
                      <span className="grid place-items-center w-8 h-8 rounded-full bg-white text-brand-funk border border-brand-line transition-transform">
                        <Send size={14} strokeWidth={2.5} />
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
