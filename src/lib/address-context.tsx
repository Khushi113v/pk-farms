"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { Address, SEED_ADDRESSES } from "./addresses-data";

export type NewAddress = Omit<Address, "id">;

type AddressContextValue = {
  addresses: Address[];
  addAddress: (a: NewAddress) => Address;
  updateAddress: (id: string, a: NewAddress) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
};

const AddressContext = createContext<AddressContextValue | null>(null);
const STORAGE_KEY = "pk-farms-addresses-v2";

function makeId() {
  return `addr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>(SEED_ADDRESSES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAddresses((JSON.parse(raw) as Address[]).map((a) => ({ ...a, type: a.type ?? "shipping" })));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    } catch {}
  }, [addresses, hydrated]);

  const addAddress = (a: NewAddress) => {
    const newAddress: Address = { ...a, id: makeId() };
    setAddresses((prev) => {
      const makeDefault = a.isDefault || prev.length === 0;
      const next = makeDefault ? prev.map((p) => ({ ...p, isDefault: false })) : prev;
      return [...next, { ...newAddress, isDefault: makeDefault }];
    });
    return newAddress;
  };

  const updateAddress = (id: string, a: NewAddress) => {
    setAddresses((prev) => {
      let next = prev.map((p) => (p.id === id ? { ...a, id } : p));
      if (a.isDefault) {
        next = next.map((p) => (p.id === id ? p : { ...p, isDefault: false }));
      }
      return next;
    });
  };

  const removeAddress = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length > 0 && !filtered.some((p) => p.isDefault)) {
        filtered[0] = { ...filtered[0], isDefault: true };
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));
  };

  return (
    <AddressContext.Provider
      value={{ addresses, addAddress, updateAddress, removeAddress, setDefaultAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const ctx = useContext(AddressContext);
  if (!ctx) throw new Error("useAddresses must be used within an AddressProvider");
  return ctx;
}
