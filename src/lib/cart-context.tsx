"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { findOffer } from "@/lib/offers-data";
import { getProductBySlug } from "@/lib/product-data";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  tileBg: string;
  variant?: string;
  qty: number;
};

type AddableItem = Omit<CartItem, "qty" | "id">;

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: AddableItem, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  note: string;
  setNote: (note: string) => void;
  coupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discount: number;
  total: number;
  subtotal: number;
  mrpTotal: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "pk-farms-cart";
const NOTE_KEY = "pk-farms-cart-note";

const makeId = (slug: string, variant?: string) => (variant ? `${slug}::${variant}` : slug);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [note, setNote] = useState("");
  const [coupon, setCoupon] = useState<string | null>(null);

  useEffect(() => {
    try {
      setNote(localStorage.getItem(NOTE_KEY) ?? "");
    } catch {}
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(NOTE_KEY, note);
    } catch {}
  }, [note, hydrated]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved: CartItem[] = JSON.parse(raw);
        // Refresh the photo from the catalogue so carts saved before an image change show the current one
        setItems(
          saved.map((i) => ({
            ...i,
            id: i.id ?? makeId(i.slug, i.variant),
            image: getProductBySlug(i.slug)?.image ?? i.image,
          }))
        );
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const addItem = (item: AddableItem, qty = 1) => {
    const id = makeId(item.slug, item.variant);
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...item, id, qty }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id: string, qty: number) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));

  const clearCart = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.price * i.qty, 0), [items]);
  const mrpTotal = useMemo(() => items.reduce((sum, i) => sum + i.mrp * i.qty, 0), [items]);
  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  // Returns false for an unknown code so the UI can show an error.
  const applyCoupon = (code: string) => {
    const offer = findOffer(code);
    if (!offer) return false;
    setCoupon(offer.code);
    return true;
  };
  const discount = useMemo(() => {
    const offer = coupon ? findOffer(coupon) : undefined;
    return offer ? Math.min(offer.discount(subtotal), subtotal) : 0;
  }, [coupon, subtotal]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQty,
        clearCart,
        note,
        setNote,
        coupon,
        applyCoupon,
        removeCoupon: () => setCoupon(null),
        discount,
        total: subtotal - discount,
        subtotal,
        mrpTotal,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
