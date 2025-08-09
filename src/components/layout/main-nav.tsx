"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth";
import { can } from "@/lib/rbac";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/catalog", label: "Catálogo" },
  { href: "/orders", label: "Pedidos" },
  { href: "/kds", label: "Cozinha" },
  { href: "/inventory", label: "Estoque" },
];

export function MainNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const role = user?.role;
  return (
    <nav className="flex items-center gap-2 text-sm">
      {links
        .filter((l) => {
          if (l.href === "/dashboard") return can(role, "view_dashboard");
          if (l.href === "/catalog") return can(role, "view_catalog");
          if (l.href === "/orders") return can(role, "view_orders");
          if (l.href === "/kds") return can(role, "view_kds");
          if (l.href === "/inventory") return can(role, "view_inventory");
          return true;
        })
        .map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "rounded-xl px-3 py-2 hover:bg-amber-100",
              pathname?.startsWith(l.href)
                ? "bg-amber-200 text-amber-900"
                : "text-zinc-700"
            )}
          >
            {l.label}
          </Link>
        ))}
    </nav>
  );
}


