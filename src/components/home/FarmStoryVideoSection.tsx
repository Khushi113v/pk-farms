"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, X } from "lucide-react";

// YouTube video for this section — paste the ID from your link
// (youtube.com/watch?v=THIS_PART or youtu.be/THIS_PART). Placeholder video for now.
const YOUTUBE_ID = "jNQXAC9IVRw";
const POSTER = "/images/about.png";

// Centred story banner: cover photo, short heading and a large play button.
// Pressing play swaps the cover for the YouTube video (with sound) inside the same card.
export default function FarmStoryVideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="relative bg-white py-6 md:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[28px] bg-brand-ink isolate aspect-[4/5] sm:aspect-[16/9] lg:aspect-[21/9]">
          {playing && YOUTUBE_ID ? (
            <>
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title="The PK Farms story"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
              <button
                type="button"
                onClick={() => setPlaying(false)}
                aria-label="Close video"
                className="absolute top-3 right-3 grid place-items-center w-10 h-10 rounded-full bg-black/55 text-white hover:bg-black/75 transition-colors"
              >
                <X size={18} strokeWidth={2} />
              </button>
            </>
          ) : (
            <>
              {/* Cover */}
              <Image src={POSTER} alt="A farmer with his desi cow in the fields" fill sizes="(min-width: 1280px) 1216px, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(14,26,18,0.55)_0%,rgba(14,26,18,0.72)_100%)]" />

              {/* Centred content */}
              <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-brand-tan">Our roots</p>
                <h2 className="mt-3 font-hero font-bold text-white text-[28px] sm:text-[36px] md:text-[46px] leading-[1.1] max-w-2xl">
                  From our farm to <span className="italic text-[#F3D98B]">your family</span>
                </h2>
                <p className="mt-3 text-white/80 text-sm md:text-base max-w-md">See how we make every jar, the old way.</p>

                {YOUTUBE_ID && (
                  <button
                    type="button"
                    onClick={() => setPlaying(true)}
                    aria-label="Play our story video"
                    className="group mt-6 md:mt-8 flex flex-col items-center gap-3"
                  >
                    <span className="relative grid place-items-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-brand-funk shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110">
                      <span className="absolute inset-0 rounded-full bg-white/60 animate-ping" />
                      <Play size={28} strokeWidth={2} className="relative fill-brand-funk translate-x-0.5" />
                    </span>
                    <span className="text-white text-xs md:text-sm font-semibold uppercase tracking-[0.2em]">Watch our story</span>
                  </button>
                )}

                <Link
                  href="/about-us"
                  className="mt-5 md:mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 hover:text-[#F3D98B] transition-colors"
                >
                  About PK Farms
                  <ArrowRight size={15} strokeWidth={2} />
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
