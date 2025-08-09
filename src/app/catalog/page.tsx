"use client";

import { useMemo, useState } from "react";
import type { Category, Product } from "@/lib/mock-data";
import { currencyBRL } from "@/lib/utils";
import { useDb } from "@/lib/mock-db";

export default function CatalogPage() {
  const { categories, products } = useDb();
  const [filter, setFilter] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const byName = p.name.toLowerCase().includes(filter.toLowerCase());
      const byCat = categoryId ? p.categoryId === categoryId : true;
      return byName && byCat;
    });
  }, [products, filter, categoryId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-sm text-zinc-700">Buscar</label>
          <input
            className="mt-1 w-full rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Nome do produto..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-zinc-700">Categoria</label>
          <select
            className="mt-1 rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Todas</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm"
          >
            <div className="text-lg font-medium">{p.name}</div>
            <div className="text-zinc-600">{currencyBRL(p.price)}</div>
            {p.flags?.length ? (
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {p.flags.map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-amber-100 px-2 py-1 text-amber-800"
                  >
                    {f}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
