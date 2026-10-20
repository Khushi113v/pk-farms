"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";

type LastOrder = {
  id: string;
  date: string;
  items: { name: string; variant?: string; image: string; price: number; qty: number }[];
  subtotal: number;
  discount: number;
  giftWrap?: number;
  codFee?: number;
  paymentMethod?: string;
  total: number;
  coupon: string | null;
  shippingName: string;
  shippingLine: string;
};

const BUTTON =
  "inline-flex items-center justify-center gap-2 h-11 px-7 rounded-full font-medium tracking-wide text-sm transition-colors";

export default function ThankYouPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pk-farms-last-order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, []);

  return (
    <>
      <Breadcrumb title="Thank You" items={[{ label: "Thank You" }]} />

      <section className="py-10 md:py-16 bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="mx-auto grid place-items-center w-16 h-16 rounded-full bg-brand-strip text-brand-funk">
              <CheckCircle2 size={34} strokeWidth={1.5} />
            </span>
            <h1 className="mt-5 font-display font-medium text-brand-ink text-3xl md:text-4xl">
              Thank you for your order
            </h1>
            <p className="mt-3 text-brand-muted text-[15px] leading-relaxed">
              Your order has been placed. We will send you an email and SMS with the tracking link once it ships.
            </p>
          </div>

          {order && (
            <div className="mt-8 bg-white border border-brand-line rounded-2xl p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-brand-line text-sm">
                <p>
                  <span className="text-brand-muted">Order ID </span>
                  <span className="font-semibold text-brand-ink">{order.id}</span>
                </p>
                <p className="text-brand-muted">
                  {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>

              <ul className="divide-y divide-brand-line">
                {order.items.map((i, idx) => (
                  <li key={idx} className="flex items-center gap-3 py-3">
                    <span className="relative shrink-0 w-14 h-[70px] rounded-lg overflow-hidden border border-brand-line">
                      <Image src={i.image} alt={i.name} fill sizes="56px" className="object-contain p-1" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-display font-medium text-brand-ink text-sm truncate">{i.name}</span>
                      <span className="block text-xs text-brand-muted">
                        {[i.variant, `Qty ${i.qty}`].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <span className="text-sm font-semibold text-brand-ink">₹{i.price * i.qty}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-brand-line space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-brand-muted">Subtotal</span>
                  <span className="text-brand-ink">₹{order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-brand-muted">Discount{order.coupon ? ` (${order.coupon})` : ""}</span>
                    <span className="text-emerald-600">−₹{order.discount}</span>
                  </div>
                )}
                {!!order.codFee && (
                  <div className="flex items-center justify-between">
                    <span className="text-brand-muted">Cash on Delivery fee</span>
                    <span className="text-brand-ink">₹{order.codFee}</span>
                  </div>
                )}
                {!!order.giftWrap && (
                  <div className="flex items-center justify-between">
                    <span className="text-brand-muted">Gift wrap</span>
                    <span className="text-brand-ink">₹{order.giftWrap}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-brand-line">
                  <span className="font-display font-medium text-brand-ink">Total</span>
                  <span className="font-display font-medium text-brand-ink text-lg">₹{order.total}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-brand-line text-sm">
                <p className="font-display font-medium text-brand-ink">Shipping to</p>
                <p className="mt-1 text-brand-ink/80">{order.shippingName}</p>
                <p className="text-brand-muted">{order.shippingLine}</p>
                {order.paymentMethod && (
                  <p className="mt-3">
                    <span className="text-brand-muted">Payment: </span>
                    <span className="text-brand-ink">{order.paymentMethod}</span>
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/my-orders" className={`${BUTTON} text-white bg-brand-funk hover:bg-brand-funkDark`}>
              View My Orders
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/shop"
              className={`${BUTTON} border border-brand-line text-brand-ink hover:border-brand-funk hover:text-brand-funk`}
            >
              Continue Shopping
            </Link>
          </div>

          <p className="mt-6 text-center text-xs text-brand-muted">
            Need to change something? Read our{" "}
            <Link href="/refund-cancellation" className="underline underline-offset-2 text-brand-funk">
              Refund &amp; Cancellation Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
