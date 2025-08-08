import {
  categories,
  products,
  orders,
  tickets,
  ingredients,
  recipes,
  type Category,
  type Product,
  type Order,
  type KitchenTicket,
  type Ingredient,
  type Recipe,
} from "./mock-data";

function withLatency<T>(data: T, ms = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(structuredClone(data)), ms));
}

export const api = {
  // Catalog
  async listCategories(): Promise<Category[]> {
    return withLatency(categories);
  },
  async listProducts(): Promise<Product[]> {
    return withLatency(products);
  },
  async getProduct(id: string): Promise<Product | undefined> {
    return withLatency(products.find((p) => p.id === id));
  },

  // Inventory
  async listIngredients(): Promise<Ingredient[]> {
    return withLatency(ingredients);
  },
  async listRecipes(): Promise<Recipe[]> {
    return withLatency(recipes);
  },

  // Orders
  async listOrders(): Promise<Order[]> {
    return withLatency(orders);
  },

  // KDS
  async listKitchenTickets(): Promise<KitchenTicket[]> {
    return withLatency(tickets);
  },
};


