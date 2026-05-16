import { createContext, useContext } from "react";
import { LinkProps } from "react-router-dom";

export type NavigateFn = (
  to: LinkProps["to"],
  replace?: boolean
) => void;

export const NavigationContext = createContext<NavigateFn>(() => {});

export const useNavigate = (): NavigateFn => useContext(NavigationContext);
