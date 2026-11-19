"use client";

import { useCallback, useEffect, useState } from "react";
import type { Address, AddressFormValues } from "@/types/address";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress as deleteAddressApi,
} from "@/lib/services/addresses-service";

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAddresses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchAddresses();
      setAddresses(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      console.warn(`[Addresses] Falha ao carregar endereços: ${msg}`);
      setError("Não foi possível carregar seus endereços. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAddresses();
  }, [loadAddresses]);

  const addAddress = useCallback(async (values: AddressFormValues): Promise<Address> => {
    setIsLoading(true);
    try {
      const created = await createAddress(values);
      setAddresses((prev) => [created, ...prev]);
      return created;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const editAddress = useCallback(
    async (id: string, values: AddressFormValues): Promise<Address> => {
      setIsLoading(true);
      try {
        const updated = await updateAddress(id, values);
        setAddresses((prev) => prev.map((a) => (a.id === id ? updated : a)));
        return updated;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const removeAddress = useCallback(async (id: string) => {
    // Remoção otimista
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    try {
      await deleteAddressApi(id);
    } catch {
      // Se falhar, recarrega do servidor
      void loadAddresses();
    }
  }, [loadAddresses]);

  return {
    addresses,
    isLoading,
    error,
    refetch: loadAddresses,
    addAddress,
    editAddress,
    deleteAddress: removeAddress,
  };
}
