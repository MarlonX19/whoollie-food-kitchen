"use client";

import { useMemo, useState } from "react";
import type { Order, Product } from "@/lib/mock-data";
import { currencyBRL } from "@/lib/utils";
import { useDb } from "@/lib/mock-db";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";
import { can } from "@/lib/rbac";

export default function OrdersPage() {
  const { orders, products, advanceOrderStatus } = useDb();
  const [status, setStatus] = useState<string>("");
  const role = useAuthStore((s) => s.user?.role);

  const filtered = useMemo(() => {
    const list: Order[] = status
      ? orders.filter((o) => o.status === status)
      : orders;
    return list;
  }, [orders, status]);

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div>
          <label className="text-sm text-zinc-700">Status</label>
          <select
            className="mt-1 rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="open">Aberto</option>
            <option value="preparing">Em preparo</option>
            <option value="ready">Pronto</option>
            <option value="delivered">Entregue</option>
            <option value="closed">Encerrado</option>
            <option value="canceled">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((o) => {
          const total = o.items.reduce((acc, it) => {
            const p = products.find((pp) => pp.id === it.productId);
            return acc + (p ? p.price * it.qty : 0);
          }, 0);
          return (
            <div
              key={o.id}
              className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between text-sm text-zinc-600">
                <div>#{o.id}</div>
                <div className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800">
                  {o.status}
                </div>
              </div>
              <div className="mt-2 text-lg font-medium">
                {o.type === "table" ? `Mesa ${o.tableNumber}` : o.type}
              </div>
              <ul className="mt-2 text-sm text-zinc-700">
                {o.items.map((it) => {
                  const p = products.find((pp) => pp.id === it.productId);
                  return (
                    <li key={it.id}>
                      {it.qty}x {p?.name ?? it.productId}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-2 text-right text-zinc-800">
                {currencyBRL(total)}
              </div>
              {can(role, "advance_orders") && (
                <div className="mt-3 flex justify-end">
                  <Button onClick={() => advanceOrderStatus(o.id)}>
                    Avançar status
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
