import { loadQuery } from "react-relay";
import App from "./App";
import { Index, indexQuery } from "./pages/Index";
import { PrepareArguments, RouteConfig } from "./routes";

export const routes: RouteConfig[] = [
  {
    component: App,
    routes: [
      {
        path: "/",
        exact: true,
        component: Index,
        prepare: ({ relayEnvironment }: PrepareArguments) => ({
          homeQuery: loadQuery(
            relayEnvironment,
            indexQuery,
            {},
            { fetchPolicy: "store-or-network" }
          ),
        }),
      },
    ],
  },
];
