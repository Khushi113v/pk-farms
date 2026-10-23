import Image from "next/image";
import Link from "next/link";
import { Star, Quote, BadgeCheck } from "lucide-react";
import { PRODUCTS } from "@/lib/product-data";

// Text reviews from customers. `product` is a product slug; its photo and name are shown on the card.
type Review = { name: string; location: string; rating: number; product: string; title: string; text: string };

const REVIEWS: Review[] = [
  {
    name: "Anjali Sharma",
    location: "Delhi",
    rating: 5,
    product: "pure-desi-cow-ghee",
    title: "Tastes like my nani's ghee",
    text: "The aroma when you open the jar is unreal. Grainy texture, golden colour, and it tastes exactly like the ghee we used to get from the village.",
  },
  {
    name: "Rohit Verma",
    location: "Jaipur",
    rating: 5,
    product: "raw-honey",
    title: "Real raw honey, finally",
    text: "It crystallised after a few weeks, which is how I knew it was genuine. Lovely flavour in warm water every morning.",
  },
  {
    name: "Priya Nair",
    location: "Bengaluru",
    rating: 5,
    product: "wood-pressed-groundnut-oil",
    title: "Food smells like home",
    text: "Switched from refined oil and the difference in our tadka is huge. Nutty, fresh and not heavy at all.",
  },
  {
    name: "Sunita Agarwal",
    location: "Lucknow",
    rating: 5,
    product: "heeng-compounded-asafoetida",
    title: "A pinch is enough",
    text: "Very strong and aromatic. Our dal tastes so much better, and the jar keeps the smell locked in.",
  },
  {
    name: "Karan Mehta",
    location: "Mumbai",
    rating: 4,
    product: "pure-desi-cow-ghee",
    title: "Worth every rupee",
    text: "A little pricier than the supermarket brands, but you can taste the difference. Packing was neat and it arrived quickly.",
  },
  {
    name: "Neha Gupta",
    location: "Pune",
    rating: 5,
    product: "raw-honey",
    title: "My kids love it",
    text: "Thick, rich and not overly sweet. We use it on toast and in milk. Will keep ordering.",
  },
  {
    name: "Vikram Singh",
    location: "Chandigarh",
    rating: 5,
    product: "wood-pressed-groundnut-oil",
    title: "Pure and honest",
    text: "You can see it is unrefined from the colour itself. Great for frying pakoras without any heaviness.",
  },
  {
    name: "Meera Iyer",
    location: "Chennai",
    rating: 5,
    product: "heeng-compounded-asafoetida",
    title: "Best heeng I have used",
    text: "Fresh and powerful aroma. Even my mother approved, and she is very particular about her heeng.",
  },
];

// Summary shown under the heading, worked out from the product data
const TOTAL_REVIEWS = PRODUCTS.reduce((n, p) => n + p.reviewCount, 0);
const AVG_RATING = (PRODUCTS.reduce((n, p) => n + p.rating * p.reviewCount, 0) / TOTAL_REVIEWS).toFixed(1);

const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          className={i < rating ? "fill-brand-tan text-brand-tan" : "fill-brand-line text-brand-line"}
        />
      ))}
    </div>
  );
}

function ReviewCard({ r }: { r: Review }) {
  const product = PRODUCTS.find((p) => p.slug === r.product);
  return (
    <figure className="relative shrink-0 w-[300px] sm:w-[360px] rounded-3xl bg-white border border-brand-line p-6 md:p-7 shadow-[0_18px_40px_-30px_rgba(31,45,36,0.4)] flex flex-col">
      <Quote size={36} strokeWidth={1.5} className="absolute top-5 right-6 text-brand-tan/25 fill-brand-tan/15" />

      <Stars rating={r.rating} />
      <h3 className="mt-3 font-hero font-bold text-brand-ink text-lg leading-snug pr-8">{r.title}</h3>
      <blockquote className="mt-2 text-[14px] leading-relaxed text-brand-ink/75 line-clamp-4">“{r.text}”</blockquote>

      <figcaption className="mt-auto pt-5 flex items-center gap-3 border-t border-brand-line/70">
        <span className="grid place-items-center w-10 h-10 shrink-0 rounded-full bg-brand-funk text-white text-sm font-semibold">
          {initials(r.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-1 text-sm font-semibold text-brand-ink">
            {r.name}
            <BadgeCheck size={14} strokeWidth={2} className="text-brand-funk" aria-label="Verified buyer" />
          </span>
          <span className="block text-xs text-brand-muted">{r.location} · Verified buyer</span>
        </span>
        {product && (
          <Link
            href={`/products/${product.slug}`}
            title={product.name}
            className="relative w-11 h-11 shrink-0 rounded-xl border border-brand-line bg-white overflow-hidden hover:border-brand-funk/40 transition-colors"
          >
            <Image src={product.image} alt={product.name} fill sizes="44px" className="object-contain p-1" />
          </Link>
        )}
      </figcaption>
    </figure>
  );
}

// One endlessly scrolling row; hovering pauses it so a review can be read.
function Row({ items }: { items: Review[] }) {
  const loop = [...items, ...items];
  return (
    <div className="group/row relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div
        className="flex w-max gap-5 py-3 animate-marquee group-hover/row:[animation-play-state:paused]"
        style={{ animationDuration: "80s" }}
      >
        {loop.map((r, i) => (
          <ReviewCard key={i} r={r} />
        ))}
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="relative bg-brand-cream py-12 md:py-16 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-10">
          <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.28em] text-brand-tan">Customer love</p>
          <h2 className="mt-2 font-hero font-bold text-brand-ink text-[30px] sm:text-4xl md:text-[46px] leading-[1.08]">
            What our <span className="italic text-brand-funk">customers</span> say
          </h2>
          <div className="mt-4 inline-flex items-center gap-3 rounded-full bg-white border border-brand-line px-4 py-2">
            <Stars rating={5} size={15} />
            <span className="text-sm text-brand-ink">
              <span className="font-bold">{AVG_RATING}</span>/5
              <span className="text-brand-muted"> · {TOTAL_REVIEWS.toLocaleString("en-IN")}+ reviews</span>
            </span>
          </div>
        </div>
      </div>

      {/* Single scrolling row */}
      <Row items={REVIEWS} />
    </section>
  );
}
