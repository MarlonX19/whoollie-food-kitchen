"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/catalog", label: "Catálogo" },
  { href: "/orders", label: "Pedidos" },
  { href: "/kds", label: "Cozinha" },
  { href: "/inventory", label: "Estoque" },
];

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-2 text-sm">
      {links.map((l) => (
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


