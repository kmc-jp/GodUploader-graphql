import React from "react";
import { SwitchProps } from "react-router";
import { Route, Switch } from "react-router-dom";
import type {
  RouteConfig as OriginalRouteConfig,
  RouteConfigComponentProps as OriginalRouteConfigComponentProps,
} from "react-router-config";
import App from "./App";
import { Index } from "./pages/Index";

export const routes: RouteConfig[] = [
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

export interface RouteConfigComponentProps extends OriginalRouteConfigComponentProps {
  route?: RouteConfig;
}

export interface RouteConfig extends OriginalRouteConfig {
  component?: React.ComponentType<OriginalRouteConfigComponentProps<any>> | React.ComponentType;
  routes?: RouteConfig[];
}

export const renderRoutes = (
  routes: RouteConfig[] | undefined,
  extraProps?: any,
  switchProps?: SwitchProps
) => {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route, i) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={(props) => {
            if (!route.component) {
              return null;
            }
            return <route.component {...props} {...extraProps} route={route} />;
          }}
        />
      ))}
    </Switch>
  ) : null;
};

interface Props {
  routes: any;
}

export const RouteRenderer: React.FC<Props> = ({ routes }) => {
  return renderRoutes(routes);
};
