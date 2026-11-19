import type { Address } from "@/types/address";

export const DEFAULT_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    cep: "07115-000",
    street: "R. Cristiano Elisário Bilo",
    number: "40",
    complement: "Apto 12B",
    city: "Guarulhos",
    state: "SP",
    createdAt: new Date().toISOString(),
  },
  {
    id: "addr-2",
    cep: "01310-100",
    street: "Av. Paulista",
    number: "1578",
    complement: "Conjunto 302",
    city: "São Paulo",
    state: "SP",
    createdAt: new Date().toISOString(),
  },
];
