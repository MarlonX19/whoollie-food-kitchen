"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/mock-api";
import type { Ingredient } from "@/lib/mock-data";

export default function InventoryPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function load() {
      const list = await api.listIngredients();
      setIngredients(list);
    }
    load();
  }, []);

  const filtered = useMemo(
    () =>
      ingredients.filter((i) => i.name.toLowerCase().includes(query.toLowerCase())),
    [ingredients, query]
  );

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-zinc-700">Buscar insumo</label>
        <input
          className="mt-1 w-full max-w-sm rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
          placeholder="Nome do insumo..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-amber-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-amber-100 text-amber-900">
            <tr>
              <th className="px-3 py-2 text-left">Insumo</th>
              <th className="px-3 py-2 text-left">Estoque</th>
              <th className="px-3 py-2 text-left">Unidade</th>
              <th className="px-3 py-2 text-left">Min</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id} className="border-t">
                <td className="px-3 py-2">{i.name}</td>
                <td className="px-3 py-2">{i.stock}</td>
                <td className="px-3 py-2">{i.unit}</td>
                <td className="px-3 py-2">{i.minLevel ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


