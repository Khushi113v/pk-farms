"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Search,
  User,
  UserCircle,
  ShoppingBag,
  X,
  LogIn,
  Package,
  MapPin,
  Heart,
  Bell,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";
import AnnouncementBar from "./AnnouncementBar";
import OccasionBanner from "@/components/common/OccasionBanner";
import SearchOverlay from "./SearchOverlay";
import { useCart } from "@/lib/cart-context";
import { PRODUCTS, COLLECTIONS, type Product } from "@/lib/product-data";

type NavItem = { label: string; href: string; menu?: "shop" | "category" };

const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop", menu: "shop" },
  { label: "About Us", href: "/about-us" },
  { label: "Shop by Category", href: "/shop", menu: "category" },
  { label: "Blogs", href: "/blog" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact Us", href: "/contact-us" },
];

// Shop menu: a heading per group with its products listed underneath
type ShopGroup = { title: string; href: string; products: Product[] };

const SHOP_GROUPS: ShopGroup[] = [
  ...COLLECTIONS.map((c) => ({
    title: c.label,
    href: `/shop?collection=${c.slug}`,
    products: PRODUCTS.filter((p) => p.collections?.includes(c.slug)),
  })),
  { title: "All Collection", href: "/shop", products: PRODUCTS },
];

function ShopPanel() {
  return (
    <div
      className="absolute left-0 top-full z-30 w-[700px] opacity-0 translate-y-3 invisible pointer-events-none group-hover/shop:opacity-100 group-hover/shop:translate-y-0 group-hover/shop:visible group-hover/shop:pointer-events-auto transition-[opacity,transform,visibility] duration-300 ease-out"
      role="menu"
    >
      <div className="grid grid-cols-3 gap-6 p-5 rounded-2xl bg-white border border-brand-line shadow-card">
        {SHOP_GROUPS.map((g) => (
          <div key={g.title} className="min-w-0">
            <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-brand-line">
              <h4 className="font-display font-semibold text-brand-ink text-[15px]">{g.title}</h4>
              <Link href={g.href} className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-brand-funk hover:text-brand-funkDark">
                View all
                <ChevronRight size={13} strokeWidth={2} />
              </Link>
            </div>
            <ul className="flex flex-col gap-1">
              {g.products.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="group/item flex items-center gap-2.5 rounded-xl p-1.5 -mx-1.5 hover:bg-brand-cream transition-colors"
                  >
                    <span className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-brand-line bg-white">
                      <Image src={p.image} alt="" fill sizes="40px" className="object-contain p-0.5" />
                    </span>
                    <span className="min-w-0 text-sm leading-snug text-brand-ink group-hover/item:text-brand-funk transition-colors">{p.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

type MegaItem = {
  name: string;
  hint: string;
  image: string;
  href: string;
  subs?: { label: string; href: string }[];
};

const SHOP_MENU: MegaItem[] = [
  {
    name: "Ghee",
    hint: "A2 desi cow ghee, bilona process",
    image: "/images/products/ghee.png",
    href: "/shop?category=ghee",
  },
  {
    name: "Honey",
    hint: "Raw, unprocessed wild honey",
    image: "/images/products/honey.png",
    href: "/shop?category=honey",
  },
  {
    name: "Oils",
    hint: "Wooden cold pressed oils",
    image: "/images/products/oils.png",
    href: "/shop?category=oils",
  },
  {
    name: "Spices",
    hint: "Pure, aromatic heeng",
    image: "/images/products/spices.png",
    href: "/shop?category=spices",
  },
];

function MegaPanel({ items }: { items: MegaItem[] }) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[760px] origin-top opacity-0 translate-y-3 invisible pointer-events-none group-hover/mega:opacity-100 group-hover/mega:translate-y-0 group-hover/mega:visible group-hover/mega:pointer-events-auto transition-[opacity,transform,visibility] duration-300 ease-out"
      role="menu"
    >
      <div className="grid grid-cols-4 gap-4 p-4 rounded-2xl bg-white border border-brand-line">
        {items.map((c) => (
          <div key={c.name} className="flex flex-col">
            <Link href={c.href} className="group/card block">
              <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-brand-soft">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="260px"
                  className="object-cover object-center group-hover/card:scale-105 transition-transform duration-500"
                />
              </div>
              <h4 className="mt-3 font-display text-brand-funk text-lg leading-tight">
                {c.name}
              </h4>
              <p className="text-xs text-brand-muted">{c.hint}</p>
            </Link>
            {c.subs && (
              <ul className="mt-2 flex flex-col">
                {c.subs.map((s) => (
                  <li key={s.label}>
                    <Link
                      href={s.href}
                      className="group/sub flex items-center gap-1.5 py-1 text-sm text-brand-ink hover:text-brand-funk transition-colors"
                    >
                      <ChevronRight
                        size={14}
                        strokeWidth={1.75}
                        className="text-brand-funk/70 transition-transform group-hover/sub:translate-x-0.5"
                      />
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const ACCOUNT_LINKS = [
  { icon: LogIn, label: "Login", href: "/login" },
  { icon: UserCircle, label: "My Profile", href: "/my-account" },
  { icon: Package, label: "My Orders", href: "/my-orders" },
  { icon: Heart, label: "My Wishlist", href: "/wishlist" },
  { icon: MapPin, label: "My Addresses", href: "/my-addresses" },
  { icon: Bell, label: "Notifications", href: "/notifications" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [mobileExpand, setMobileExpand] = useState<string | null>(null);
  const [mobileCat, setMobileCat] = useState<string | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { count, openCart } = useCart();
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40">
      {/* Marquee announcement strip */}
      <OccasionBanner />
      <AnnouncementBar />

      {/* Main bar */}
      <div className="bg-brand-cream border-b border-brand-line">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-[72px] md:h-[88px] flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 shrink-0" aria-label="PK Farms — home">
            <Image
              src="/images/logos/pk-farms-logo.png"
              alt="PK Farms"
              width={479}
              height={457}
              priority
              className="h-14 md:h-[76px] w-auto mix-blend-multiply"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex self-stretch items-center gap-4 xl:gap-7">
            {NAV.map((item) => {
              // "Shop" and "Shop by Category" share /shop; only "Shop" shows as active
              const active = item.menu !== "category" && isActive(item.href);
              const linkCls = `relative flex items-center gap-1 py-2 text-[15px] tracking-wide transition-colors after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-px after:bg-brand-funk after:transition-transform after:origin-left ${
                active
                  ? "text-brand-funk after:scale-x-100"
                  : "text-brand-ink hover:text-brand-funk after:scale-x-0 hover:after:scale-x-100"
              }`;

              if (!item.menu) {
                return (
                  <Link key={item.label} href={item.href} className={linkCls}>
                    {item.label}
                  </Link>
                );
              }

              // Shop: full-width panel; the wrapper spans the bar height so the pointer can reach the panel
              if (item.menu === "shop") {
                return (
                  <div key={item.label} className="group/shop relative h-full flex items-center">
                    <Link href={item.href} className={linkCls}>
                      <span>{item.label}</span>
                      <ChevronDown
                        size={14}
                        strokeWidth={1.75}
                        className="mt-0.5 transition-transform group-hover/shop:rotate-180"
                      />
                    </Link>
                    <ShopPanel />
                  </div>
                );
              }

              return (
                <div key={item.label} className="relative group/mega">
                  <Link href={item.href} className={linkCls}>
                    <span>{item.label}</span>
                    <ChevronDown
                      size={14}
                      strokeWidth={1.75}
                      className="mt-0.5 transition-transform group-hover/mega:rotate-180"
                    />
                  </Link>

                  <MegaPanel items={SHOP_MENU} />
                </div>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2 shrink-0">
            <button
              aria-label="Search"
              onClick={() => {
                setOpen(false);
                setAccountOpen(false);
                setSearchOpen(true);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full text-brand-ink hover:bg-brand-soft transition"
            >
              <Search size={20} strokeWidth={1.5} />
            </button>
            <div className="relative group/account">
              <button
                aria-label="Account"
                onClick={() => {
                  setOpen(false);
                  setMobileExpand(null);
                  setAccountOpen((s) => !s);
                }}
                className="grid w-9 h-9 sm:w-10 sm:h-10 place-items-center rounded-full text-brand-ink hover:bg-brand-soft transition"
              >
                <User size={20} strokeWidth={1.5} />
              </button>

              {/* Dropdown — hover on desktop, click/tap on mobile */}
              <div
                className={`absolute right-0 top-full pt-3 w-[210px] z-20 transition-all duration-200 lg:group-hover/account:opacity-100 lg:group-hover/account:translate-y-0 lg:group-hover/account:visible lg:group-hover/account:pointer-events-auto ${ accountOpen ? "opacity-100 translate-y-0 visible pointer-events-auto" : "opacity-0 translate-y-2 invisible pointer-events-none" }`}
                role="menu"
              >
                <div className="rounded-2xl bg-white border border-brand-line overflow-hidden py-2">
                  <p className="px-4 pt-1.5 pb-2 mb-1 text-xs text-brand-muted border-b border-brand-line">
                    Welcome to PK Farms
                  </p>
                  {ACCOUNT_LINKS.map(({ icon: Icon, label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-ink hover:bg-brand-cream hover:text-brand-funk transition-colors"
                    >
                      <Icon size={16} strokeWidth={1.5} />
                      {label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    onClick={() => setAccountOpen(false)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 border-t border-brand-line mt-1 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} strokeWidth={1.5} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Cart"
              onClick={openCart}
              className="relative w-9 h-9 sm:w-10 sm:h-10 grid place-items-center rounded-full text-brand-ink hover:bg-brand-soft transition"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {count > 0 && (
                <span
                  className="absolute top-0 right-0 min-w-[18px] h-[18px] px-1 rounded-full text-white text-[10px] font-bold grid place-items-center border border-white bg-brand-funk hover:bg-brand-funkDark"
                >
                  {count}
                </span>
              )}
            </button>
            <button
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => {
                setAccountOpen(false);
                setOpen((s) => !s);
              }}
              className="lg:hidden w-11 h-11 grid place-items-center rounded-full text-brand-ink hover:bg-brand-soft active:bg-brand-soft active:scale-90 transition-all duration-150"
            >
              {open ? (
                <X size={22} />
              ) : (
                <Menu size={22} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop — dims the page behind the mobile nav overlay */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`lg:hidden fixed inset-0 top-[112px] bg-brand-ink/40 transition-opacity duration-500 ${ open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none" }`}
      />

      {/* Mobile nav — overlays the page (hero stays put behind it), slides down from the top */}
      <div
        className={`lg:hidden absolute top-full inset-x-0 z-30 origin-top bg-white border-b border-brand-line shadow-xl overflow-hidden transition-[max-height,opacity] duration-[600ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${ open ? "max-h-[calc(100vh-8rem)] opacity-100" : "max-h-0 opacity-90" }`}
      >
        <nav className="max-h-[calc(100vh-8rem)] overflow-y-auto">
          <ul className="mx-auto max-w-7xl px-4 sm:px-6 py-2 flex flex-col divide-y divide-brand-line">
            {NAV.map((item) => {
              const menu = item.menu === "category" ? SHOP_MENU : null;
              const isExpanded = mobileExpand === item.label;

              if (item.menu === "shop") {
                const closeMenu = () => {
                  setOpen(false);
                  setMobileExpand(null);
                };
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() => setMobileExpand((s) => (s === item.label ? null : item.label))}
                      aria-expanded={isExpanded}
                      className="w-full flex items-center justify-between py-3 text-base text-brand-ink"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={16}
                        strokeWidth={1.75}
                        className={`transition-transform ${isExpanded ? "rotate-180 text-brand-funk" : ""}`}
                      />
                    </button>
                    {isExpanded && (
                      <div className="pb-3 flex flex-col gap-4">
                        {SHOP_GROUPS.map((g) => (
                          <div key={g.title}>
                            <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-brand-line">
                              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-brand-tan">{g.title}</p>
                              <Link href={g.href} onClick={closeMenu} className="text-xs font-semibold text-brand-funk">
                                View all
                              </Link>
                            </div>
                            <ul className="flex flex-col">
                              {g.products.map((p) => (
                                <li key={p.slug}>
                                  <Link href={`/products/${p.slug}`} onClick={closeMenu} className="flex items-center gap-3 py-1.5">
                                    <span className="relative w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-brand-line bg-white">
                                      <Image src={p.image} alt="" fill sizes="40px" className="object-contain p-0.5" />
                                    </span>
                                    <span className="text-sm text-brand-ink">{p.name}</span>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }

              if (menu) {
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      onClick={() =>
                        setMobileExpand((s) => (s === item.label ? null : item.label))
                      }
                      aria-expanded={isExpanded}
                      className="w-full flex items-center justify-between py-3 text-base text-brand-ink"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={16}
                        strokeWidth={1.75}
                        className={`transition-transform ${ isExpanded ? "rotate-180 text-brand-funk" : "" }`}
                      />
                    </button>

                    {isExpanded && (
                      <ul className="pb-3 flex flex-col gap-2">
                        {menu.map((c) => {
                          const catOpen = mobileCat === c.name;
                          const close = () => {
                            setOpen(false);
                            setMobileExpand(null);
                            setMobileCat(null);
                          };
                          return (
                            <li key={c.name}>
                              {/* Tap the category to reveal its sub-categories */}
                              <button
                                type="button"
                                onClick={() => setMobileCat((v) => (v === c.name ? null : c.name))}
                                aria-expanded={catOpen}
                                className={`w-full flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                                  catOpen ? "bg-white border-brand-funk/40" : "bg-brand-cream border-brand-line"
                                }`}
                              >
                                <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden">
                                  <Image src={c.image} alt={c.name} fill sizes="48px" className="object-cover object-center" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-display font-medium text-brand-ink text-sm leading-tight truncate">
                                    {c.name}
                                  </p>
                                  {c.hint && <p className="text-[11px] text-brand-muted truncate">{c.hint}</p>}
                                </div>
                                <ChevronDown
                                  size={16}
                                  strokeWidth={1.75}
                                  className={`shrink-0 transition-transform duration-300 ${
                                    catOpen ? "rotate-180 text-brand-funk" : "text-brand-muted"
                                  }`}
                                />
                              </button>

                              <div
                                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                                  catOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                                }`}
                              >
                                <ul className="overflow-hidden ml-[4.25rem] flex flex-col">
                                  <li className="pt-2">
                                    <Link
                                      href={c.href}
                                      onClick={close}
                                      className="flex items-center gap-1.5 py-1.5 text-sm font-medium text-brand-funk"
                                    >
                                      View all {c.name}
                                    </Link>
                                  </li>
                                  {c.subs?.map((sub) => (
                                    <li key={sub.label}>
                                      <Link
                                        href={sub.href}
                                        onClick={close}
                                        className="flex items-center gap-1.5 py-1.5 text-sm text-brand-ink hover:text-brand-funk"
                                      >
                                        <ChevronRight size={14} strokeWidth={1.75} className="text-brand-funk/70" />
                                        {sub.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              }

              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between py-3 text-base text-brand-ink"
                  >
                    <span>{item.label}</span>
                    {item.menu && <ChevronDown size={16} strokeWidth={1.75} />}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center gap-3 border-t border-brand-line">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 inline-flex items-center justify-center h-9 gap-1.5 rounded-full text-white text-sm transition-colors bg-brand-funk hover:bg-brand-funkDark"
            >
              <LogIn size={15} strokeWidth={1.75} />
              Login
            </Link>
          </div>
        </nav>
      </div>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
