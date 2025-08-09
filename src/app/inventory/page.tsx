"use client";

import { useMemo, useState } from "react";
import type { Ingredient } from "@/lib/mock-data";
import { useDb } from "@/lib/mock-db";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  useDialog,
} from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";

export default function InventoryPage() {
  const { ingredients } = useDb();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<{
    name: string;
    unit: Ingredient["unit"];
    stock: string;
    minLevel: string;
    maxLevel: string;
  }>({
    name: "",
    unit: "un",
    stock: "0",
    minLevel: "",
    maxLevel: "",
  });

  const filtered = useMemo(
    () =>
      ingredients.filter((i) =>
        i.name.toLowerCase().includes(query.toLowerCase())
      ),
    [ingredients, query]
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <label className="text-sm text-zinc-700">Buscar insumo</label>
          <input
            className="mt-1 w-full max-w-sm rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Nome do insumo..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full p-2" aria-label="Adicionar insumo">
              <Plus className="h-5 w-5" />
              <span className="sr-only">Adicionar insumo</span>
            </Button>
          </DialogTrigger>
          <AddIngredientForm
            form={form}
            setForm={setForm}
            onAdded={() =>
              setForm({
                name: "",
                unit: "un",
                stock: "0",
                minLevel: "",
                maxLevel: "",
              })
            }
          />
        </Dialog>
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

function AddIngredientForm({
  form,
  setForm,
  onAdded,
}: {
  form: {
    name: string;
    unit: Ingredient["unit"];
    stock: string;
    minLevel: string;
    maxLevel: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      unit: Ingredient["unit"];
      stock: string;
      minLevel: string;
      maxLevel: string;
    }>
  >;
  onAdded: () => void;
}) {
  const { addIngredient } = useDb();
  const { setOpen } = useDialog();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    addIngredient({
      name: form.name.trim(),
      unit: form.unit,
      stock: Number(form.stock) || 0,
      minLevel: form.minLevel ? Number(form.minLevel) : undefined,
      maxLevel: form.maxLevel ? Number(form.maxLevel) : undefined,
    });
    onAdded();
    setOpen(false);
  }

  return (
    <DialogContent>
      <button
        type="button"
        aria-label="Fechar"
        onClick={() => setOpen(false)}
        className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 focus-visible:outline-none focus-visible:ring-2"
      >
        <X className="h-4 w-4" />
      </button>
      <DialogHeader>
        <DialogTitle>Novo insumo</DialogTitle>
      </DialogHeader>
      <form onSubmit={submit} className="space-y-4">
        <div className="grid gap-2">
          <label className="text-sm text-zinc-700" htmlFor="name">
            Nome
          </label>
          <input
            id="name"
            className="rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="grid gap-2">
            <label className="text-sm text-zinc-700" htmlFor="unit">
              Unidade
            </label>
            <select
              id="unit"
              className="min-w-0 rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={form.unit}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  unit: e.target.value as Ingredient["unit"],
                }))
              }
            >
              <option value="un">un</option>
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="l">l</option>
              <option value="ml">ml</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-zinc-700" htmlFor="stock">
              Estoque
            </label>
            <input
              id="stock"
              type="number"
              min={0}
              step="any"
              className="min-w-0 rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={form.stock}
              onChange={(e) =>
                setForm((f) => ({ ...f, stock: e.target.value }))
              }
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm text-zinc-700" htmlFor="min">
              Min
            </label>
            <input
              id="min"
              type="number"
              min={0}
              step="any"
              className="min-w-0 rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={form.minLevel}
              onChange={(e) =>
                setForm((f) => ({ ...f, minLevel: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="grid gap-2">
          <label className="text-sm text-zinc-700" htmlFor="max">
            Max
          </label>
          <input
            id="max"
            type="number"
            min={0}
            step="any"
            className="min-w-0 rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={form.maxLevel}
            onChange={(e) =>
              setForm((f) => ({ ...f, maxLevel: e.target.value }))
            }
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={
              !form.name.trim() ||
              form.stock.trim() === "" ||
              form.minLevel.trim() === "" ||
              form.maxLevel.trim() === ""
            }
          >
            Adicionar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
