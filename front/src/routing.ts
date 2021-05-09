import App from "./App";
import { Index } from "./pages/Index";

export const routes = [
  {
    component: App,
    routes: [
      {
        path: "/",
        exact: true,
        component: Index,
      },
    ],
  },
];
