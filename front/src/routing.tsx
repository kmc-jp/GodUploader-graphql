import React from "react";
import { Environment, loadQuery, useRelayEnvironment } from "react-relay";
import { SwitchProps } from "react-router";
import { Route, Switch } from "react-router-dom";
import {
  RouteConfig as OriginalRouteConfig,
  RouteConfigComponentProps as OriginalRouteConfigComponentProps,
} from "react-router-config";
import App from "./App";
import { Index, indexQuery } from "./pages/Index";

export const routes: RouteConfig[] = [
  {
    component: App,
    routes: [
      {
        path: "/",
        exact: true,
        component: Index,
        prepare: ({ environment }) => ({
          indexQuery: loadQuery(
            environment,
            indexQuery,
            {},
            { fetchPolicy: "store-or-network" }
          ),
        }),
      },
    ],
  },
];

export interface RouteConfigComponentProps<Params extends { [K in keyof Params]?: string } = {}>
  extends OriginalRouteConfigComponentProps<Params> {
  route?: RouteConfig;
  prepared?: any;
}

interface PrepareArguments {
  params: Record<string, any>;
  environment: Environment;
}

export interface RouteConfig extends OriginalRouteConfig {
  component?:
    | React.ComponentType<RouteConfigComponentProps<any>>
    | React.ComponentType;
  routes?: RouteConfig[];
  prepare?: ({ params, environment }: PrepareArguments) => any;
}

export const renderRoutes = (
  routes: RouteConfig[] | undefined,
  environment: Environment,
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

            const params = props.match.params;
            const prepared = route.prepare
              ? route.prepare({ params, environment })
              : null;
            return (
              <route.component
                {...props}
                {...extraProps}
                prepared={prepared}
                route={route}
              />
            );
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
  const environment = useRelayEnvironment();
  return renderRoutes(routes, environment);
};
