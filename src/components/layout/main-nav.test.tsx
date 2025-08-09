import { describe, expect, test, beforeEach } from "bun:test";
import React from "react";
import { render, screen } from "@testing-library/react";
import { MainNav } from "./main-nav";

declare global {
  // from tests/setup.ts
  var __TEST_PATHNAME: string;
  var __TEST_AUTH: { user: any; isAuthenticated: boolean };
}

describe("MainNav", () => {
  beforeEach(() => {
    globalThis.__TEST_PATHNAME = "/";
    globalThis.__TEST_AUTH = {
      user: null,
      isAuthenticated: false,
    } as any;
  });

  test("exibe todos os links para manager e destaca rota ativa", () => {
    globalThis.__TEST_AUTH.user = {
      role: "manager",
    };
    globalThis.__TEST_PATHNAME = "/orders";

    render(<MainNav />);

    expect(
      screen.getByRole("link", { name: /dashboard/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /catálogo/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /pedidos/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cozinha/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /estoque/i })).toBeInTheDocument();

    const active = screen.getByRole("link", { name: /pedidos/i });
    expect(active.className).toContain("bg-amber-200");
    expect(active.className).toContain("text-amber-900");
  });

  test("para kitchen, apenas link de Cozinha é exibido", () => {
    globalThis.__TEST_AUTH.user = {
      role: "kitchen",
    };
    render(<MainNav />);

    expect(screen.queryByRole("link", { name: /dashboard/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /catálogo/i })).toBeNull();
    expect(screen.queryByRole("link", { name: /pedidos/i })).toBeNull();
    expect(screen.getByRole("link", { name: /cozinha/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /estoque/i })).toBeNull();
  });
});
