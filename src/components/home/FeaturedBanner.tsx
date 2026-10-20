import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Wide promotional banner: product photo on the right, text on the left.
export default function FeaturedBanner() {
  return (
    <section className="relative bg-white py-6 md:py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-[#F7EBCF] flex flex-col md:block md:h-[440px]">
          {/* Photo — full banner on desktop, top part on phones fading into the wall colour */}
          <div className="relative h-[340px] md:h-full md:absolute md:inset-y-0 md:right-0 md:aspect-square [mask-image:linear-gradient(to_bottom,black_75%,transparent)] md:[mask-image:linear-gradient(to_right,transparent,black_25%)]">
            <Image
              src="/images/products/oils.png"
              alt="PK Farms Wood Pressed Groundnut Oil with groundnuts"
              fill
              sizes="(min-width: 768px) 440px, 100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Text — sits on the open blush wall on the left */}
          <div className="relative -mt-8 md:mt-0 md:h-full flex items-center px-6 pb-9 md:pb-0 md:pl-16 lg:pl-24">
            <div className="max-w-sm text-center md:text-left mx-auto md:mx-0">
              <p className="text-[11px] md:text-xs uppercase tracking-[0.3em] text-brand-funk">
                Wooden Cold Pressed
              </p>
              <h2 className="mt-3 font-display font-medium text-brand-ink text-[30px] md:text-[44px] leading-[1.08]">
                Pressed slow,{" "}
                <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
                  kept pure
                </span>
                .
              </h2>
              <p className="mt-3 text-brand-ink/80 text-sm md:text-[15px] leading-relaxed">
                Our groundnut oil is extracted in a traditional wooden press and left unrefined, so it keeps its natural aroma and nutrition.
              </p>
              <Link
                href="/shop?category=oils"
                className="mt-6 inline-flex items-center gap-2 h-11 px-7 rounded-full bg-brand-funk hover:bg-brand-funkDark text-white text-sm tracking-wide transition-colors"
              >
                Shop Now
                <ArrowRight size={16} strokeWidth={1.75} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
