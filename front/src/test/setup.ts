import "@testing-library/jest-dom";

// relay-test-utils internally calls jest.fn(). Expose Vitest's `vi` as `jest` so it works.
(globalThis as unknown as Record<string, unknown>).jest = vi;
