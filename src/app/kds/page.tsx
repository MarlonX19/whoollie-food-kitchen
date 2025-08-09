"use client";

import { useMemo, useState } from "react";
import { useDb } from "@/lib/mock-db";
import { Button } from "@/components/ui/button";

export default function KdsPage() {
  const { tickets, markTicketDone } = useDb();
  const [station, setStation] = useState<string>("");

  const filtered = useMemo(
    () => (station ? tickets.filter((t) => t.station === station) : tickets),
    [tickets, station]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div>
          <label className="text-sm text-zinc-700">Estação</label>
          <select
            className="mt-1 rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={station}
            onChange={(e) => setStation(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="bar">Bar</option>
            <option value="grill">Grelha</option>
            <option value="salad">Saladas</option>
            <option value="dessert">Sobremesas</option>
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm"
          >
            <div className="text-sm text-zinc-600">{t.station}</div>
            <div className="text-lg font-medium">{t.productName}</div>
            <div className="text-zinc-700">Qtd: {t.qty}</div>
            <div className="text-xs text-zinc-500">Pedido: {t.orderId}</div>
            <div className="mt-3 flex justify-end">
              <Button onClick={() => markTicketDone(t.id)}>Pronto</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
