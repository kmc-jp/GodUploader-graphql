import Tooltip from "bootstrap/js/dist/tooltip";
import { useEffect, useRef } from "react";

export const useTooltip = <TElement extends string | Element>() => {
  const ref = useRef<TElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const tooltip = new Tooltip(ref.current);
    return () => {
      // ページ遷移したときにツールチップが消えるようにする
      tooltip.hide();
    };
  });

  return ref;
};
