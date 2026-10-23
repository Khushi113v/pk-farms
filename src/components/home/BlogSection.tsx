"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";
import { useAutoScroll } from "@/lib/use-auto-scroll";
import { useInfiniteLoop } from "@/lib/use-infinite-loop";

// "Sep 20, 2026" → { day: "20", month: "Sep" }
function splitDate(date: string) {
  const [month = "", day = ""] = date.replace(",", "").split(" ");
  return { day, month };
}

export default function BlogSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const posts = BLOG_POSTS;
  // Rendered 3× so the auto-slider loops seamlessly (see useInfiniteLoop).
  const LOOP = [...posts, ...posts, ...posts];
  useInfiniteLoop(trackRef, posts.length);
  useAutoScroll(trackRef, { interval: 4500 });

  const scrollBy = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: ((first?.getBoundingClientRect().width ?? 320) + gap) * (dir === "left" ? -1 : 1), behavior: "smooth" });
  };

  return (
    <section className="relative pt-2 pb-10 md:pt-4 md:pb-14 overflow-hidden bg-brand-cream">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 mb-7 md:mb-9">
          <div className="min-w-0">
            <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-brand-tan">The PK Farms journal</p>
            <h2 className="mt-2 font-hero font-bold text-brand-ink text-[30px] sm:text-4xl md:text-[46px] leading-[1.05]">
              Stories from the <span className="italic text-brand-funk">Farm</span>
            </h2>
            <p className="mt-3 flex items-center gap-3 text-brand-ink/70 text-sm md:text-base">
              <span className="h-px w-8 bg-brand-tan" />
              <span className="italic">Recipes, buying guides and kitchen wisdom</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-funk hover:text-brand-funkDark mr-1"
            >
              All stories
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
            <button
              aria-label="Scroll left"
              onClick={() => scrollBy("left")}
              className="grid place-items-center w-10 h-10 rounded-full bg-white text-brand-ink border border-brand-line hover:border-brand-funk/40 transition-colors"
            >
              <ArrowLeft size={16} strokeWidth={2} />
            </button>
            <button
              aria-label="Scroll right"
              onClick={() => scrollBy("right")}
              className="grid place-items-center w-10 h-10 rounded-full text-white bg-brand-funk hover:bg-brand-funkDark transition-colors"
            >
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div
          ref={trackRef}
          className="no-scrollbar flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 lg:scroll-pl-8 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-1 pb-3"
        >
          {LOOP.map((p, idx) => {
            const { day, month } = splitDate(p.date);
            return (
              <Link
                key={idx}
                href={`/blog/${p.slug}`}
                className="group snap-start shrink-0 w-[82%] sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-1rem)] flex flex-col rounded-[22px] bg-white border border-brand-line overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:border-brand-funk/30 hover:shadow-[0_24px_40px_-28px_rgba(31,45,36,0.45)]"
              >
                {/* Photo */}
                <div className="relative aspect-[16/10] overflow-hidden bg-brand-soft">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                  />
                  {/* Category */}
                  <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-funk">
                    {p.category}
                  </span>
                  {/* Date badge */}
                  <span className="absolute bottom-3 right-3 flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-brand-funk text-white leading-none shadow-md">
                    <span className="font-hero font-bold text-lg">{day}</span>
                    <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/80">{month}</span>
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1 flex flex-col p-4 md:p-5">
                  <span className="inline-flex items-center gap-1.5 text-xs text-brand-muted">
                    <Clock size={12} strokeWidth={2} />
                    {p.readTime}
                  </span>
                  <h3 className="mt-2 font-hero font-bold text-brand-ink text-lg md:text-xl leading-snug line-clamp-2 group-hover:text-brand-funk transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-2 text-[13px] md:text-sm text-brand-muted leading-relaxed line-clamp-2">{p.excerpt}</p>

                  <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-funk">
                    <span className="relative after:absolute after:left-0 after:-bottom-0.5 after:h-px after:w-full after:bg-brand-funk after:origin-left after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300">
                      Read more
                    </span>
                    <ArrowRight size={15} strokeWidth={2} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Phones: link to all stories */}
        <div className="sm:hidden mt-4 text-center">
          <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-funk">
            All stories
            <ArrowRight size={15} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </section>
  );
}
