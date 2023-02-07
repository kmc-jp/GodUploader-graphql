import { renderHook, act } from "@testing-library/react-hooks/dom";

import { useUndoableStack } from "./useUndoableStack";

test("useUndoableStack", () => {
  const { result } = renderHook(() => useUndoableStack(0));

  act(() => {
    result.current.append(1);
    result.current.append(2);
  });

  act(() => {
    const value = result.current.undo();
    expect(value).toBe(1);
  });

  act(() => {
    const value = result.current.undo();
    expect(value).toBe(0);
  });

  act(() => {
    const value = result.current.redo();
    expect(value).toBe(1);
  });

  act(() => {
    const value = result.current.undo();
    expect(value).toBe(0);
  });

  act(() => {
    result.current.append(5);
  });

  act(() => {
    const value = result.current.redo();
    expect(value).toBe(null);
  });
});
