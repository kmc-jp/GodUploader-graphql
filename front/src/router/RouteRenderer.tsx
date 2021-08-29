/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useRelayEnvironment } from "react-relay";
import { SwitchProps } from "react-router";

import { RouteConfig, renderRoutes } from "./renderRoutes";

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
