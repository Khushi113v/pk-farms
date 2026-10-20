"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const hasMobileFixedBar = pathname === "/checkout" || pathname?.startsWith("/products/");

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      style={{
        backgroundColor: "#0B5B36",
      }}
      className={`fixed ${hasMobileFixedBar ? "bottom-24" : "bottom-5"} right-5 md:bottom-8 md:right-8 z-50 w-12 h-12 md:w-[52px] md:h-[52px] grid place-items-center rounded-full text-white transition-all duration-300 ${ visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none" }`}
    >
      <ArrowUp size={20} strokeWidth={2.75} />
    </button>
  );
}
