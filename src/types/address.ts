export interface Address {
  id: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  createdAt: string;
}

export type AddressFormValues = Omit<Address, "id" | "createdAt">;