import React from "react";
import { Environment } from "react-relay";
import { SwitchProps } from "react-router";
import {
  RouteConfig as OriginalRouteConfig,
  RouteConfigComponentProps as OriginalRouteConfigComponentProps,
} from "react-router-config";
import { Route, Switch } from "react-router-dom";

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface RouteConfigComponentProps<
  Params extends {
    [K in keyof Params]?: string;
  } = any
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
