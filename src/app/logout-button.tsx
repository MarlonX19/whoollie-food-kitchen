"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";

export function LogoutButton() {
  const { isAuthenticated, logout } = useAuthStore();
  if (!isAuthenticated) return null;
  return (
    <Button variant="ghost" onClick={logout} aria-label="Sair">
      Sair
    </Button>
  );
}


