"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("owner@demo.com");
  const [password, setPassword] = useState("owner123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-16 max-w-md rounded-2xl border border-amber-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-center text-2xl font-semibold text-amber-700">Entrar</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">E-mail</label>
          <input
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="email@demo.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Senha</label>
          <input
            className="w-full rounded-xl border border-zinc-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••"
          />
        </div>
        {error ? (
          <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
        ) : null}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
        <div className="text-xs text-zinc-500">
          Demos:
          <div>Owner: owner@demo.com / owner123</div>
          <div>Manager: manager@demo.com / manager123</div>
          <div>Kitchen: kitchen@demo.com / kitchen123</div>
        </div>
      </form>
    </div>
  );
}


