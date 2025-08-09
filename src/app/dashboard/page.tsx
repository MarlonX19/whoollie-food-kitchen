"use client";

import { useEffect, useMemo, useState } from "react";
import { currencyBRL } from "@/lib/utils";
import { BarChart3, Receipt, ShoppingCart, Utensils } from "lucide-react";
import { useDb } from "@/lib/mock-db";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
      {
        label: "Vendas (hoje)",
        value: currencyBRL(sales),
        icon: <Receipt className="h-5 w-5" />,
      },
      {
        label: "Pedidos",
        value: String(numOrders),
        icon: <ShoppingCart className="h-5 w-5" />,
      },
      {
        label: "Ticket médio",
        value: currencyBRL(ticket),
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        label: "Em preparo",
        value: String(orders.filter((o) => o.status === "preparing").length),
        icon: <Utensils className="h-5 w-5" />,
      },
    ]);
  }, [orders, products]);

  type RangeOption = "24h" | "7d" | "15d" | "30d";
  const [range, setRange] = useState<RangeOption>("7d");

  type Bucket = { label: string; start: number; end: number };

  const { salesBuckets, ordersBuckets } = useMemo(() => {
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;
    const dayMs = 24 * hourMs;

    const spec: Record<
      RangeOption,
      { bucketMs: number; count: number; format: (d: Date) => string }
    > = {
      "24h": {
        bucketMs: hourMs,
        count: 24,
        format: (d) => `${String(d.getHours()).padStart(2, "0")}:00`,
      },
      "7d": {
        bucketMs: dayMs,
        count: 7,
        format: (d) =>
          `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      },
      "15d": {
        bucketMs: dayMs,
        count: 15,
        format: (d) =>
          `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      },
      "30d": {
        bucketMs: dayMs,
        count: 30,
        format: (d) =>
          `${d.getDate()}/${String(d.getMonth() + 1).padStart(2, "0")}`,
      },
    };

    const { bucketMs, count, format } = spec[range];

    // Oldest first buckets
    const buckets: Bucket[] = Array.from({ length: count }, (_, i) => {
      const end = now - (count - 1 - i) * bucketMs;
      const start = end - bucketMs;
      return { label: format(new Date(start)), start, end };
    });

    const salesTotals = new Array<number>(count).fill(0);
    const orderTotals = new Array<number>(count).fill(0);

    for (const o of orders) {
      const created = new Date(o.createdAt).getTime();
      if (created < buckets[0].start || created > buckets[count - 1].end)
        continue;
      // find bucket index
      const idx = Math.min(
        count - 1,
        Math.max(0, Math.floor((created - buckets[0].start) / bucketMs))
      );
      orderTotals[idx] += 1;
      const orderSales = o.items.reduce((sum, it) => {
        const p = products.find((pp) => pp.id === it.productId);
        return sum + (p ? p.price * it.qty : 0);
      }, 0);
      salesTotals[idx] += orderSales;
    }

    return {
      salesBuckets: buckets.map((b, i) => ({ ...b, value: salesTotals[i] })),
      ordersBuckets: buckets.map((b, i) => ({ ...b, value: orderTotals[i] })),
      maxSales: Math.max(1, ...salesTotals),
      maxOrders: Math.max(1, ...orderTotals),
    };
  }, [orders, products, range]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="text-zinc-700">{k.label}</div>
              <div className="text-amber-700">{k.icon}</div>
            </div>
            <div className="mt-2 text-2xl font-semibold">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-lg font-semibold text-zinc-800">Vendas</div>
          <div className="flex flex-wrap gap-2">
            {(["24h", "7d", "15d", "30d"] as RangeOption[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={
                  "rounded-xl px-3 py-1.5 text-sm " +
                  (range === r
                    ? "bg-amber-600 text-white"
                    : "bg-zinc-100 text-zinc-800 hover:bg-zinc-200")
                }
              >
                {r === "24h" ? "24h" : r}
              </button>
            ))}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={salesBuckets}
              margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
            >
              <defs>
                <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 10 }} stroke="#9ca3af" width={40} />
              <Tooltip
                formatter={(v: number | string) =>
                  currencyBRL(typeof v === "number" ? v : Number(v))
                }
                contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb" }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#d97706"
                fill="url(#salesFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-semibold text-zinc-800">
            Quantidade de pedidos
          </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ordersBuckets}
              margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
            >
              <CartesianGrid stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#9ca3af" />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke="#9ca3af"
                width={32}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb" }}
              />
              <Bar dataKey="value" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
