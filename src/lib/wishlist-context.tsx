"use client";
import { createContext, useContext, useEffect, useState } from "react";

type WishlistContextValue = {
  slugs: string[];
  isWishlisted: (slug: string) => boolean;
  toggleWishlist: (slug: string) => void;
  removeFromWishlist: (slug: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);
const STORAGE_KEY = "pk-farms-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSlugs(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {}
  }, [slugs, hydrated]);

  const isWishlisted = (slug: string) => slugs.includes(slug);

  const toggleWishlist = (slug: string) => {
    setSlugs((prev) => (prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]));
  };

  const removeFromWishlist = (slug: string) => {
    setSlugs((prev) => prev.filter((s) => s !== slug));
  };

  return (
    <WishlistContext.Provider value={{ slugs, isWishlisted, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
