"use client";
import { useState } from "react";
import { MapPin, Pencil, Trash2, Plus, ShoppingBag } from "lucide-react";
import Breadcrumb from "@/components/common/Breadcrumb";
import AddressFormModal from "@/components/common/AddressFormModal";
import { useAddresses } from "@/lib/address-context";
import type { Address } from "@/lib/addresses-data";
import type { NewAddress } from "@/lib/address-context";

export default function MyAddressesPage() {
  const { addresses, addAddress, updateAddress, removeAddress } = useAddresses();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    setModalOpen(true);
  };

  const handleSubmit = (data: NewAddress) => {
    if (editing) {
      updateAddress(editing.id, data);
    } else {
      addAddress(data);
    }
  };

  return (
    <>
      <Breadcrumb
        title="My Addresses"
        items={[{ label: "My Profile", href: "/my-account" }, { label: "My Addresses" }]}
      />

      <section className="py-10 md:py-16 bg-white">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-funk">Account</p>
            <h1 className="mt-2 font-display font-medium text-brand-ink text-2xl md:text-3xl">
              My Addresses
            </h1>
            <p className="mt-2 text-sm text-brand-muted">
              Manage the addresses you ship your orders to.
            </p>
          </div>

          {addresses.length === 0 ? (
            <div className="bg-white border border-brand-line rounded-2xl p-10 text-center">
              <div className="mx-auto w-14 h-14 rounded-full bg-brand-strip grid place-items-center mb-4">
                <ShoppingBag size={26} className="text-brand-funk" />
              </div>
              <p className="font-display font-medium text-brand-ink">No addresses saved yet</p>
              <p className="mt-1 text-sm text-brand-muted">
                Add an address so we know where to deliver your order.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="flex items-start justify-between gap-4 bg-white border border-brand-line rounded-2xl p-5"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span className="shrink-0 grid place-items-center w-10 h-10 rounded-xl bg-brand-strip text-brand-funk">
                      <MapPin size={18} strokeWidth={2} />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-medium text-brand-ink">{addr.label}</h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-brand-strip text-brand-funk text-[11px] font-semibold">
                          {addr.type === "billing" ? "Billing" : "Shipping"}
                        </span>
                        {addr.isDefault && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[11px] font-bold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-brand-ink/80 mt-1">{addr.name}</p>
                      <p className="text-sm text-brand-muted">
                        {addr.line1}
                        {addr.line2 ? `, ${addr.line2}` : ""}
                      </p>
                      {addr.landmark && <p className="text-sm text-brand-muted">Landmark: {addr.landmark}</p>}
                      <p className="text-sm text-brand-muted">
                        {addr.city}, {addr.state} – {addr.pincode}
                      </p>
                      <p className="text-sm text-brand-muted mt-1">Phone: {addr.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(addr)}
                      aria-label="Edit address"
                      className="w-9 h-9 grid place-items-center rounded-full text-brand-muted hover:text-brand-funk hover:bg-brand-cream transition-colors"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAddress(addr.id)}
                      aria-label="Delete address"
                      className="w-9 h-9 grid place-items-center rounded-full text-brand-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={openAdd}
            className="group mt-6 mx-auto flex items-center gap-2 h-12 pl-6 pr-2 rounded-full text-white font-medium tracking-wide text-basetransition-colors bg-brand-funk hover:bg-brand-funkDark"
          >
            <span>Add New Address</span>
            <span className="grid place-items-center w-8 h-8 rounded-full bg-white text-brand-funk border border-brand-line group-hover:rotate-90 transition-transform">
              <Plus size={16} strokeWidth={2.5} />
            </span>
          </button>
        </div>
      </section>

      <AddressFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initial={editing}
      />
    </>
  );
}
