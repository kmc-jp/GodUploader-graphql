/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Environment, useRelayEnvironment } from "react-relay";
import { SwitchProps } from "react-router";
import { Route, Switch } from "react-router-dom";
import {
  RouteConfig as OriginalRouteConfig,
  RouteConfigComponentProps as OriginalRouteConfigComponentProps,
} from "react-router-config";

export interface RouteConfigComponentProps<
  Params extends { [K in keyof Params]?: string } = any
> extends Omit<OriginalRouteConfigComponentProps<Params>, "route"> {
  route?: RouteConfig;
  prepared: any;
}

interface PrepareArguments {
  params: Record<string, any>;
  environment: Environment;
}

export interface RouteConfig extends Omit<OriginalRouteConfig, "component"> {
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
): React.ReactElement | null => {
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
  routes: RouteConfig[] | undefined;
  extraProps?: any;
  switchProps?: SwitchProps;
}

export const RouteRenderer: React.FC<Props> = ({
  routes,
  extraProps,
  switchProps,
}) => {
  const environment = useRelayEnvironment();
  return renderRoutes(routes, environment, extraProps, switchProps);
};
