import React from "react";
import { renderRoutes } from "react-router-config";
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

interface Props {
  routes: any;
}

export const RouteRenderer: React.FC<Props> = ({ routes }) => {
  return renderRoutes(routes);
};
