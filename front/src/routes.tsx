import { Route, Switch } from "react-router-dom";
import {
  RouteConfig as OriginalRouteConfig,
  RouteConfigComponentProps as OriginalRouteConfigComponentProps,
} from "react-router-config";
import type { SwitchProps } from "react-router";
import { Environment } from "relay-runtime";
import { useRelayEnvironment } from "react-relay";

export type RouteConfig = OriginalRouteConfig & {
  route?: RouteConfig;
  component?: React.ComponentType<RouteConfigComponentProps<any>> | React.ComponentType;
}

export interface RouteConfigComponentProps<
  Params extends { [K in keyof Params]?: string } = {}
> extends OriginalRouteConfigComponentProps<Params> {
  route?: RouteConfig;
}

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

interface RendererProps {
  routes: RouteConfig[] | undefined;
  extraProps?: any;
  switchProps?: SwitchProps;
}

export const RouteRenderer = ({
  routes,
  extraProps,
  switchProps,
}: RendererProps) => {
  const environment = useRelayEnvironment();
  return renderRoutes(routes, environment, extraProps, switchProps);
};
