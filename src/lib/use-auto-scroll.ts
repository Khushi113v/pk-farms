"use client";
import { useEffect, type RefObject } from "react";

// Slides a horizontal scroller one card at a time, looping back to the start at the end.
// Pauses while hovered / touched / focused, when `paused` is true, or if the user prefers reduced motion.
export function useAutoScroll(
  ref: RefObject<HTMLElement>,
  { interval = 3500, paused = false }: { interval?: number; paused?: boolean } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el || paused) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let hold = false;
    const on = () => (hold = true);
    const off = () => (hold = false);
    el.addEventListener("mouseenter", on);
    el.addEventListener("mouseleave", off);
    el.addEventListener("touchstart", on, { passive: true });
    el.addEventListener("touchend", off);
    el.addEventListener("focusin", on);
    el.addEventListener("focusout", off);

    const id = window.setInterval(() => {
      if (hold || document.hidden) return;
      const first = el.firstElementChild as HTMLElement | null;
      if (!first) return;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      if (atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: first.getBoundingClientRect().width + gap, behavior: "smooth" });
    }, interval);

    return () => {
      window.clearInterval(id);
      el.removeEventListener("mouseenter", on);
      el.removeEventListener("mouseleave", off);
      el.removeEventListener("touchstart", on);
      el.removeEventListener("touchend", off);
      el.removeEventListener("focusin", on);
      el.removeEventListener("focusout", off);
    };
  }, [ref, interval, paused]);
}
