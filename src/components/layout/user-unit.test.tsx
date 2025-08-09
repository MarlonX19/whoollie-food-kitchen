import { describe, expect, test, beforeEach, mock } from "bun:test";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { UserUnit } from "./user-unit";

declare global {
  // from tests/setup.ts
  var __TEST_AUTH: {
    user: any;
    isAuthenticated: boolean;
    setUnit: (unitId: string) => void;
  };
}

describe("UserUnit", () => {
  beforeEach(() => {
    globalThis.__TEST_AUTH.user = {
      id: "u_1",
      name: "Owner Demo",
      email: "owner@demo.com",
      role: "owner",
      orgId: "org_foodies",
      unitId: "unit_centro",
    };
    globalThis.__TEST_AUTH.isAuthenticated = true;
    globalThis.__TEST_AUTH.setUnit = mock(() => {});
  });

  test("renderiza select com unidade atual", () => {
    render(<UserUnit />);
    const select = screen.getByRole("combobox");
    expect((select as HTMLSelectElement).value).toBe("unit_centro");
  });

  test("dispara setUnit ao trocar de unidade", () => {
    const { container } = render(<UserUnit />);
    const select = container.querySelector("select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "unit_jardins" } });
    expect(globalThis.__TEST_AUTH.setUnit).toHaveBeenCalledWith("unit_jardins");
  });

  test("retorna null se não houver usuário", () => {
    globalThis.__TEST_AUTH.user = null;
    const { container } = render(<UserUnit />);
    expect(container.querySelector("select")).toBeNull();
  });
});
