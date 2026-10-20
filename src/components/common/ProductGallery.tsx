"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductGallery({
  images,
  alt,
  tileBg,
  borderColor,
  rounded = "rounded-3xl",
  overlay,
}: {
  images: string[];
  alt: string;
  tileBg: string;
  borderColor: string;
  rounded?: string;
  overlay?: React.ReactNode;
}) {
  const [active, setActive] = useState(0);
  const count = images.length;

  const go = (dir: 1 | -1) => setActive((i) => (i + dir + count) % count);

  return (
    <div className="flex gap-3">
      {/* Thumbnails — vertical strip on the left, same height as the main image */}
      {count > 1 && (
        <div className="relative shrink-0 w-[72px] sm:w-[88px]">
          <div className="absolute inset-0 flex flex-col gap-2 overflow-y-scroll pr-1 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#B5B0AC] [&::-webkit-scrollbar-track]:bg-[#ECE8E5]">
            {images.map((img, idx) => {
              const isActive = active === idx;
              return (
                <button
                  key={img + idx}
                  type="button"
                  onClick={() => setActive(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`relative shrink-0 aspect-[3/4] rounded-lg overflow-hidden border transition-colors ${isActive ? "" : "border-brand-line hover:border-brand-ink/40"}`}
                  style={{
                    backgroundColor: `${tileBg}33`,
                    borderColor: isActive ? borderColor : undefined,
                  }}
                >
                  <Image src={img} alt="" fill sizes="80px" className="object-cover object-top" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Main image — sliding track */}
        <div
          className={`relative aspect-[4/5] ${rounded} overflow-hidden border`}
          style={{ backgroundColor: `${tileBg}33`, borderColor }}
        >
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{
              width: `${count * 100}%`,
              transform: `translateX(-${active * (100 / count)}%)`,
            }}
          >
            {images.map((img, idx) => (
              <div key={img + idx} className="relative h-full shrink-0" style={{ width: `${100 / count}%` }}>
                <Image
                  src={img}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 90vw, 45vw"
                  className="object-cover object-top"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>

          {overlay}

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white/90 text-brand-ink hover:bg-white transition-colors"
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white/90 text-brand-ink hover:bg-white transition-colors"
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
