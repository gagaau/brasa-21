import type { Product } from "./Product";

export type CartItem = {
    id: string;
    product: Product;
    quantity: number;
    observation: string;
  };
