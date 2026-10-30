import type { Product } from "../types/Product";

export const products: Product[] = [
  {id: 1, name: "Baião de Dois", description: "Arroz com feijão de corda, carne de sol e queijo coalho.", price: 28.90, category: "Pratos"},
  {id: 2, name: "Combo Nordestino", description: "Baião de Dois + Carne de Sol + Refrigerante 350 ml.", price: 42.90, category: "Combos", promotionalPrice: 36.90},
  {id: 3, name: "Suco de Umbu", description: "Suco natural de umbu, 300 ml.", price: 9.90, category: "Bebidas"},
  {id: 4, name: "Bolo de Rolo", description: "Fatias de bolo de rolo com recheio de goiabada.", price: 14.90, category: "Sobremesas", seasonalMonths: [10, 11]}
];
