import { Route, Switch } from "react-router-dom";
import { RouteConfig as OriginalRouteConfig } from "react-router-config";
import type { SwitchProps } from "react-router";
import { Environment } from "relay-runtime";
import { useRelayEnvironment } from "react-relay";

export type RouteConfig = Pick<OriginalRouteConfig, "component"> &
  OriginalRouteConfig & {
    prepare?: (args: PrepareArguments) => any;
  };

export interface PrepareArguments {
  params: Record<string, unknown>;
  relayEnvironment: Environment;
}

const renderRoutes = (
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
              return;
            }
            const prepared = route.prepare
              ? route.prepare({ params: {}, relayEnvironment: environment })
              : null;
            return (
              <route.component
                prepared={prepared}
                {...props}
                {...extraProps}
                route={route}
              />
            );
          }}
        />
      ))}
    </Switch>
  ) : null;
};

export const RouteRenderer = (
  routes: RouteConfig[] | undefined,
  extraProps?: any,
  switchProps?: SwitchProps
) => {
  const environment = useRelayEnvironment();
  return renderRoutes(routes, environment, extraProps, switchProps);
};
