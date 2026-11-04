"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Phone, Instagram, Facebook, Youtube } from "lucide-react";

// Contact rail fixed to the right edge of every page: call, WhatsApp and social links. It starts open; the tab on
// its left edge slides it away (leaving just the tab) and brings it back.
const PHONE = "+919876543210";
const LINKS: { label: string; href: string; Icon: React.ElementType; external?: boolean }[] = [
  { label: "Call Us", href: `tel:${PHONE}`, Icon: Phone },
  { label: "WhatsApp", href: `https://wa.me/${PHONE.slice(1)}`, Icon: WhatsAppIcon, external: true },
  { label: "Instagram", href: "#", Icon: Instagram },
  { label: "Facebook", href: "#", Icon: Facebook },
  { label: "YouTube", href: "#", Icon: Youtube },
];

export default function ContactRail() {
  const [open, setOpen] = useState(true);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRef = useRef<HTMLButtonElement>(null);

  // Let the page know how much of its right edge the rail covers (the hero's right arrow keeps clear of it)
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const tab = tabRef.current?.offsetWidth ?? 0;
      const list = listRef.current?.offsetWidth ?? 0;
      root.style.setProperty("--side-rail", `${open ? tab + list : tab}px`);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);
  useEffect(
    () => () => {
      document.documentElement.style.removeProperty("--side-rail");
    },
    [],
  );

  return (
    <div
      className={`fixed right-0 top-1/2 z-[35] -translate-y-1/2 transition-transform duration-300 ease-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <button
        ref={tabRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={open ? "Hide contact links" : "Show contact links"}
        className="absolute right-full top-1/2 -translate-y-1/2 grid place-items-center w-5 h-9 rounded-l-md bg-brand-funk hover:bg-brand-funkDark text-white ring-1 ring-white/15 shadow-[-4px_4px_12px_-4px_rgba(31,45,36,0.45)] transition-colors"
      >
        {open ? <ChevronRight size={14} strokeWidth={2.5} /> : <ChevronLeft size={14} strokeWidth={2.5} />}
      </button>

      <div
        ref={listRef}
        aria-hidden={!open}
        className="flex flex-col py-1.5 rounded-l-xl bg-brand-funk text-white shadow-[-6px_8px_24px_-8px_rgba(31,45,36,0.5)]"
      >
        {LINKS.map(({ label, href, Icon, external }) => (
          <a
            key={label}
            href={href}
            tabIndex={open ? undefined : -1}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex flex-col items-center gap-1 px-1.5 sm:px-2 py-2 text-white/90 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Icon size={17} strokeWidth={1.75} />
            <span className="text-[8px] sm:text-[9px] font-medium leading-none tracking-wide whitespace-nowrap">{label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

// WhatsApp mark in the same outline style as the other icons
function WhatsAppIcon({ size = 24, strokeWidth = 1.75 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3.6 20.4l1.2-3.9A8.9 8.9 0 1 1 7.6 19.3Z" />
      <path
        d="M9.1 8.3c.2-.4.6-.5.9-.4l1 .4c.3.1.4.4.3.7l-.4 1.1c-.1.2 0 .5.1.7.5.9 1.2 1.6 2.1 2.1.2.1.5.2.7.1l1.1-.4c.3-.1.6 0 .7.3l.4 1c.1.3 0 .7-.4.9-.7.4-1.6.6-2.4.3-2.3-.8-4-2.5-4.8-4.8-.3-.8-.1-1.7.3-2.4Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
