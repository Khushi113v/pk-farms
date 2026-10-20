"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Play, ArrowLeft, ArrowRight, Sparkles, Star } from "lucide-react";
import { useAutoScroll } from "@/lib/use-auto-scroll";
import { useInfiniteLoop } from "@/lib/use-infinite-loop";

type Vid = {
  youtubeId: string;
  poster: string; // cover photo shown until the video is played
  name: string;
  location: string;
  rating: number;
  bought: string;
};

// Same video repeated across all cards for consistency (swap IDs later).
const SHARED_ID = "jNQXAC9IVRw";

const VIDEOS: Vid[] = [
  {
    youtubeId: SHARED_ID,
    poster: "/images/products/oils.png",
    name: "Aanya",
    location: "Jaipur",
    rating: 5,
    bought: "Pure Desi Cow Ghee",
  },
  {
    youtubeId: SHARED_ID,
    poster: "/images/products/spices.png",
    name: "Meera",
    location: "Delhi",
    rating: 5,
    bought: "Raw Honey",
  },
  {
    youtubeId: SHARED_ID,
    poster: "/images/products/honey.png",
    name: "Simran",
    location: "Mumbai",
    rating: 5,
    bought: "Heeng",
  },
  {
    youtubeId: SHARED_ID,
    poster: "/images/products/honey.png",
    name: "Kavya",
    location: "Bengaluru",
    rating: 4,
    bought: "Wood Pressed Groundnut Oil",
  },
  {
    youtubeId: SHARED_ID,
    poster: "/images/products/oils.png",
    name: "Riya",
    location: "Lucknow",
    rating: 5,
    bought: "Pure Desi Cow Ghee",
  },
];

export default function VideoSection() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<number | null>(null);
  // Rendered 3× so the auto-slider loops seamlessly (see useInfiniteLoop).
  const LOOP = [...VIDEOS, ...VIDEOS, ...VIDEOS];
  useInfiniteLoop(scrollerRef, VIDEOS.length, playing !== null);
  useAutoScroll(scrollerRef, { interval: 4000, paused: playing !== null });

  const scrollBy = (dir: "left" | "right") => {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild?.getBoundingClientRect().width ?? 300;
    el.scrollBy({ left: (cardWidth + 20) * (dir === "left" ? -1 : 1), behavior: "smooth" });
  };

  return (
    <section className="relative bg-white py-6 md:py-8 overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6 md:mb-8">
          <div className="max-w-2xl lg:max-w-none">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-brand-strip px-3 py-1.5 rounded-full border border-brand-funk/30">
              <Sparkles size={12} strokeWidth={2.5} />
              Loved by our customers
            </span>
            <h2 className="mt-4 font-display font-medium text-brand-ink text-[30px] sm:text-4xl md:text-5xl lg:text-[44px] xl:text-5xl leading-[1.05] lg:whitespace-nowrap">
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
          className="no-scrollbar flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-6 sm:px-6 lg:px-8"
        >
          {LOOP.map((v, idx) => {
            const isPlaying = playing === idx;
            return (
              <article
                key={idx}
                className="group snap-center sm:snap-start shrink-0 w-[calc(100vw-7rem)] sm:w-[220px] md:w-[235px] rounded-3xl overflow-hidden"
              >
                {/* Reel-size media area (9:16) */}
                <div className="relative aspect-[9/16] bg-brand-ink overflow-hidden">
                  {isPlaying ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${v.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                      title={`${v.name} · ${v.location}`}
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <>
                      <Image
                        src={v.poster}
                        alt={`${v.name} from ${v.location}`}
                        fill
                        sizes="240px"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={() => setPlaying(idx)}
                        aria-label={`Play testimonial from ${v.name}`}
                        className="absolute inset-0 grid place-items-center"
                      >
                        <span className="grid place-items-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-brand-ink border border-brand-line hover:scale-110 transition-all duration-200">
                          <Play size={22} strokeWidth={2.5} className="fill-brand-funk text-brand-funk translate-x-0.5" />
                        </span>
                      </button>
                    </>
                  )}
                </div>

                {/* Customer details below the video */}
                <div className="mt-3 px-1 text-center">
                  <div className="flex items-center justify-center gap-0.5 mb-1.5">
                    {[...Array(5)].map((_, k) => (
                      <Star
                        key={k}
                        size={13}
                        strokeWidth={0}
                        className={k < v.rating ? "fill-yellow-400 text-yellow-400" : "text-brand-line fill-brand-line"}
                      />
                    ))}
                  </div>
                  <p className="font-display font-medium text-brand-ink text-[15px] leading-tight">
                    {v.name}
                    <span className="text-brand-muted font-body font-normal text-xs">
                      {" · "}
                      {v.location}
                    </span>
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-brand-tan">{v.bought}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
