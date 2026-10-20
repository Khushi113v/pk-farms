"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, ArrowLeft, ArrowRight, Sparkles, Star } from "lucide-react";

type Story = {
  youtubeId: string;
  poster: string; // cover photo shown until the video is played
  parent: string; // customer name
  location: string;
  rating: number;
  bought: string;
};

// Same video repeated across all cards for consistency (swap IDs later).
const SHARED_ID = "jNQXAC9IVRw";

const STORIES: Story[] = [
  { youtubeId: SHARED_ID, poster: "/images/editorial/village-morning.svg", parent: "Aanya", location: "Jaipur", rating: 5, bought: "Pahadi Badri Cow Ghee" },
  { youtubeId: SHARED_ID, poster: "/images/editorial/masala-spread.svg", parent: "Meera", location: "Delhi", rating: 5, bought: "Multiflora Himalayan Honey" },
  { youtubeId: SHARED_ID, poster: "/images/editorial/honey-spoon.svg", parent: "Simran", location: "Mumbai", rating: 5, bought: "Lakadong Turmeric Powder" },
  { youtubeId: SHARED_ID, poster: "/images/editorial/honey-harvest.svg", parent: "Kavya", location: "Bengaluru", rating: 4, bought: "Wild Forest Honey" },
  { youtubeId: SHARED_ID, poster: "/images/editorial/mountain-farm.svg", parent: "Riya", location: "Lucknow", rating: 5, bought: "Pahadi Pantry Combo" },
];

// `roomBelow` leaves a little extra bottom space for an illustration standing on the next section.
// `eyebrow` shows the small "Loved by our customers" pill above the heading.
export default function TestimonialsSection({
  roomBelow = false,
  eyebrow = true,
}: {
  roomBelow?: boolean;
  eyebrow?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  const playingRef = useRef<number | null>(null);
  playingRef.current = playing;

  // Infinite loop: the list is rendered 3 times and the scroller is kept inside the middle copy.
  // When it drifts into the first/last copy it jumps by one set width — the cards are identical, so the jump is invisible.
  const LOOP = [...STORIES, ...STORIES, ...STORIES];
  const N = STORIES.length;

  const setWidth = (el: HTMLDivElement) => {
    const a = el.children[0] as HTMLElement | undefined;
    const b = el.children[N] as HTMLElement | undefined;
    return a && b ? b.offsetLeft - a.offsetLeft : 0;
  };

  // Start in the middle copy + keep position there after any scroll (auto, arrows, swipe).
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const w = setWidth(el);
    if (w) el.scrollLeft = w;

    let t: number | undefined;
    const normalize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        const sw = setWidth(el);
        if (!sw || playingRef.current !== null) return;
        if (el.scrollLeft >= sw * 2 - 2) el.scrollLeft -= sw;
        else if (el.scrollLeft < sw - 2) el.scrollLeft += sw;
      }, 150);
    };
    el.addEventListener("scroll", normalize, { passive: true });
    return () => {
      window.clearTimeout(t);
      el.removeEventListener("scroll", normalize);
    };
  }, [N]);

  // Auto-slide one card every 4s; pauses on hover / touch / focus, while a video plays, or tab hidden.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || playing !== null) return;
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
      el.scrollBy({ left: first.getBoundingClientRect().width + gap, behavior: "smooth" });
    }, 4000);

    return () => {
      window.clearInterval(id);
      el.removeEventListener("mouseenter", on);
      el.removeEventListener("mouseleave", off);
      el.removeEventListener("touchstart", on);
      el.removeEventListener("touchend", off);
      el.removeEventListener("focusin", on);
      el.removeEventListener("focusout", off);
    };
  }, [playing]);

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? 300;
    el.scrollBy({ left: (cardWidth + 20) * (dir === "left" ? -1 : 1), behavior: "smooth" });
  };

  return (
    <section className={`relative bg-white pt-6 md:pt-8 ${roomBelow ? "pb-16 md:pb-20" : "pb-6 md:pb-8"} overflow-hidden`}>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-6 md:mb-8">
          <div className="max-w-2xl">
            {eyebrow && (
              <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-brand-strip px-3 py-1.5 rounded-full border border-brand-funk/30">
                <Sparkles size={12} strokeWidth={2.5} />
                Real parents, real results
              </span>
            )}
            <h2 className={`${eyebrow ? "mt-4 " : ""}font-display font-medium text-brand-ink text-[30px] sm:text-4xl md:text-5xl leading-[1.05]`}>
              Real{" "}
              <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
                testimonials
              </span>
              , real love.
            </h2>
          </div>

          {/* Prev / Next arrows */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              aria-label="Scroll left"
              onClick={() => scrollBy("left")}
              className="grid place-items-center w-10 h-10 rounded-full bg-white text-brand-ink border border-brand-line transition-all"
            >
              <ArrowLeft size={16} strokeWidth={2.75} />
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollBy("right")}
              className="grid place-items-center w-10 h-10 rounded-full text-white transition-all bg-brand-funk hover:bg-brand-funkDark"
            >
              <ArrowRight size={16} strokeWidth={2.75} />
            </button>
          </div>
        </div>

        {/* Horizontal scroller */}
        <div
          ref={scrollerRef}
          className="no-scrollbar flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-3 -mx-4 sm:-mx-6 lg:-mx-8 px-6 sm:px-6 lg:px-8"
        >
          {LOOP.map((s, idx) => {
            const isPlaying = playing === idx;
            return (
              <article
                key={idx}
                className="snap-center sm:snap-start shrink-0 w-[calc(100vw-5rem)] sm:w-[240px] md:w-[260px]"
              >
                {/* Reel-size media area (9:16) */}
                <div className="relative aspect-[9/16] bg-brand-ink overflow-hidden rounded-3xl">
                  {isPlaying ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${s.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title={`${s.parent} · ${s.location}`}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <Image
                        src={s.poster}
                        alt={`${s.parent} from ${s.location}`}
                        fill
                        sizes="240px"
                        className="object-cover object-top"
                                              />
                      <button
                        onClick={() => setPlaying(idx)}
                        aria-label={`Play story from ${s.parent}`}
                        className="absolute inset-0 grid place-items-center group"
                      >
                        <span className="grid place-items-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-brand-ink border border-brand-line hover:scale-110 transition-all duration-200">
                          <Play
                            size={22}
                            strokeWidth={2.5}
                            className="fill-brand-funk text-brand-funk translate-x-0.5"
                          />
                        </span>
                      </button>
                    </>
                  )}
                </div>

                {/* Info below the video */}
                <div className="mt-3 px-1 justify-center text-center">
                  <div className="flex items-center justify-center gap-0.5 text-yellow-500 mb-1.5">
                    {[...Array(5)].map((_, k) => (
                      <Star
                        key={k}
                        size={13}
                        className={
                          k < s.rating ? "fill-yellow-400 text-yellow-400" : "text-brand-line"
                        }
                        strokeWidth={0}
                      />
                    ))}
                  </div>
                  <p className="font-display font-medium text-brand-ink text-[15px] leading-tight">
                    {s.parent}
                    <span className="text-brand-muted font-body font-normal text-xs">
                      {" · "}
                      {s.location}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-brand-tan">{s.bought}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
