"use client";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/offers-data";
import CartCrossSell from "@/components/common/CartCrossSell";
import CartOffersNote from "@/components/common/CartOffersNote";
import CartCoupon from "@/components/common/CartCoupon";
import CartGiftBar from "@/components/common/CartGiftBar";
import { itemHref } from "@/lib/hamper-data";

export default function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, coupon, discount, total } = useCart();
  const freeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingPct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <>
      <div
        onClick={closeCart}
        aria-hidden
        className={`fixed inset-0 z-[60] bg-brand-ink/30 transition-opacity duration-300 ${ isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none" }`}
      />

      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-full max-w-[30rem] bg-white z-[70] rounded-l-2xl overflow-hidden shadow-[-8px_0_32px_-8px_rgba(31,45,36,0.25)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col ${ isOpen ? "translate-x-0" : "translate-x-full" }`}
      >
        <div className="flex items-center justify-between px-5 py-1.5 border-b border-brand-line">
          <div className="flex items-center gap-2">
            <Image src="/images/logos/pk-farms-logo.png" alt="" width={479} height={457} className="h-9 w-auto mix-blend-multiply" />
            <h2 className="font-display font-medium text-brand-ink text-lg">
              Your Cart
              {items.length > 0 && (
                <span className="ml-1.5 text-brand-muted font-medium text-sm">({items.length})</span>
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="w-8 h-8 grid place-items-center rounded-full text-brand-ink hover:bg-brand-cream transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-brand-strip grid place-items-center">
              <ShoppingBag size={26} className="text-brand-funk" />
            </div>
            <p className="font-display font-medium text-brand-ink">Your cart is empty</p>
            <p className="text-sm text-brand-muted">Add something pure to your kitchen.</p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-2 inline-flex items-center h-11 px-6 rounded-full text-white font-medium tracking-wide text-sm transition-colors bg-brand-funk hover:bg-brand-funkDark"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Light blush strip for offers and the free-shipping nudge */}
            <div className="bg-brand-strip text-brand-funk">
              <CartOffersNote
                showNote={false}
                className="px-5 py-1"
                trailing={
                  <div className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap text-[12px] sm:text-[13px] text-brand-funk">
                    <Truck size={13} className="shrink-0 text-brand-funk" />
                    {/* Demo: always show the nudge; ₹200 is used once the threshold is already crossed. */}
                    <p className="font-bold">
                      Shop <span className="font-semibold">₹{freeShipping ? 200 : FREE_SHIPPING_THRESHOLD - subtotal}</span>{" "}
                      more &amp; get <span className="font-semibold">FREE shipping</span>
                    </p>
                  </div>
                }
              />
              <div className="h-[1.5px] bg-brand-funk/15">
                <div className="h-full bg-brand-funk transition-[width] duration-500" style={{ width: `${shippingPct}%` }} />
              </div>
            </div>

            <CartGiftBar />

            <div className="flex-1 min-h-[9rem] overflow-y-auto px-5 py-1">
              {items.map((item) => (
                <div key={item.id} className="py-1.5 flex gap-3.5">
                  <div
                    className="relative w-[68px] h-[68px] rounded-xl overflow-hidden border border-brand-line shrink-0"
                    style={{ backgroundColor: `${item.tileBg}55` }}
                  >
                    <Image src={item.image} alt={item.name} fill sizes="68px" className="object-contain p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={itemHref(item.slug)}
                      onClick={closeCart}
                      className="font-display font-medium text-brand-ink text-base leading-tight hover:text-brand-funk transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {item.variant && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.variant
                          .split(" · ")
                          .filter((part) => part !== "Cart offer")
                          .map((part) => (
                            <span
                              key={part}
                              className="px-1.5 py-px rounded text-[10px] font-semibold bg-brand-strip text-brand-funk"
                            >
                              {part}
                            </span>
                          ))}
                      </div>
                    )}
                    <div className="mt-2 inline-flex items-center gap-0.5 bg-[#F4EEDD] border border-brand-ink/15 rounded-md p-px">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="w-[18px] h-[18px] grid place-items-center rounded text-brand-ink hover:bg-white transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={9} strokeWidth={2.5} />
                      </button>
                      <span className="w-4 text-center text-[10px] font-bold text-brand-ink">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="w-[18px] h-[18px] grid place-items-center rounded text-brand-ink hover:bg-white transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={9} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Remove + price stack: price row, % off, taxes */}
                  <div className="shrink-0 flex flex-col items-end text-right">
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="Remove item"
                      className="text-brand-muted hover:text-brand-ink transition-colors"
                    >
                      <X size={16} />
                    </button>
                    <div className="mt-1 flex items-baseline gap-1.5">
                      <span className="text-xs text-brand-muted line-through">₹{item.mrp * item.qty}</span>
                      <span className="font-display font-medium text-brand-ink text-base">₹{item.price * item.qty}</span>
                    </div>
                    {item.mrp > item.price && (
                      <span className="text-[11px] font-bold text-emerald-600 leading-tight">
                        {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% off
                      </span>
                    )}
                    <span className="mt-0.5 text-[10px] text-brand-muted leading-tight">Incl. of all taxes</span>
                  </div>
                </div>
              ))}
            </div>

            <CartCoupon />
            <CartCrossSell />

            <div className="border-t border-brand-line px-5 py-1.5 space-y-0 [&>div]:leading-5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-brand-muted">Subtotal</span>
                <span className="font-semibold text-brand-ink">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-brand-muted">Shipping</span>
                {freeShipping ? (
                  <span className="font-semibold text-emerald-600">Free</span>
                ) : (
                  <span className="font-semibold text-brand-ink">At checkout</span>
                )}
              </div>
              {coupon && discount > 0 && (
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-brand-muted">Coupon ({coupon})</span>
                  <span className="font-semibold text-emerald-600">−₹{discount}</span>
                </div>
              )}
              {/* Total + checkout share one row */}
              <div className="flex items-center justify-between gap-3 pt-1.5 !mt-1 border-t border-brand-line">
                <p className="flex items-baseline gap-2">
                  <span className="text-xs font-semibold text-brand-muted">Total</span>
                  <span className="font-display font-medium text-brand-ink text-xl">₹{total}</span>
                </p>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="shrink-0 inline-flex items-center justify-center gap-2 h-8 px-5 rounded-full text-white font-medium tracking-wide text-sm border border-brand-ink/40 transition-colors bg-brand-funk hover:bg-brand-funkDark"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
