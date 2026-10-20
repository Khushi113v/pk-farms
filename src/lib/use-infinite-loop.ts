"use client";
import { useEffect, type RefObject } from "react";

// Seamless looping for a horizontal scroller whose list is rendered 3 times.
// The scroller starts in the middle copy; when it drifts into the first/last copy it jumps by one
// set width — the cards are identical, so the jump is invisible and the slider repeats forever.
export function useInfiniteLoop(ref: RefObject<HTMLElement>, setSize: number, paused = false) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setWidth = () => {
      const a = el.children[0] as HTMLElement | undefined;
      const b = el.children[setSize] as HTMLElement | undefined;
      return a && b ? b.offsetLeft - a.offsetLeft : 0;
    };
    const w = setWidth();
    if (w) el.scrollLeft = w;

    let t: number | undefined;
    const normalize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const sw = setWidth();
        if (!sw || paused) return;
        if (el.scrollLeft >= sw * 2 - 2) el.scrollLeft -= sw;
        else if (el.scrollLeft < sw - 2) el.scrollLeft += sw;
      }, 150);
    };
    el.addEventListener("scroll", normalize, { passive: true });
    return () => {
      window.clearTimeout(t);
      el.removeEventListener("scroll", normalize);
    };
  }, [ref, setSize, paused]);
}
