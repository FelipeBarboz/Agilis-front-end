export interface ProfileService {
  id: number;
  name: string;
  price: string;
  duration: string;
}

export const mockProfileServices: ProfileService[] = [
  { id: 1,  name: "Limpeza Completa",                 price: "R$ 150,00", duration: "2h" },
  { id: 2,  name: "Manutenção Preventiva",             price: "R$ 80,00",  duration: "1h" },
  { id: 3,  name: "Tratamento de Algas",               price: "R$ 120,00", duration: "1h30" },
  { id: 4,  name: "Regulagem de pH",                   price: "R$ 60,00",  duration: "45min" },
  { id: 5,  name: "Troca de Areia do Filtro",          price: "R$ 200,00", duration: "3h" },
  { id: 6,  name: "Instalação de Bomba",               price: "R$ 350,00", duration: "4h" },
  { id: 7,  name: "Impermeabilização",                 price: "R$ 500,00", duration: "6h" },
  { id: 8,  name: "Pintura de Piscina",                price: "R$ 800,00", duration: "8h" },
  { id: 9,  name: "Limpeza de Azulejos",               price: "R$ 180,00", duration: "2h30" },
  { id: 10, name: "Revisão Elétrica",                  price: "R$ 250,00", duration: "3h" },
  { id: 11, name: "Instalação de Aquecedor Solar",     price: "R$ 1.200,00", duration: "1 dia" },
  { id: 12, name: "Instalação de Iluminação LED",      price: "R$ 450,00", duration: "5h" },
  { id: 13, name: "Desentupimento de Ralos",           price: "R$ 90,00",  duration: "1h" },
  { id: 14, name: "Análise de Água Completa",          price: "R$ 70,00",  duration: "30min" },
  { id: 15, name: "Cloração de Choque",                price: "R$ 100,00", duration: "1h" },
  { id: 16, name: "Limpeza de Filtro Cartucho",        price: "R$ 55,00",  duration: "40min" },
  { id: 17, name: "Substituição de Válvula Retentora", price: "R$ 160,00", duration: "2h" },
  { id: 18, name: "Reparo de Vazamento",               price: "R$ 300,00", duration: "4h" },
  { id: 19, name: "Limpeza de Bordas e Deck",          price: "R$ 130,00", duration: "1h30" },
  { id: 20, name: "Aspiração de Fundo",                price: "R$ 95,00",  duration: "1h" },
  { id: 21, name: "Revisão Geral de Equipamentos",     price: "R$ 220,00", duration: "2h30" },
  { id: 22, name: "Troca de Diafragma da Bomba",       price: "R$ 180,00", duration: "2h" },
  { id: 23, name: "Instalação de Skimmer",             price: "R$ 390,00", duration: "4h" },
  { id: 24, name: "Manutenção de Spa / Jacuzzi",       price: "R$ 280,00", duration: "3h" },
  { id: 25, name: "Cobertura e Tela de Proteção",      price: "R$ 650,00", duration: "5h" },
  { id: 26, name: "Tamponamento de Raios UV",          price: "R$ 110,00", duration: "1h" },
  { id: 27, name: "Checagem de Automação",             price: "R$ 140,00", duration: "1h30" },
  { id: 28, name: "Polimento de Vinil",                price: "R$ 170,00", duration: "2h" },
  { id: 29, name: "Nivelamento de Deck",               price: "R$ 480,00", duration: "6h" },
  { id: 30, name: "Inspeção Hidráulica Completa",      price: "R$ 320,00", duration: "3h30" },
];
