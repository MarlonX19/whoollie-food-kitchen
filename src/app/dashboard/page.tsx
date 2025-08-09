"use client";

import { useEffect, useState } from "react";
import { currencyBRL } from "@/lib/utils";
import { BarChart3, Receipt, ShoppingCart, Utensils } from "lucide-react";
import { useDb } from "@/lib/mock-db";

type KPI = { label: string; value: string; icon: React.ReactNode };

export default function DashboardPage() {
  const [kpis, setKpis] = useState<KPI[]>([]);

  const { orders, products } = useDb();
  useEffect(() => {
    const numOrders = orders.length;
    const sales = orders.reduce((acc, o) => {
      const sum = o.items.reduce((s, it) => {
        const p = products.find((pp) => pp.id === it.productId);
        return s + (p ? p.price * it.qty : 0);
      }, 0);
      return acc + sum;
    }, 0);
    const ticket = numOrders ? sales / numOrders : 0;
    setKpis([
      { label: "Vendas (hoje)", value: currencyBRL(sales), icon: <Receipt className="h-5 w-5" /> },
      { label: "Pedidos", value: String(numOrders), icon: <ShoppingCart className="h-5 w-5" /> },
      { label: "Ticket médio", value: currencyBRL(ticket), icon: <BarChart3 className="h-5 w-5" /> },
      { label: "Em preparo", value: String(orders.filter((o) => o.status === "preparing").length), icon: <Utensils className="h-5 w-5" /> },
    ]);
  }, [orders, products]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((k) => (
        <div key={k.label} className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-zinc-700">{k.label}</div>
            <div className="text-amber-700">{k.icon}</div>
          </div>
          <div className="mt-2 text-2xl font-semibold">{k.value}</div>
        </div>
      ))}
    </div>
  );
}


