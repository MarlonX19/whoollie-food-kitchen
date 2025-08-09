"use client";

import { create } from "zustand";
import type {
  Category,
  Ingredient,
  KitchenTicket,
  Order,
  Product,
  Recipe,
} from "./mock-data";
import { categories as seedCategories, products as seedProducts, ingredients as seedIngredients, orders as seedOrders, tickets as seedTickets, recipes as seedRecipes } from "./mock-data";

export type DbState = {
  categories: Category[];
  products: Product[];
  ingredients: Ingredient[];
  orders: Order[];
  tickets: KitchenTicket[];
  recipes: Recipe[];
  advanceOrderStatus: (orderId: string) => void;
  setOrderStatus: (orderId: string, status: Order["status"]) => void;
  markTicketDone: (ticketId: string) => void;
};

function clone<T>(v: T): T {
  return structuredClone(v);
}

export const useDb = create<DbState>((set, get) => ({
  categories: clone(seedCategories),
  products: clone(seedProducts),
  ingredients: clone(seedIngredients),
  orders: clone(seedOrders),
  tickets: clone(seedTickets),
  recipes: clone(seedRecipes),

  advanceOrderStatus(orderId) {
    const nextStatus: Record<Order["status"], Order["status"]> = {
      open: "preparing",
      preparing: "ready",
      ready: "delivered",
      delivered: "closed",
      closed: "closed",
      canceled: "canceled",
    };
    set((state) => {
      const orders = state.orders.map((o) => {
        if (o.id !== orderId) return o;
        const to = nextStatus[o.status];
        const updated: Order = { ...o, status: to };
        return updated;
      });

      // If closed, consume stock
      const closed = orders.find((o) => o.id === orderId)?.status === "closed";
      let ingredients = state.ingredients;
      if (closed) {
        const order = orders.find((o) => o.id === orderId)!;
        const recipes = state.recipes;
        ingredients = ingredients.map((ing) => ({ ...ing }));
        for (const item of order.items) {
          const recipe = recipes.find((r) => r.productId === item.productId);
          if (!recipe) continue;
          for (const ri of recipe.items) {
            const idx = ingredients.findIndex((i) => i.id === ri.ingredientId);
            if (idx >= 0) {
              const loss = recipe.yieldPercent ?? 1;
              const qty = ri.quantity * item.qty / (loss || 1);
              ingredients[idx] = {
                ...ingredients[idx],
                stock: Math.max(0, Number(ingredients[idx].stock) - qty),
              };
            }
          }
        }
      }

      return { orders, ingredients };
    });
  },

  setOrderStatus(orderId, status) {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  },

  markTicketDone(ticketId) {
    set((state) => ({ tickets: state.tickets.filter((t) => t.id !== ticketId) }));
  },
}));


