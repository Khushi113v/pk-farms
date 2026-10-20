import Image from "next/image";

// Product photo that always shows in full, whatever its size or shape.
// The photo is fitted inside the box (never cropped); any leftover space is filled
// with a soft, blurred copy of the same photo so the box never looks empty.
// The parent must be `relative` with a fixed size or aspect ratio.
export default function ProductImage({
  src,
  alt,
  sizes,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string; // extra classes for the main photo (e.g. hover zoom)
}) {
  return (
    <>
      <Image
        src={src}
        alt=""
        aria-hidden
        fill
        sizes={sizes}
        className="object-cover scale-110 blur-xl opacity-70"
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-contain ${className}`}
      />
    </>
  );
}
