import { Service } from "./types";

// : Service[] = Ini TypeScript! Artinya: "Variabel ini harus berisi array (kumpulan) dari object Service". Tanda [] berarti array/list.

export const dummyServices: Service[] = [
  {
    id: "svc-001",
    name: "Haircut Reguler",
    price: 50000,
    duration: 30,
    description: "Potong rambut standar dengan gunting dan clipper.",
  },
  {
    id: "svc-002",
    name: "Beard Trim",
    price: 30000,
    duration: 20,
    description: "Cukur dan rapikan jenggot atau kumis.",
  },
  {
    id: "svc-003",
    name: "Haircut + Beard",
    price: 75000,
    duration: 45,
    description: "Paket lengkap potong rambut dan cukur jenggot.",
  },
];