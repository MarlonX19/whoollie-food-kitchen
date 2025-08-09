import { describe, expect, test } from "bun:test";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  test("renderiza com variant primário por padrão", () => {
    render(<Button>Enviar</Button>);
    const btn = screen.getByRole("button", { name: /enviar/i });
    expect(btn.className).toContain("bg-amber-600");
    expect(btn.className).toContain("text-white");
  });

  test("aplica classes do variant secundário", () => {
    render(<Button variant="secondary">Salvar</Button>);
    const btn = screen.getByRole("button", { name: /salvar/i });
    expect(btn.className).toContain("bg-zinc-200");
    expect(btn.className).toContain("text-zinc-900");
  });

  test("permite className extra", () => {
    render(
      <Button className="data-testid-custom" variant="ghost">
        Ação
      </Button>
    );
    const btn = screen.getByRole("button", { name: /ação/i });
    expect(btn.className).toContain("data-testid-custom");
    expect(btn.className).toContain("bg-transparent");
  });
});
