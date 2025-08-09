import type { UserRole } from "./auth";

export type Permission =
  | "view_dashboard"
  | "view_catalog"
  | "view_orders"
  | "advance_orders"
  | "view_kds"
  | "close_orders"
  | "view_inventory"
  | "adjust_inventory";

const rolePermissions: Record<UserRole, Permission[]> = {
  owner: [
    "view_dashboard",
    "view_catalog",
    "view_orders",
    "advance_orders",
    "close_orders",
    "view_kds",
    "view_inventory",
    "adjust_inventory",
  ],
  manager: [
    "view_dashboard",
    "view_catalog",
    "view_orders",
    "advance_orders",
    "close_orders",
    "view_kds",
    "view_inventory",
  ],
  attendant: ["view_orders", "advance_orders", "view_dashboard"],
  kitchen: ["view_kds"],
  inventory: ["view_inventory", "adjust_inventory"],
  finance: ["view_dashboard"],
  admin: [
    "view_dashboard",
    "view_catalog",
    "view_orders",
    "advance_orders",
    "close_orders",
    "view_kds",
    "view_inventory",
    "adjust_inventory",
  ],
};

export function can(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return rolePermissions[role]?.includes(permission) ?? false;
}


