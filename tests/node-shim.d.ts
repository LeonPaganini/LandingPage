declare module "node:test" {
  type TestFn = (name: string, fn: () => void | Promise<void>) => void;
  const test: TestFn;
  export default test;
}

declare module "node:assert/strict" {
  const assert: {
    ok: (value: unknown, message?: string) => asserts value;
    equal: (actual: unknown, expected: unknown, message?: string) => void;
    deepEqual: (actual: unknown, expected: unknown, message?: string) => void;
  };
  export default assert;
}

declare module "node:fs" {
  export const existsSync: (path: string) => boolean;
}

declare module "node:path" {
  export const resolve: (...paths: string[]) => string;
}

declare const process: {
  cwd: () => string;
};
