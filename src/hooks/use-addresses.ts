"use client";

import { useCallback, useEffect, useState } from "react";
import type { Address, AddressFormValues } from "@/types/address";

const STORAGE_KEY = "agilis-addresses";

const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    cep: "07115-000",
    street: "R. Cristiano Elisário Bilo",
    number: "40",
    complement: "Apto 12B",
    createdAt: new Date().toISOString(),
  },
  {
    id: "addr-2",
    cep: "01310-100",
    street: "Av. Paulista",
    number: "1578",
    complement: "Conjunto 302",
    createdAt: new Date().toISOString(),
  },
];

function getStoredAddresses(): Address[] {
  if (typeof window === "undefined") return DEFAULT_ADDRESSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Address[];
    }
  } catch {
    // fallback
  }
  return DEFAULT_ADDRESSES;
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(DEFAULT_ADDRESSES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const stored = getStoredAddresses();
    setAddresses(stored);

    const handleStorage = () => {
      setAddresses(getStoredAddresses());
    };

    window.addEventListener("agilis-addresses-changed", handleStorage);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("agilis-addresses-changed", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const addAddress = useCallback(async (values: AddressFormValues) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const newAddress: Address = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...values,
      };

      const current = getStoredAddresses();
      const updated = [newAddress, ...current];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event("agilis-addresses-changed"));
      }
      setAddresses(updated);
      return newAddress;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteAddress = useCallback(async (id: string) => {
    const current = getStoredAddresses();
    const updated = current.filter((a) => a.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("agilis-addresses-changed"));
    }
    setAddresses(updated);
  }, []);

  return { addresses, isLoading, addAddress, deleteAddress };
}