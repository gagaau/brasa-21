import type { Unit } from "./Unit";
import type { CartItem } from "./CartItem";

export type Order = {
  id: number;
  userId: number;
  unit: Unit;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  usedPoints: number;
  pointsToEarn: number;
  status: "Recebido" | "Em preparação" | "Pronto para retirada" | "Concluído";
};

