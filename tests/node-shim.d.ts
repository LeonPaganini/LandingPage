declare module "node:test" {
  type TestFn = (name: string, fn: () => void | Promise<void>) => void;
  const test: TestFn;
  export default test;
}

declare module "node:assert/strict" {
  const assert: {
    ok: (value: unknown, message?: string) => asserts value;
  };
  export default assert;
}
