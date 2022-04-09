import { useEffect, useState } from "react";

export const useClientSideRendering = () => {
  const [isClientSideRendering, setIsClientSideRendering] = useState(false);

  useEffect(() => {
    setIsClientSideRendering(true);
  }, []);

  return isClientSideRendering;
};
