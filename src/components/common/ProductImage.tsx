import Image from "next/image";

// Product photo for transparent PNGs. It always shows in full, whatever its size or shape,
// fitted inside the box with breathing room and a soft shadow underneath.
// The parent must be `relative` with a fixed size or aspect ratio.
export default function ProductImage({
  src,
  alt,
  sizes,
  priority,
  inset = "inset-5 md:inset-7", // space around the product; larger = smaller product
  className = "",
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  inset?: string;
  className?: string; // extra classes for the photo (e.g. hover zoom)
}) {
  return (
    <div className={`absolute ${inset}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-contain drop-shadow-[0_14px_14px_rgba(31,45,36,0.22)] ${className}`}
      />
    </div>
  );
}
