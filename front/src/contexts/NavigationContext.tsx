import { createContext, useContext } from "react";
import type { To } from 'react-router';

export type NavigateFn = (to: To, replace?: boolean) => void;

export const NavigationContext = createContext<NavigateFn>(() => {});

export const useNavigate = (): NavigateFn => useContext(NavigationContext);
