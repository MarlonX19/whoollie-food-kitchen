export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  imageUrl?: string;
  flags?: Array<"vegan" | "gluten_free" | "spicy">;
};

export type Ingredient = {
  id: string;
  name: string;
  unit: "kg" | "g" | "l" | "ml" | "un";
  stock: number;
  minLevel?: number;
  maxLevel?: number;
};

export type RecipeItem = {
  ingredientId: string;
  quantity: number; // in unit of ingredient
};

export type Recipe = {
  productId: string;
  items: RecipeItem[];
  yieldPercent?: number; // to model loss/waste
};

export type OrderItem = {
  id: string;
  productId: string;
  qty: number;
  notes?: string;
};

export type Order = {
  id: string;
  type: "table" | "counter" | "delivery";
  tableNumber?: string;
  status: "open" | "preparing" | "ready" | "delivered" | "closed" | "canceled";
  items: OrderItem[];
  createdAt: string;
};

export type KitchenTicket = {
  id: string;
  station: "bar" | "grill" | "salad" | "dessert";
  orderId: string;
  orderItemId: string;
  productName: string;
  qty: number;
  startedAt?: string;
};

export const categories: Category[] = [
  { id: "cat_starters", name: "Entradas" },
  { id: "cat_drinks", name: "Bebidas" },
  { id: "cat_mains", name: "Pratos" },
  { id: "cat_desserts", name: "Sobremesas" },
];

export const products: Product[] = [
  { id: "p_burger", name: "Burger da Casa", categoryId: "cat_mains", price: 34.9, flags: ["spicy"] },
  { id: "p_salad", name: "Salada Verde", categoryId: "cat_mains", price: 24.9, flags: ["vegan", "gluten_free"] },
  { id: "p_fries", name: "Batata Frita", categoryId: "cat_starters", price: 14.9 },
  { id: "p_soda", name: "Refrigerante Lata", categoryId: "cat_drinks", price: 7.9 },
  { id: "p_brownie", name: "Brownie", categoryId: "cat_desserts", price: 12.9 },
];

export const ingredients: Ingredient[] = [
  { id: "i_beef", name: "Carne Bovina", unit: "g", stock: 5000, minLevel: 1000 },
  { id: "i_bun", name: "Pão de Burger", unit: "un", stock: 40, minLevel: 20 },
  { id: "i_lettuce", name: "Alface", unit: "g", stock: 1500 },
  { id: "i_potato", name: "Batata", unit: "kg", stock: 10 },
  { id: "i_coke", name: "Refri Lata", unit: "un", stock: 60 },
  { id: "i_chocolate", name: "Chocolate", unit: "g", stock: 1000 },
];

export const recipes: Recipe[] = [
  {
    productId: "p_burger",
    yieldPercent: 0.95,
    items: [
      { ingredientId: "i_beef", quantity: 180 },
      { ingredientId: "i_bun", quantity: 1 },
      { ingredientId: "i_lettuce", quantity: 20 },
    ],
  },
  {
    productId: "p_salad",
    yieldPercent: 0.9,
    items: [{ ingredientId: "i_lettuce", quantity: 120 }],
  },
  {
    productId: "p_fries",
    items: [{ ingredientId: "i_potato", quantity: 0.25 }], // kg
  },
  { productId: "p_soda", items: [{ ingredientId: "i_coke", quantity: 1 }] },
  { productId: "p_brownie", items: [{ ingredientId: "i_chocolate", quantity: 50 }] },
];

export const orders: Order[] = [
  {
    id: "o_1001",
    type: "table",
    tableNumber: "12",
    status: "open",
    createdAt: new Date().toISOString(),
    items: [
      { id: "oi_1", productId: "p_burger", qty: 2 },
      { id: "oi_2", productId: "p_fries", qty: 1 },
      { id: "oi_3", productId: "p_soda", qty: 2 },
    ],
  },
  {
    id: "o_1002",
    type: "counter",
    status: "preparing",
    createdAt: new Date().toISOString(),
    items: [
      { id: "oi_4", productId: "p_salad", qty: 1 },
      { id: "oi_5", productId: "p_soda", qty: 1 },
    ],
  },
];

export const tickets: KitchenTicket[] = [
  {
    id: "kt_1",
    station: "grill",
    orderId: "o_1001",
    orderItemId: "oi_1",
    productName: "Burger da Casa",
    qty: 2,
  },
  {
    id: "kt_2",
    station: "salad",
    orderId: "o_1002",
    orderItemId: "oi_4",
    productName: "Salada Verde",
    qty: 1,
  },
];


