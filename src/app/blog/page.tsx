import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { BLOG_POSTS } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blogs — PK Farms",
  description:
    "Recipes, buying guides and storage tips from the PK Farms journal.",
};

export default function BlogPage() {
  return (
    <>
      <Breadcrumb title="Blogs" items={[{ label: "Blogs" }]} />

      <section className="relative py-14 md:py-20 overflow-hidden bg-brand-cream">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.2] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1F2D241F 1px, transparent 1.5px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 md:mb-14">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-brand-strip px-3 py-1.5 rounded-full border border-brand-funk/30">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-funk" />
              From the PK Farms journal
            </span>
            <h1 className="mt-4 font-display font-medium text-brand-ink text-[28px] sm:text-4xl md:text-5xl leading-[1.05]">
              The art of{" "}
              <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
                dressing
              </span>{" "}
              well.
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {BLOG_POSTS.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group relative bg-white rounded-2xl overflow-hidden border border-brand-line transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/12.5] overflow-hidden bg-brand-cream">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-[center_22%] group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-wider ${p.categoryBg} ${p.categoryText} rounded-full px-2.5 py-1`}
                  >
                    {p.category}
                  </span>
                </div>

                <div className="flex-1 flex flex-col p-4 md:p-4 pb-3.5">
                  <h2 className="font-display font-medium text-brand-ink text-base md:text-lg leading-snug group-hover:text-brand-funk transition-colors">
                    {p.title}
                  </h2>
                  <p className="mt-1.5 mb-3 text-sm text-brand-muted leading-relaxed line-clamp-2">
                    {p.excerpt}
                  </p>

                  <div className="mt-auto pt-3 border-t border-brand-line flex items-center justify-between text-xs text-brand-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock size={12} strokeWidth={2.5} />
                      {p.readTime}
                    </span>
                    <span>{p.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
