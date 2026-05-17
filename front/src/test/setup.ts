import "@testing-library/jest-dom";

// relay-test-utils は内部で jest.fn() を呼び出すため、Vitest の vi を jest として公開する。
(globalThis as unknown as Record<string, unknown>).jest = vi;
