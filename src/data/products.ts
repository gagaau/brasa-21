import type { Product } from "../types/Product";

export const products: Product[] = [
  // Burgers
  {
    id: 1,
    name: "Brasa Classic",
    description: "Pão brioche, smash burger, cheddar, alface, tomate e molho da casa.",
    price: 28.90,
    category: "Burgers"
  },
  {
    id: 2,
    name: "Double Heat",
    description: "Dois smash burgers, cheddar duplo, bacon e maionese picante.",
    price: 38.90,
    category: "Burgers"
  },
  {
    id: 3,
    name: "Smoke House",
    description: "Burger artesanal, queijo defumado, bacon, cebola caramelizada e molho barbecue.",
    price: 36.90,
    category: "Burgers"
  },
  {
    id: 4,
    name: "Bacon Melt",
    description: "Smash burger, cheddar cremoso, bacon crocante e maionese especial.",
    price: 34.90,
    category: "Burgers"
  },

  // Combos
  {
    id: 5,
    name: "Combo Classic",
    description: "Brasa Classic, porção individual de batatas fritas e refrigerante em lata.",
    price: 45.90,
    promotionalPrice: 39.90,
    category: "Combos"
  },
  {
    id: 6,
    name: "Combo Heat",
    description: "Double Heat, porção individual de batatas fritas e refrigerante em lata.",
    price: 55.90,
    category: "Combos"
  },

  // Acompanhamentos
  {
    id: 7,
    name: "Fries",
    description: "Batatas fritas douradas e crocantes, com sal e tempero da casa.",
    price: 14.90,
    category: "Acompanhamentos"
  },
  {
    id: 8,
    name: "Cheddar Bacon Fries",
    description: "Batatas fritas cobertas com cheddar cremoso e bacon crocante.",
    price: 22.90,
    category: "Acompanhamentos"
  },
  {
    id: 9,
    name: "Onion Rings",
    description: "Anéis de cebola empanados, sequinhos e crocantes, com molho da casa.",
    price: 18.90,
    category: "Acompanhamentos"
  },

  // Bebidas
  {
    id: 10,
    name: "Cola Zero",
    description: "Refrigerante sabor cola sem açúcar, lata de 350 ml.",
    price: 8.90,
    category: "Bebidas"
  },
  {
    id: 11,
    name: "Citrus Soda",
    description: "Soda cítrica com limão, gelo e um toque refrescante de hortelã, 400 ml.",
    price: 12.90,
    category: "Bebidas"
  },

  // Sobremesas
  {
    id: 12,
    name: "Choco Shake",
    description: "Milkshake de chocolate com calda cremosa e chantilly, 400 ml.",
    price: 19.90,
    category: "Sobremesas"
  },
  {
    id: 13,
    name: "Vanilla Shake",
    description: "Milkshake de baunilha com chantilly e calda de caramelo, 400 ml.",
    price: 18.90,
    category: "Sobremesas"
  }
];
