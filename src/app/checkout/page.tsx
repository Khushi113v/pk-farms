"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, X, ShoppingBag, ShieldCheck, Truck, RotateCcw, ArrowRight, MapPin, Check, Gift, CreditCard, Banknote } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import CartOffersNote from "@/components/common/CartOffersNote";
import { useCart } from "@/lib/cart-context";
import { FREE_SHIPPING_THRESHOLD, GIFT_WRAP_FEE, COD_FEE } from "@/lib/offers-data";
import { useAddresses } from "@/lib/address-context";
import { itemHref } from "@/lib/hamper-data";


// Shows the saved addresses marked for this use (billing or shipping); addresses without a use show in both
function AddressSection({
  title,
  kind,
  selectedId,
  onSelect,
  showManage,
}: {
  title: string;
  kind: "billing" | "shipping";
  selectedId?: string;
  onSelect: (id: string) => void;
  showManage?: boolean;
}) {
  const { addresses: all } = useAddresses();
  const addresses = all.filter((a) => !a.type || a.type === kind);
  return (
    <div className="bg-white border border-brand-line rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="font-display font-medium text-brand-ink text-base flex items-center gap-2">
          <MapPin size={16} className="text-brand-funk" />
          {title}
        </h2>
        {showManage && (
          <Link
            href="/my-addresses"
            className="text-xs font-semibold text-brand-funk hover:text-brand-ink transition-colors"
          >
            Manage addresses
          </Link>
        )}
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-sm text-brand-muted mb-3">
            You haven&apos;t saved a {kind} address yet. Add one in My Addresses to place your order.
          </p>
          <Link
            href="/my-addresses"
            className="inline-flex items-center justify-center h-11 px-8 rounded-full text-white font-medium tracking-wide text-sm transition-colors bg-brand-funk hover:bg-brand-funkDark"
          >
            Go to My Addresses
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {addresses.map((addr) => {
            const selected = selectedId === addr.id;
            return (
              <button
                key={addr.id}
                type="button"
                onClick={() => onSelect(addr.id)}
                className={`text-left rounded-2xl border-2 p-4 transition-colors ${ selected ? "border-brand-funk bg-brand-strip/40" : "border-brand-line hover:border-brand-ink/40" }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-medium text-brand-ink text-sm">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-bold">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
                  {addr.name} · {addr.line1}, {addr.line2}, {addr.city} – {addr.pincode}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  const { items, removeItem, updateQty, subtotal, mrpTotal, coupon, discount, total, clearCart } = useCart();
  const router = useRouter();
  const [orderError, setOrderError] = useState("");
  const savings = mrpTotal - subtotal;
  const [giftWrap, setGiftWrap] = useState(false);
  const [payment, setPayment] = useState<"cod" | "online">("online");
  const codFee = payment === "cod" ? COD_FEE : 0;
  const payable = total + (giftWrap ? GIFT_WRAP_FEE : 0) + codFee;

  const { addresses } = useAddresses();
  const [billingAddress, setBillingAddress] = useState<string | undefined>(undefined);
  const [shippingAddress, setShippingAddress] = useState<string | undefined>(undefined);

  // Keep each selection valid; both start on the default address
  // Keep each selection valid, preferring the default address of the right kind
  useEffect(() => {
    const pick = (kind: "billing" | "shipping") => (current?: string) => {
      const list = addresses.filter((a) => !a.type || a.type === kind);
      if (list.length === 0) return undefined;
      if (current && list.some((a) => a.id === current)) return current;
      return (list.find((a) => a.isDefault) ?? list[0]).id;
    };
    setBillingAddress(pick("billing"));
    setShippingAddress(pick("shipping"));
  }, [addresses]);

  // Saves a summary for the thank-you page, empties the cart and goes there
  const placeOrder = () => {
    const billing = addresses.find((a) => a.id === billingAddress);
    const shipping = addresses.find((a) => a.id === shippingAddress);
    if (!billing || !shipping) {
      setOrderError("Please choose a billing and a shipping address. Add them in My Addresses.");
      return;
    }
    setOrderError("");
    const order = {
      id: `PKF${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      items: items.map((i) => ({ name: i.name, variant: i.variant, image: i.image, price: i.price, qty: i.qty })),
      subtotal,
      discount,
      giftWrap: giftWrap ? GIFT_WRAP_FEE : 0,
      codFee,
      total: payable,
      coupon: coupon ?? null,
      paymentMethod: payment === "cod" ? "Cash on Delivery" : "Paid online",
      shippingName: shipping.name,
      shippingLine: `${shipping.line1}, ${shipping.line2}, ${shipping.city}, ${shipping.state} – ${shipping.pincode}`,
    };
    try {
      sessionStorage.setItem("pk-farms-last-order", JSON.stringify(order));
    } catch {}
    clearCart();
    router.push("/thank-you");
  };

  const [showMobileBar, setShowMobileBar] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowMobileBar(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Breadcrumb title="Checkout" items={[{ label: "Checkout" }]} />

      <section className="pt-10 md:pt-16 pb-28 lg:pb-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 gap-4">
              <div className="w-20 h-20 rounded-full bg-brand-strip grid place-items-center">
                <ShoppingBag size={34} className="text-brand-funk" />
              </div>
              <h2 className="font-display font-medium text-brand-ink text-xl">Your cart is empty</h2>
              <p className="text-brand-muted text-sm max-w-sm">
                Looks like you haven&apos;t added anything yet. Explore our ghee, honey, oils and spices
                collections.
              </p>
              <Link
                href="/shop"
                className="mt-2 inline-flex items-center gap-2 h-12 px-8 rounded-full text-white font-medium tracking-wide text-basetransition-colors bg-brand-funk hover:bg-brand-funkDark"
              >
                Start Shopping
                <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4 mb-6">
                <h1 className="font-display font-medium text-brand-ink text-2xl md:text-3xl">
                  Review Your Order
                  <span className="ml-2 text-brand-muted font-medium text-base align-middle">
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                </h1>
                <Link
                  href="/shop"
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-brand-funk hover:text-brand-ink transition-colors"
                >
                  ← Continue Shopping
                </Link>
              </div>
              <Link
                href="/shop"
                className="sm:hidden mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-funk hover:text-brand-ink transition-colors"
              >
                ← Continue Shopping
              </Link>

              <div className="grid lg:grid-cols-3 gap-8 md:gap-10 items-start">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => {
                  const discountPct = Math.round(((item.mrp - item.price) / item.mrp) * 100);
                  return (
                  <div key={item.id} className="flex gap-4 bg-white border border-brand-line rounded-2xl p-4">
                    <div
                      className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-brand-line shrink-0"
                      style={{ backgroundColor: `${item.tileBg}33` }}
                    >
                      <Image src={item.image} alt={item.name} fill sizes="112px" className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={itemHref(item.slug)}
                          className="font-display font-medium text-brand-ink text-lg leading-snug hover:text-brand-funk transition-colors"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                          className="shrink-0 w-8 h-8 grid place-items-center rounded-full text-brand-muted hover:text-brand-ink hover:bg-brand-cream transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      {item.variant && (
                        <p className="mt-0.5 text-xs font-semibold text-brand-muted">
                          {item.variant.split(" · ").filter((part) => part !== "Cart offer").join(" · ")}
                        </p>
                      )}
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-lg font-semibold text-brand-ink">₹{item.price}</span>
                        <span className="text-sm text-brand-muted line-through">₹{item.mrp}</span>
                        {discountPct > 0 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                            {discountPct}% off
                          </span>
                        )}
                      </div>
                      <div className="mt-auto pt-3 flex items-center justify-between">
                        <div className="inline-flex items-center gap-1 bg-[#F4EEDD] border border-brand-ink/15 rounded-lg p-1">
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="w-7 h-7 grid place-items-center rounded text-brand-ink hover:bg-white transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} strokeWidth={2.5} />
                          </button>
                          <span className="w-6 text-center text-sm font-bold text-brand-ink">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="w-7 h-7 grid place-items-center rounded text-brand-ink hover:bg-white transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} strokeWidth={2.5} />
                          </button>
                        </div>
                        <span className="font-display font-medium text-brand-ink text-lg">
                          ₹{item.price * item.qty}
                        </span>
                      </div>
                    </div>
                  </div>
                  );
                })}

                <AddressSection
                  title="Billing Address"
                  kind="billing"
                  selectedId={billingAddress}
                  onSelect={setBillingAddress}
                  showManage
                />

                <AddressSection
                  title="Shipping Address"
                  kind="shipping"
                  selectedId={shippingAddress}
                  onSelect={setShippingAddress}
                />

                {/* Payment method */}
                <div className="bg-white border border-brand-line rounded-2xl p-5">
                  <h2 className="font-display font-medium text-brand-ink text-base flex items-center gap-2 mb-3">
                    <CreditCard size={16} className="text-brand-funk" />
                    Payment Method
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {(
                      [
                        { id: "online", icon: CreditCard, title: "Pay Now", note: "UPI, cards and net banking" },
                        { id: "cod", icon: Banknote, title: "Cash on Delivery", note: `Pay on delivery · +₹${COD_FEE} extra` },
                      ] as const
                    ).map(({ id, icon: Icon, title, note }) => {
                      const on = payment === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setPayment(id)}
                          aria-pressed={on}
                          className={`flex items-center gap-3 text-left rounded-2xl border-2 p-4 transition-colors ${
                            on ? "border-brand-funk bg-brand-strip/40" : "border-brand-line hover:border-brand-ink/40"
                          }`}
                        >
                          <span className="shrink-0 grid place-items-center w-10 h-10 rounded-full bg-brand-strip text-brand-funk">
                            <Icon size={18} strokeWidth={1.6} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display font-medium text-brand-ink text-sm">{title}</span>
                            <span className="block text-xs text-brand-muted">{note}</span>
                          </span>
                          <span
                            aria-hidden
                            className={`shrink-0 grid place-items-center w-5 h-5 rounded-full border-2 ${on ? "border-brand-funk" : "border-brand-line"}`}
                          >
                            {on && <span className="w-2.5 h-2.5 rounded-full bg-brand-funk" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Order summary */}
              <div className="lg:sticky lg:top-24 bg-white border border-brand-line rounded-2xl p-5 md:p-6 space-y-4">
                <h2 className="font-display font-medium text-brand-ink text-lg">Order Summary</h2>

                <CartOffersNote
                  showOffers={false}
                  trailing={
                    <label
                      className={`inline-flex items-center gap-1.5 h-6 pl-1.5 pr-2.5 rounded-full border text-xs cursor-pointer select-none transition-colors ${
                        giftWrap ? "border-brand-funk bg-brand-strip" : "border-brand-funk/20 bg-[#F3F6EC] hover:bg-brand-strip"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => setGiftWrap(e.target.checked)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden
                        className={`grid place-items-center w-3.5 h-3.5 rounded-[4px] border transition-colors ${
                          giftWrap ? "bg-brand-funk border-brand-funk text-white" : "bg-white border-brand-funk/40 text-transparent"
                        }`}
                      >
                        <Check size={10} strokeWidth={3.5} />
                      </span>
                      <Gift size={13} className="text-brand-funk" />
                      <span className="font-display font-bold text-brand-ink">Gift wrap</span>
                      <span className="font-semibold text-brand-funk">₹{GIFT_WRAP_FEE}</span>
                    </label>
                  }
                />

                <div className="space-y-2.5 text-sm pt-3 border-t border-brand-line">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-muted">Subtotal</span>
                    <span className="font-semibold text-brand-ink">₹{subtotal}</span>
                  </div>
                  {savings > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-brand-muted">You save</span>
                      <span className="font-semibold text-emerald-600">−₹{savings}</span>
                    </div>
                  )}
                  {codFee > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-brand-muted">Cash on Delivery fee</span>
                      <span className="font-semibold text-brand-ink">₹{codFee}</span>
                    </div>
                  )}
                  {codFee > 0 && (
                    <p className="-mt-1 w-fit rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0 text-[11px] leading-[18px] font-medium text-emerald-700">
                      You will save ₹{COD_FEE} if you pay now
                    </p>
                  )}
                  {giftWrap && (
                    <div className="flex items-center justify-between">
                      <span className="text-brand-muted">Gift wrap</span>
                      <span className="font-semibold text-brand-ink">₹{GIFT_WRAP_FEE}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-brand-muted">Shipping</span>
                    {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <span className="font-semibold text-emerald-600">Free</span>
                    ) : (
                      <span className="font-semibold text-brand-ink">At checkout</span>
                    )}
                  </div>
                  {coupon && discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-brand-muted">Coupon ({coupon})</span>
                      <span className="font-semibold text-emerald-600">−₹{discount}</span>
                    </div>
                  )}
                </div>
                <div className="pt-3 border-t border-brand-line flex items-center justify-between">
                  <span className="font-display font-medium text-brand-ink">Total</span>
                  <span className="font-display font-medium text-brand-ink text-xl">₹{payable}</span>
                </div>
                {orderError && <p className="text-xs text-red-500 text-center">{orderError}</p>}
                <button
                  type="button"
                  onClick={placeOrder}
                  className="hidden lg:inline-flex w-full items-center justify-center gap-2 h-11 rounded-full text-white font-medium tracking-wide text-base border border-brand-ink/40 transition-colors bg-brand-funk hover:bg-brand-funkDark"
                >
                  Place Order
                  <ArrowRight size={16} />
                </button>

                <div className="pt-3 border-t border-brand-line grid grid-cols-3 gap-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck size={18} className="text-brand-funk" />
                    <span className="text-[11px] text-brand-muted leading-tight">Secure checkout</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck size={18} className="text-brand-funk" />
                    <span className="text-[11px] text-brand-muted leading-tight">Free shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw size={18} className="text-brand-funk" />
                    <span className="text-[11px] text-brand-muted leading-tight">Easy returns</span>
                  </div>
                </div>
              </div>
              </div>

              {/* Mobile fixed checkout bar */}
              <div
                className={`lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white transition-transform duration-300 ${ showMobileBar ? "translate-y-0" : "translate-y-full" }`}
              >
                <div
                  className="h-[3px] w-full bg-brand-funk hover:bg-brand-funkDark"
                />
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-brand-muted">
                      Total ({items.length} {items.length === 1 ? "item" : "items"})
                    </p>
                    <p className="font-display font-medium text-brand-ink text-lg">₹{payable}</p>
                  </div>
                  <button
                    type="button"
                    onClick={placeOrder}
                    className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-full text-white font-medium tracking-wide text-base border border-brand-ink/40 transition-colors bg-brand-funk hover:bg-brand-funkDark"
                  >
                    Place Order
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

    </>
  );
}
