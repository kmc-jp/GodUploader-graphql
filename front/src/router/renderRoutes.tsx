import React, { useState } from "react";
import { Environment, useRelayEnvironment } from "react-relay";
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
          render={(props) => (
            <WrappedRouteComponent {...props} route={route} {...extraProps} />
          )}
        />
      ))}
    </Switch>
  ) : null;
};

const WrappedRouteComponent: React.VFC<RouteConfigComponentProps<any>> = (
  props
) => {
  const { route, match } = props;
  const { params } = match;
  const environment = useRelayEnvironment();

  const [prepared] = useState(() => {
    if (!route?.prepare) {
      return null;
    }
    return route.prepare({ params, environment });
  });

  if (!(route && route.component)) {
    return null;
  }

  return <route.component {...props} prepared={prepared} />;
};
