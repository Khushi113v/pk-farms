"use client";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import ProductCard from "@/components/common/ProductCard";
import { useWishlist } from "@/lib/wishlist-context";
import { getProductBySlug } from "@/lib/product-data";

export default function WishlistPage() {
  const { slugs, removeFromWishlist } = useWishlist();
  const saved = slugs.filter((slug) => getProductBySlug(slug));

  return (
    <>
      <Breadcrumb title="Wishlist" items={[{ label: "My Profile", href: "/my-account" }, { label: "Wishlist" }]} />

      <section className="py-10 md:py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-funk">Account</p>
            <h1 className="mt-2 font-display font-medium text-brand-ink text-2xl md:text-3xl">Wishlist</h1>
            <p className="mt-2 text-sm text-brand-muted">Products you&apos;ve saved for later.</p>
          </div>

          {saved.length === 0 ? (
            <div className="max-w-md mx-auto bg-white border border-brand-line rounded-2xl p-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-brand-strip grid place-items-center mb-4">
                <Heart size={26} className="text-brand-funk" />
              </div>
              <p className="font-display font-medium text-brand-ink">Your wishlist is empty</p>
              <p className="mt-1 text-sm text-brand-muted">
                Tap the heart icon on any product to save it here for later.
              </p>
              <Link
                href="/shop"
                className="group mt-5 inline-flex items-center gap-2 h-11 pl-6 pr-2 rounded-full text-white font-medium tracking-wide text-sm transition-colors bg-brand-funk hover:bg-brand-funkDark"
              >
                <span>Browse Shop</span>
                <span className="grid place-items-center w-7 h-7 rounded-full bg-white text-brand-funk border border-brand-line transition-transform">
                  <ArrowRight size={13} strokeWidth={3} />
                </span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {saved.map((slug) => (
                <ProductCard key={slug} slug={slug} onRemove={() => removeFromWishlist(slug)} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
