"use client";
import { useState } from "react";
import Image from "next/image";
import ProductImage from "@/components/common/ProductImage";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Transparent product cut-outs live in /images/products/ and are shown whole with padding;
// every other photo (lifestyle shots) fills the frame.
const isCutout = (src: string) => src.includes("/images/products/");

const ZOOM = 2.2;

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
  // Hover zoom (mouse only): the active image scales up around the pointer
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const count = images.length;
  const current = Math.min(active, count - 1);

  const go = (dir: 1 | -1) => setActive((i) => (i + dir + count) % count);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  return (
    <div className="flex gap-3">
      {/* Thumbnails — vertical strip on the left, same height as the main image */}
      {count > 1 && (
        <div className="relative shrink-0 w-[64px] sm:w-[84px]">
          <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-[2px] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#B5B0AC] [&::-webkit-scrollbar-track]:bg-[#ECE8E5]">
            {images.map((img, idx) => {
              const isActive = current === idx;
              return (
                <button
                  key={img + idx}
                  type="button"
                  onClick={() => setActive(idx)}
                  aria-label={`View image ${idx + 1}`}
                  className={`relative shrink-0 aspect-square rounded-lg overflow-hidden border-2 bg-white transition-colors ${
                    isActive ? "" : "border-brand-line hover:border-brand-ink/30 opacity-80 hover:opacity-100"
                  }`}
                  style={{ borderColor: isActive ? "#0B5B36" : undefined }}
                >
                  <Image
                    src={img}
                    alt=""
                    fill
                    sizes="84px"
                    className={isCutout(img) ? "object-contain p-1.5" : "object-cover"}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1 min-w-0">
        {/* Main image — sliding track; hover to zoom */}
        <div
          className={`group/zoom relative aspect-square ${rounded} overflow-hidden border bg-white ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
          style={{ borderColor }}
          onPointerMove={onMove}
          onPointerLeave={() => setZoom(null)}
        >
          <div
            className="flex h-full transition-transform duration-500 ease-out"
            style={{ width: `${count * 100}%`, transform: `translateX(-${current * (100 / count)}%)` }}
          >
            {images.map((img, idx) => {
              const zoomed = zoom && idx === current;
              return (
                <div key={img + idx} className="relative h-full shrink-0 overflow-hidden" style={{ width: `${100 / count}%` }}>
                  <div
                    className="absolute inset-0 transition-transform duration-150 ease-out"
                    style={
                      zoomed
                        ? { transform: `scale(${ZOOM})`, transformOrigin: `${zoom.x}% ${zoom.y}%` }
                        : { transform: "scale(1)" }
                    }
                  >
                    {isCutout(img) ? (
                      <ProductImage src={img} alt={alt} sizes="(max-width: 768px) 90vw, 45vw" priority={idx === 0} inset="inset-8 md:inset-14" />
                    ) : (
                      <Image src={img} alt={alt} fill sizes="(max-width: 768px) 90vw, 45vw" className="object-cover" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {overlay}

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className={`absolute left-2 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white/90 border border-brand-line text-brand-ink hover:bg-white transition-opacity ${zoom ? "opacity-0" : "opacity-100"}`}
              >
                <ChevronLeft size={16} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className={`absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white/90 border border-brand-line text-brand-ink hover:bg-white transition-opacity ${zoom ? "opacity-0" : "opacity-100"}`}
              >
                <ChevronRight size={16} strokeWidth={2.5} />
              </button>

              {/* Dots on phones */}
              <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, idx) => (
                  <span
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${idx === current ? "w-4 bg-brand-funk" : "w-1.5 bg-brand-funk/30"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
