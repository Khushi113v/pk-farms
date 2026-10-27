"use client";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Youtube } from "lucide-react";

type FooterLink = { label: string; href: string };


const COLUMNS: { title: string; href?: string; links: FooterLink[] }[] = [
  {
    title: "Shop",
    href: "/shop",
    links: [
      { label: "Ghee", href: "/shop?category=ghee" },
      { label: "Honey", href: "/shop?category=honey" },
      { label: "Oils", href: "/shop?category=oils" },
      { label: "Spices", href: "/shop?category=spices" },
      { label: "Hampers", href: "/hampers" },
    ],
  },
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
    // Background is the exact colour of the top edge of footer.png, so the two merge seamlessly
    <footer className="relative bg-[#FAECD9] border-t border-brand-line">
      {/* Link columns + newsletter */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 md:pt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_1.4fr] gap-x-6 gap-y-10">
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

      {/* Farm landscape with the copyright resting in its plain sky */}
      <div className="relative mt-2 md:mt-3 w-full h-[220px] sm:h-auto sm:aspect-[2226/706] overflow-hidden">
        <Image
          src="/images/footer.png"
          alt="A pahadi farm at sunrise with beehives, a groundnut field, a farmhouse and a farmer with his cow"
          fill
          sizes="100vw"
          className="object-cover object-bottom"
        />        <p className="absolute top-3 md:top-5 inset-x-0 px-4 text-center text-xs md:text-[13px] text-brand-ink/75">
          © {new Date().getFullYear()} PK Farms. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
