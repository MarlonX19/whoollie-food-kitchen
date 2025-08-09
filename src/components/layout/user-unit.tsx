"use client";

import { useAuthStore } from "@/lib/auth";

export function UserUnit() {
  const { user, setUnit } = useAuthStore();
  if (!user) return null;
  return (
    <div className="flex items-center gap-2 text-sm text-zinc-700">
      <span className="hidden sm:inline">Unidade:</span>
      <select
        className="rounded-xl border border-zinc-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
        value={user.unitId}
        onChange={(e) => setUnit(e.target.value)}
      >
        <option value="unit_centro">Centro</option>
        <option value="unit_jardins">Jardins</option>
      </select>
    </div>
  );
}


