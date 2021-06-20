import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
} from "relay-runtime";

const BASENAME = process.env.REACT_APP_BASENAME || "";
const API_URL = `${BASENAME}/api/graphql`;

const fetchRelay: FetchFunction = async (
  params,
  variables,
  cacheConfig,
  uploadables?
) => {
  const requestVariables = {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  };

  let body: string | FormData;
  if (uploadables) {
    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({ query: params.text!, variables })
    );

    const map: Record<string, string[]> = {};
    Object.keys(uploadables).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
        formData.append(key, uploadables[key]);
        map[key] = [`variables.input.files.${key}`];
      }
    });
    formData.append("map", JSON.stringify(map));

    body = formData;
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (requestVariables.headers as any)["Content-Type"] = "application/json";

    body = JSON.stringify({
      query: params.text,
      variables,
    });
  }

  const response = await fetch(API_URL, {
    ...requestVariables,
    body,
  });
  return await response.json();
};

export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
