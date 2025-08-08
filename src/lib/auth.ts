"use client";

import { create } from "zustand";

export type UserRole =
  | "owner"
  | "manager"
  | "attendant"
  | "kitchen"
  | "inventory"
  | "finance"
  | "admin";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  orgId: string;
  unitId: string;
};

type AuthState = {
  user: SessionUser | null;
  isAuthenticated: boolean;
  login: (payload: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  setUnit: (unitId: string) => void;
};

const LOCAL_STORAGE_KEY = "wfk_auth_state_v1";

function persist(state: Pick<AuthState, "user" | "isAuthenticated">) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // no-op
  }
}

function rehydrate(): Pick<AuthState, "user" | "isAuthenticated"> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return { user: null, isAuthenticated: false };
    const parsed = JSON.parse(raw) as {
      user: SessionUser | null;
      isAuthenticated: boolean;
    };
    return parsed;
  } catch {
    return { user: null, isAuthenticated: false };
  }
}

export const useAuthStore = create<AuthState>((set, get) => ({
  ...rehydrate(),
  async login({ email, password }) {
    // Mocked users — simple, insecure, for demo only
    const users: Array<SessionUser & { password: string }> = [
      {
        id: "u_1",
        name: "Owner Demo",
        email: "owner@demo.com",
        password: "owner123",
        role: "owner",
        orgId: "org_foodies",
        unitId: "unit_centro",
      },
      {
        id: "u_2",
        name: "Manager Demo",
        email: "manager@demo.com",
        password: "manager123",
        role: "manager",
        orgId: "org_foodies",
        unitId: "unit_centro",
      },
      {
        id: "u_3",
        name: "Kitchen Demo",
        email: "kitchen@demo.com",
        password: "kitchen123",
        role: "kitchen",
        orgId: "org_foodies",
        unitId: "unit_centro",
      },
    ];

    await new Promise((r) => setTimeout(r, 500));
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) {
      throw new Error("Credenciais inválidas");
    }

    const { password: _omit, ...sessionUser } = found;
    set({ user: sessionUser, isAuthenticated: true });
    persist({ user: sessionUser, isAuthenticated: true });
    document.cookie = `wfk_session=1; path=/; SameSite=Lax`;
  },
  logout() {
    set({ user: null, isAuthenticated: false });
    persist({ user: null, isAuthenticated: false });
    document.cookie = `wfk_session=; path=/; Max-Age=0; SameSite=Lax`;
  },
  setUnit(unitId: string) {
    const current = get().user;
    if (!current) return;
    const nextUser: SessionUser = { ...current, unitId };
    set({ user: nextUser });
    persist({ user: nextUser, isAuthenticated: true });
  },
}));


