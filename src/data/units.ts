import type { Unit } from "../types/Unit";

export const units: Unit[] = [
  {
    id: 1,
    name: "Centro",
    city: "Rio de Janeiro/RJ",
    address: "Av. Central, 210 — endereço fictício",
    isOpen: true,
    availableProductIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 2,
    name: "Botafogo",
    city: "Rio de Janeiro/RJ",
    address: "Rua das Oficinas, 21 — endereço fictício",
    isOpen: true,
    availableProductIds: [1, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    id: 3,
    name: "Barra da Tijuca",
    city: "Rio de Janeiro/RJ",
    address: "Av. Urbana, 710 — endereço fictício",
    isOpen: true,
    availableProductIds: [1, 2, 4, 5, 6, 7, 8, 9, 10, 13]
  }
];
