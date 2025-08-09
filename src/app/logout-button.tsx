"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const { isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  if (!isAuthenticated) return null;
  return (
    <Button
      variant="ghost"
      onClick={() => {
        logout();
        router.replace("/login");
      }}
      aria-label="Sair"
    >
      Sair
    </Button>
  );
}
