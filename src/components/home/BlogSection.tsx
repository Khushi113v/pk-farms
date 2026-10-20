"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { BLOG_POSTS } from "@/lib/blog-data";

export default function BlogSection() {
  const posts = BLOG_POSTS.slice(0, 4);

  return (
    <section className="relative py-6 md:py-8 overflow-hidden bg-white">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-6 md:mb-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-brand-funk bg-brand-strip px-3 py-1.5 rounded-full border border-brand-funk/30">
              <Sparkles size={12} strokeWidth={2.5} />
              From the PK Farms journal
            </span>
            <h2 className="mt-4 font-display font-medium text-brand-ink text-[30px] sm:text-4xl md:text-5xl leading-[1.05]">
              The art of{" "}
              <span className="italic font-script font-medium text-brand-funk text-[1em] leading-none">
                dressing
              </span>{" "}
              well.
            </h2>
          </div>
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 self-start md:self-auto text-brand-ink font-semibold text-sm md:text-base border-b-2 border-brand-ink pb-1 hover:text-brand-funk hover:border-brand-funk transition"
          >
            All blogs
            <ArrowUpRight
              size={18}
              strokeWidth={2.5}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {posts.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group relative bg-white rounded-2xl overflow-hidden border border-brand-line transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div className="relative aspect-[16/12.5] overflow-hidden bg-brand-cream">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-[center_22%] group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-3 left-3 inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-wider ${p.categoryBg} ${p.categoryText} rounded-full px-2.5 py-1`}
                >
                  {p.category}
                </span>
              </div>

              {/* Text */}
              <div className="flex-1 flex flex-col p-4 md:p-4 pb-3.5">
                <h3 className="font-display font-medium text-brand-ink text-base md:text-lg leading-snug group-hover:text-brand-funk transition-colors">
                  {p.title}
                </h3>
                <p className="mt-1.5 mb-3 text-sm text-brand-muted leading-relaxed line-clamp-2">
                  {p.excerpt}
                </p>

                {/* Meta */}
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
  );
}
