import { Window } from "happy-dom";
import React from "react";
import { mock, afterEach } from "bun:test"; // This import will fail if 'bun:test' is not available

// Initialize DOM environment for React Testing Library using happy-dom
const happyWindow = new Window();
const happyDocument = happyWindow.document;

// Attach minimal globals
// @ts-expect-error assign
globalThis.window = happyWindow as unknown as Window & typeof globalThis;
// @ts-expect-error assign
globalThis.document = happyDocument as unknown as Document;
// @ts-expect-error assign
globalThis.HTMLElement =
  happyWindow.HTMLElement as unknown as typeof HTMLElement;
// @ts-expect-error assign
globalThis.Node = happyWindow.Node as unknown as typeof Node;
// @ts-expect-error assign
globalThis.navigator = { userAgent: "happy-dom" } as unknown as Navigator;
// @ts-expect-error assign
globalThis.requestAnimationFrame = (cb: FrameRequestCallback) =>
  setTimeout(() => cb(Date.now()), 16);
// @ts-expect-error assign
globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);

// Load testing-library after globals are ready and register cleanup
const { cleanup } = await import("@testing-library/react");
await import("@testing-library/jest-dom");
afterEach(() => cleanup());

declare global {
  // Controls the pathname returned by next/navigation's usePathname()
  // during tests. Individual tests can set this value.
  // eslint-disable-next-line no-var
  var __TEST_PATHNAME: string;
  // Simplified auth state controllable by tests
  // eslint-disable-next-line no-var
  var __TEST_AUTH: {
    user: any;
    isAuthenticated: boolean;
    setUnit: (unitId: string) => void;
  };
}

globalThis.__TEST_PATHNAME = "/";
globalThis.__TEST_AUTH = {
  user: null,
  isAuthenticated: false,
  setUnit: () => {},
};

// Mock next/link to a simple anchor element
mock.module("next/link", () => {
  return {
    default: ({ href, children, ...props }: any) =>
      React.createElement("a", { href, ...props }, children),
  };
});

// Mock next/navigation hooks used by components
mock.module("next/navigation", () => {
  return {
    usePathname: () => globalThis.__TEST_PATHNAME,
  };
});

// Mock auth store used by layout components
mock.module("@/lib/auth", () => {
  return {
    useAuthStore: () => ({
      user: globalThis.__TEST_AUTH.user,
      isAuthenticated: globalThis.__TEST_AUTH.isAuthenticated,
      setUnit: globalThis.__TEST_AUTH.setUnit,
      login: async () => {},
      logout: () => {},
    }),
  };
});
