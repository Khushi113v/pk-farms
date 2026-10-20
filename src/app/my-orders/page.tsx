"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Filter, Eye } from "lucide-react";
import OrderRequestButton from "@/components/common/OrderRequest";
import Breadcrumb from "@/components/common/Breadcrumb";
import OrderStatusBadge from "@/components/common/OrderStatusBadge";
import { ORDERS, orderSubtotal, orderQty, type OrderStatus } from "@/lib/orders-data";

const STATUS_OPTIONS: (OrderStatus | "All")[] = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

function parseDate(d: string) {
  // Order dates are like "05 Sep 2026"
  return new Date(d).getTime();
}

export default function MyOrdersPage() {
  const [draftStatus, setDraftStatus] = useState<OrderStatus | "All">("All");
  const [draftFrom, setDraftFrom] = useState("");
  const [draftTo, setDraftTo] = useState("");

  const [status, setStatus] = useState<OrderStatus | "All">("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const filtered = useMemo(() => {
    return ORDERS.filter((o) => {
      if (status !== "All" && o.status !== status) return false;
      const orderTime = parseDate(o.date);
      if (from && orderTime < new Date(from).getTime()) return false;
      if (to && orderTime > new Date(to).getTime()) return false;
      return true;
    });
  }, [status, from, to]);

  const applyFilters = () => {
    setStatus(draftStatus);
    setFrom(draftFrom);
    setTo(draftTo);
  };

  return (
    <>
      <Breadcrumb title="My Orders" items={[{ label: "My Profile", href: "/my-account" }, { label: "My Orders" }]} />

      <section className="py-10 md:py-16 bg-white">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="bg-white border border-brand-line rounded-2xl p-5 mb-6 overflow-x-auto">
            <div className="flex items-end gap-4 min-w-max">
              <div className="flex-1 min-w-[140px] shrink-0">
                <label className="block text-xs font-semibold text-brand-ink mb-1.5">Status</label>
                <select
                  value={draftStatus}
                  onChange={(e) => setDraftStatus(e.target.value as OrderStatus | "All")}
                  className="w-full h-11 px-3 rounded-xl bg-brand-cream border border-brand-line text-brand-ink text-sm focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[160px] shrink-0">
                <label className="block text-xs font-semibold text-brand-ink mb-1.5">From</label>
                <input
                  type="date"
                  value={draftFrom}
                  onChange={(e) => setDraftFrom(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-brand-cream border border-brand-line text-brand-ink text-sm focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15"
                />
              </div>
              <div className="flex-1 min-w-[160px] shrink-0">
                <label className="block text-xs font-semibold text-brand-ink mb-1.5">To</label>
                <input
                  type="date"
                  value={draftTo}
                  onChange={(e) => setDraftTo(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl bg-brand-cream border border-brand-line text-brand-ink text-sm focus:outline-none focus:border-brand-funk focus:ring-4 focus:ring-brand-funk/15"
                />
              </div>
              <button
                type="button"
                onClick={applyFilters}
                className="shrink-0 inline-flex items-center gap-2 h-11 px-6 rounded-full text-white font-medium tracking-wide text-sm transition-colors bg-brand-funk hover:bg-brand-funkDark"
              >
                <Filter size={14} strokeWidth={2.5} />
                Filter
              </button>
            </div>
          </div>

          {/* Orders */}
          {filtered.length === 0 ? (
            <div className="bg-white border border-brand-line rounded-2xl p-12 text-center">
              <p className="font-display font-medium text-brand-ink text-lg">No orders match these filters.</p>
              <button
                type="button"
                onClick={() => {
                  setDraftStatus("All");
                  setDraftFrom("");
                  setDraftTo("");
                  setStatus("All");
                  setFrom("");
                  setTo("");
                }}
                className="mt-3 text-sm font-semibold text-brand-funk hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div>
              <div className="bg-white border border-brand-line rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[720px]">
                    <thead>
                      <tr className="bg-brand-funk text-white">
                        <th className="text-left font-bold uppercase tracking-wider text-xs px-5 py-3.5">
                          Order ID
                        </th>
                        <th className="text-left font-bold uppercase tracking-wider text-xs px-5 py-3.5">
                          Date
                        </th>
                        <th className="text-left font-bold uppercase tracking-wider text-xs px-5 py-3.5">
                          Quantity
                        </th>
                        <th className="text-left font-bold uppercase tracking-wider text-xs px-5 py-3.5">
                          Total
                        </th>
                        <th className="text-left font-bold uppercase tracking-wider text-xs px-5 py-3.5">
                          Status
                        </th>
                        <th className="text-right font-bold uppercase tracking-wider text-xs px-5 py-3.5">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-line">
                      {filtered.map((order) => {
                        return (
                          <tr key={order.id} className="hover:bg-brand-cream/50 transition-colors">
                            <td className="px-5 py-4 font-display font-medium text-brand-ink whitespace-nowrap">
                              #{order.id}
                            </td>
                            <td className="px-5 py-4 text-brand-muted whitespace-nowrap">{order.date}</td>
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-strip text-brand-funk text-xs font-bold">
                                {orderQty(order)}
                              </span>
                            </td>
                            <td className="px-5 py-4 font-semibold text-brand-ink whitespace-nowrap">
                              ₹{orderSubtotal(order)}
                            </td>
                            <td className="px-5 py-4">
                              <OrderStatusBadge status={order.status} />
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-end gap-2">
                                <OrderRequestButton orderId={order.id} status={order.status} />
                                <Link
                                  href={`/my-orders/${order.id}`}
                                  className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-brand-ink/25 text-brand-ink text-xs md:text-sm font-bold whitespace-nowrap hover:border-brand-ink hover:bg-brand-ink hover:text-white transition-colors"
                                >
                                  <Eye size={13} strokeWidth={2.5} />
                                  View Details
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-center text-sm text-brand-muted pt-4">
                Showing <span className="font-semibold text-brand-ink">{filtered.length}</span> of{" "}
                <span className="font-semibold text-brand-ink">{ORDERS.length}</span> orders
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
