import "@testing-library/jest-dom";

// relay-test-utils internally calls jest.fn(). Expose Vitest's `vi` as `jest` so it works.
globalThis.jest = vi;

// URL.createObjectURL / revokeObjectURL are not implemented in happy-dom.
// UploadArtworkForm uses createObjectURL to generate preview URLs for attached files,
// and @dnd-kit uses those URLs as stable sortable item IDs.
// Return a unique string per file to satisfy both requirements.
let objectUrlCounter = 0;
globalThis.URL.createObjectURL = vi.fn((blob: Blob) => {
  const name = (blob as File).name ?? "unknown";
  return `blob:mock://${name}-${++objectUrlCounter}`;
});
globalThis.URL.revokeObjectURL = vi.fn();

afterEach(() => {
  objectUrlCounter = 0;
  vi.mocked(URL.createObjectURL).mockClear();
  vi.mocked(URL.revokeObjectURL).mockClear();
});
