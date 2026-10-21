export const BRAND_BACKDROP_BG = "bg-white";
export const BRAND_BACKDROP_BG_MEDIUM = "bg-brand-cream";
export const BRAND_BACKDROP_BG_STRONG = "bg-brand-soft";

export default function BrandBackdrop({ wave = true }: { wave?: boolean; strong?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {wave && (
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-24 md:h-32 opacity-30"
        >
          <path
            d="M0 60 C 240 0, 480 120, 720 60 S 1200 0, 1440 60"
            fill="none"
            stroke="#E2A230"
            strokeWidth="2"
          />
        </svg>
      )}
    </div>
  );
}
