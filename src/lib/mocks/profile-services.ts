export interface ProfileService {
  id: number;
  name: string;
  price: string;
  duration: string;
}

export const mockProfileServices: ProfileService[] = [
  { id: 1, name: "Limpeza Completa", price: "R$ 150,00", duration: "2h" },
  { id: 2, name: "Manutenção", price: "R$ 80,00", duration: "1h" },
];
