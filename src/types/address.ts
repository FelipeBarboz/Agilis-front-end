export interface Address {
  id: string;
  userId?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  createdAt?: string;
}

export type AddressFormValues = Omit<Address, "id" | "userId" | "createdAt">;
