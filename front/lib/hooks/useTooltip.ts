import { useEffect, useRef } from "react";

export const useTooltip = <TElement extends string | Element>() => {
  const ref = useRef<TElement>(null);

  useEffect(() => {
    let cleanup = () => {};
    import("bootstrap").then(({ Tooltip }) => {
      if (!ref.current) {
        return;
      }
      const tooltip = new Tooltip(ref.current);
      cleanup = () => {
        // ページ遷移したときにツールチップが消えるようにする
        tooltip.hide();
      };
    });
    return cleanup;
  });

  return ref;
};
