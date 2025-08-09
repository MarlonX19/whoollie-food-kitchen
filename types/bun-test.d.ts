// Minimal ambient types to satisfy TypeScript when using Bun's test runner
// If bun-types are installed, this will be harmless; otherwise it fixes editor errors.
declare module "bun:test" {
  export const describe: (name: string, fn: () => void) => void;
  export const test: (name: string, fn: () => void | Promise<void>) => void;
  export const expect: (actual: any) => any;
  export const beforeEach: (fn: () => void | Promise<void>) => void;
  export const afterEach: (fn: () => void | Promise<void>) => void;
  export const mock: {
    module: (specifier: string, factory: () => any) => void;
  };
}
