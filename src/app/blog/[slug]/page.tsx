import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock, CheckCircle2, ArrowUpRight } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import { BLOG_POSTS, getPostBySlug } from "@/lib/blog-data";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Blogs — PK Farms" };
  return {
    title: `${post.title} — PK Farms`,
    description: post.excerpt,
  };
}

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <Breadcrumb
        title={post.title}
        items={[{ label: "Blogs", href: "/blog" }, { label: post.category }]}
      />

      <article className="relative py-14 md:py-20 overflow-hidden bg-white">
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <span
            className={`inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-wider ${post.categoryBg} ${post.categoryText} rounded-full px-2.5 py-1`}
          >
            {post.category}
          </span>

          <h1 className="mt-4 font-display font-medium text-brand-ink text-[26px] sm:text-3xl md:text-[42px] leading-[1.15]">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-sm text-brand-muted">
            <span className="font-semibold text-brand-ink">{post.author}</span>
            <span>{post.date}</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} strokeWidth={2.5} />
              {post.readTime}
            </span>
          </div>

          <div className="relative mt-8 aspect-[16/8] rounded-3xl overflow-hidden border border-brand-line">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1024px"
              className="object-cover object-[center_25%]"
              priority
            />
          </div>

          <div className="mt-10 max-w-4xl mx-auto">
            {post.content.map((block, idx) => {
              if (block.type === "h") {
                return (
                  <h2
                    key={idx}
                    className="font-display font-medium text-brand-ink text-xl md:text-2xl mt-8 mb-3 first:mt-0"
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "list") {
                return (
                  <ul key={idx} className="space-y-3 my-5">
                    {block.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2
                          size={19}
                          strokeWidth={2}
                          className="shrink-0 mt-0.5 text-brand-funk"
                        />
                        <span className="text-brand-ink/85 text-[15px] md:text-base leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={idx}
                  className="text-brand-ink/85 text-[15px] md:text-base leading-relaxed mb-5"
                >
                  {block.text}
                </p>
              );
            })}
          </div>

          {/* Shop the product mentioned in this article */}
          {post.productName && post.productHref && (
            <div className="mt-12 max-w-4xl mx-auto rounded-3xl bg-brand-cream border border-brand-line p-6 md:p-7 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {post.productImage && (
                  <div className="relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white border border-brand-line overflow-hidden">
                    <Image
                      src={post.productImage}
                      alt={post.productName}
                      fill
                      sizes="80px"
                      className="object-cover object-top"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-funk mb-1">
                    Featured in this article
                  </p>
                  <p className="font-display font-medium text-brand-ink text-lg md:text-xl">
                    {post.productName}
                  </p>
                </div>
              </div>
              <Link
                href={post.productHref}
                className="group shrink-0 inline-flex items-center gap-2 pl-5 pr-2 py-2 rounded-full text-white font-medium tracking-wide text-sm transition-colors bg-brand-funk hover:bg-brand-funkDark"
              >
                <span>Shop {post.productName}</span>
                <span className="grid place-items-center w-8 h-8 rounded-full bg-white text-brand-funk border border-brand-line transition-transform">
                  <ArrowUpRight size={14} strokeWidth={3} />
                </span>
              </Link>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
