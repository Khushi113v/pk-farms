"use client";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Youtube } from "lucide-react";

type FooterLink = { label: string; href: string };

const STYLE_LINKS = (category: string): FooterLink[] => [
  { label: "Glass Jar", href: `/shop?category=${category}&style=jar` },
  { label: "Tin", href: `/shop?category=${category}&style=tin` },
  { label: "Pouch", href: `/shop?category=${category}&style=pouch` },
  { label: "Gift Combo", href: `/shop?category=${category}&style=combo` },
];

const COLUMNS: { title: string; href?: string; links: FooterLink[] }[] = [
  { title: "Ghee", href: "/shop?category=ghee", links: STYLE_LINKS("ghee") },
  { title: "Honey", href: "/shop?category=honey", links: STYLE_LINKS("honey") },
  {
    title: "Discover",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Blogs", href: "/blog" },
      { label: "FAQs", href: "/faq" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "My Account", href: "/my-account" },
      { label: "Track Order", href: "/my-orders" },
      { label: "Wishlist", href: "/wishlist" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Shipping & Return Policy", href: "/shipping-returns" },
      { label: "Refund & Cancellation", href: "/refund-cancellation" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
    ],
  },
];

const SOCIALS = [
  { Icon: Instagram, label: "Instagram", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Youtube, label: "YouTube", href: "#" },
];

export default function Footer() {
  return (
    // Background matches the sky of the illustration below so the two blend seamlessly
    <footer className="relative bg-[#FBF1D7] border-t border-brand-line">
      {/* Link columns + newsletter */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 md:pt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(5,minmax(0,1fr))_1.6fr] gap-x-6 gap-y-10">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className="font-body text-[12px] uppercase tracking-[0.22em] text-brand-funk mb-5">
              {col.href ? (
                <Link href={col.href} className="hover:text-brand-funkDark transition-colors">
                  {col.title}
                </Link>
              ) : (
                col.title
              )}
            </h4>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[15px] text-brand-ink/85 hover:text-brand-funk transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Social links */}
        <div>
          <h4 className="font-body text-[12px] uppercase tracking-[0.22em] text-brand-funk mb-5">Follow us</h4>
          <p className="text-[15px] text-brand-ink/85 leading-relaxed mb-4">Fresh stock and farm stories, first on Instagram.</p>
          <div className="flex items-center gap-4">
            {SOCIALS.map(({ Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                aria-label={label}
                className="text-brand-funk/80 hover:text-brand-funk transition-colors"
              >
                <Icon size={22} strokeWidth={1.5} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Illustrated landscape with the copyright resting in its sky */}
      <div className="relative mt-6 md:mt-4">
        <Image
          src="/images/tradition.svg"
          alt="Illustration of Himalayan mountains and pine forests"
          width={2048}
          height={768}
          sizes="100vw"
          className="w-full h-auto min-h-[180px] object-cover object-bottom [mask-image:linear-gradient(to_bottom,transparent_0%,#000_10%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,#000_10%)]"
        />
        <p className="absolute top-3 md:top-6 inset-x-0 px-4 text-center text-xs md:text-[13px] text-brand-ink/80">
          © {new Date().getFullYear()} PK Farms. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
