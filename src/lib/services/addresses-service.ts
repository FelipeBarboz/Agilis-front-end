import { api } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import type { Address, AddressFormValues } from "@/types/address";

async function getCurrentUserId(): Promise<string> {
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user?.id) {
      return data.session.user.id;
    }
  } catch {}
  return "";
}

/** GET /api/v1/users/me/addresses */
export async function fetchAddresses(): Promise<Address[]> {
  const data = await api<Address[]>("/api/v1/users/me/addresses");
  return Array.isArray(data) ? data : [];
}

/** POST /api/v1/users/me/addresses */
export async function createAddress(
  values: AddressFormValues & { userId?: string }
): Promise<Address> {
  const currentId = await getCurrentUserId();
  const userId = values.userId ?? currentId;
  return await api<Address>("/api/v1/users/me/addresses", {
    method: "POST",
    body: JSON.stringify({
      userId,
      street: values.street,
      number: values.number,
      complement: values.complement ?? "",
      city: values.city,
      state: values.state,
      cep: values.cep,
    }),
  });
}

/** PUT /api/v1/users/me/addresses/{addressId} */
export async function updateAddress(
  addressId: string,
  values: AddressFormValues & { requesterId?: string }
): Promise<Address> {
  const currentId = await getCurrentUserId();
  const requesterId = values.requesterId ?? currentId;
  return await api<Address>(`/api/v1/users/me/addresses/${encodeURIComponent(addressId)}`, {
    method: "PUT",
    body: JSON.stringify({
      requesterId,
      addressId,
      street: values.street,
      number: values.number,
      complement: values.complement ?? "",
      city: values.city,
      state: values.state,
      cep: values.cep,
    }),
  });
}

/** DELETE /api/v1/users/me/addresses/{addressId} */
export async function deleteAddress(addressId: string): Promise<void> {
  await api<void>(`/api/v1/users/me/addresses/${encodeURIComponent(addressId)}`, {
    method: "DELETE",
  });
}
