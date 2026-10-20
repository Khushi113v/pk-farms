import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Package, Clock, Truck, CheckCircle2, MapPin, CreditCard, XCircle } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import OrderRequestButton from "@/components/common/OrderRequest";
import { ORDERS, getOrderById, orderSubtotal } from "@/lib/orders-data";

const STEPS = [
  { label: "Placed", icon: Package },
  { label: "Processing", icon: Clock },
  { label: "Shipped", icon: Truck },
  { label: "Delivered", icon: CheckCircle2 },
];

export function generateStaticParams() {
  return ORDERS.map((o) => ({ id: o.id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const order = getOrderById(params.id);
  if (!order) return { title: "Order — PK Farms" };
  return { title: `Order #${order.id} — PK Farms` };
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = getOrderById(params.id);
  if (!order) notFound();

  const subtotal = orderSubtotal(order);
  const total = subtotal - order.discount + order.shippingFee;

  const activeStep =
    order.status === "Processing" ? 1 : order.status === "Shipped" ? 2 : order.status === "Delivered" ? 3 : 0;

  return (
    <>
      <Breadcrumb
        title="My Orders"
        items={[
          { label: "My Profile", href: "/my-account" },
          { label: "My Orders", href: "/my-orders" },
          { label: `#${order.id}` },
        ]}
      />

      <section className="py-10 md:py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/my-orders"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-funk hover:text-brand-ink transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to Orders
          </Link>

          {/* Order header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-brand-line rounded-2xl p-5 mb-6">
            <div>
              <p className="font-display font-medium text-brand-ink text-lg">Order #{order.id}</p>
              <p className="text-sm text-brand-muted mt-1">
                Placed on <span className="font-semibold text-brand-ink">{order.date}</span>
                {order.arrivingBy && (
                  <>
                    {" "}
                    · Arriving by <span className="font-semibold text-brand-ink">{order.arrivingBy}</span>
                  </>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.status} />
              <OrderRequestButton orderId={order.id} status={order.status} />
            </div>
          </div>

          {/* Progress tracker */}
          {order.status === "Cancelled" ? (
            <div className="flex items-center gap-3 bg-white border border-brand-line rounded-2xl p-5 mb-6">
              <span className="grid place-items-center w-10 h-10 rounded-full bg-[#F1F0EE] text-[#78716C] shrink-0">
                <XCircle size={20} strokeWidth={2} />
              </span>
              <div>
                <p className="font-display font-medium text-brand-ink">This order was cancelled</p>
                <p className="text-sm text-brand-muted">No further action is needed.</p>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-brand-line rounded-2xl p-6 mb-6">
              <div className="flex items-center">
                {STEPS.map((step, idx) => {
                  const Icon = step.icon;
                  const done = idx <= activeStep;
                  return (
                    <div key={step.label} className="flex-1 flex items-center last:flex-none">
                      <div className="flex flex-col items-center gap-2">
                        <span
                          className={`grid place-items-center w-10 h-10 rounded-full border-2 shrink-0 ${ done ? "text-white border-brand-ink" : "text-brand-muted border-brand-line bg-white" }`}
                          style={done ? { backgroundColor: "#0B5B36" } : undefined}
                        >
                          <Icon size={18} strokeWidth={2} />
                        </span>
                        <span className={`text-xs font-semibold ${done ? "text-brand-ink" : "text-brand-muted"}`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div className={`flex-1 h-[2px] mx-2 mb-5 ${idx < activeStep ? "bg-brand-funk" : "bg-brand-line"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
              {order.trackingId && (
                <p className="text-center text-sm text-brand-muted mt-4">
                  Tracking ID: <span className="font-semibold text-brand-ink">{order.trackingId}</span>
                </p>
              )}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6 items-start">
            {/* Items */}
            <div className="lg:col-span-2 bg-white border border-brand-line rounded-2xl p-5 md:p-6">
              <h2 className="font-display font-medium text-brand-ink text-lg mb-4">Items in this order</h2>
              <div className="divide-y divide-brand-line">
                {order.items.map((item) => (
                  <div key={item.slug} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-brand-line bg-brand-cream shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-display font-medium text-brand-ink text-sm hover:text-brand-funk transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-brand-muted mt-0.5">
                        {item.variant} · Qty {item.qty}
                      </p>
                    </div>
                    <span className="font-display font-medium text-brand-ink text-sm shrink-0">
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <div className="bg-white border border-brand-line rounded-2xl p-5 md:p-6">
                <h2 className="font-display font-medium text-brand-ink text-base mb-4">Price Summary</h2>
                <div className="space-y-2.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-brand-muted">Subtotal</span>
                    <span className="font-semibold text-brand-ink">₹{subtotal}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-brand-muted">Discount</span>
                      <span className="font-semibold text-emerald-600">−₹{order.discount}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-brand-muted">Shipping</span>
                    <span className="font-semibold text-emerald-600">
                      {order.shippingFee === 0 ? "Free" : `₹${order.shippingFee}`}
                    </span>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-brand-line flex items-center justify-between">
                  <span className="font-display font-medium text-brand-ink">You Paid</span>
                  <span className="font-display font-medium text-brand-ink text-lg">₹{total}</span>
                </div>
              </div>

              <div className="bg-white border border-brand-line rounded-2xl p-5 md:p-6">
                <h2 className="flex items-center gap-2 font-display font-medium text-brand-ink text-base mb-3">
                  <MapPin size={16} className="text-brand-funk" />
                  Billing Address
                </h2>
                <p className="text-sm font-semibold text-brand-ink">{order.billingAddress.name}</p>
                <p className="text-sm text-brand-muted mt-1">
                  {order.billingAddress.line1}, {order.billingAddress.line2}
                </p>
                <p className="text-sm text-brand-muted">
                  {order.billingAddress.city}, {order.billingAddress.state} — {order.billingAddress.pincode}
                </p>
                <p className="text-sm text-brand-muted mt-2">{order.billingAddress.phone}</p>
              </div>

              <div className="bg-white border border-brand-line rounded-2xl p-5 md:p-6">
                <h2 className="flex items-center gap-2 font-display font-medium text-brand-ink text-base mb-3">
                  <MapPin size={16} className="text-brand-funk" />
                  Shipping Address
                </h2>
                <p className="text-sm font-semibold text-brand-ink">{order.shippingAddress.name}</p>
                <p className="text-sm text-brand-muted mt-1">
                  {order.shippingAddress.line1}, {order.shippingAddress.line2}
                </p>
                <p className="text-sm text-brand-muted">
                  {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </p>
                <p className="text-sm text-brand-muted mt-2">{order.shippingAddress.phone}</p>
              </div>

              <div className="bg-white border border-brand-line rounded-2xl p-5 md:p-6">
                <h2 className="flex items-center gap-2 font-display font-medium text-brand-ink text-base mb-3">
                  <CreditCard size={16} className="text-brand-funk" />
                  Payment Method
                </h2>
                <p className="text-sm font-semibold text-brand-ink">{order.paymentMethod}</p>
                <p className="text-xs text-brand-muted mt-1">Paid on {order.paidOn}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
