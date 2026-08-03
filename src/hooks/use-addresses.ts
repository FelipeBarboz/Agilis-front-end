"use client";

import { useCallback, useState } from "react";
import type { Address, AddressFormValues } from "@/types/address";

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addAddress = useCallback(async (values: AddressFormValues) => {
    setIsLoading(true);
    try {
      // TODO: trocar por chamada real à API, ex:
      // const res = await api.post("/addresses", values);
      const newAddress: Address = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...values,
      };
      setAddresses((prev) => [...prev, newAddress]);
      return newAddress;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { addresses, isLoading, addAddress };
}