import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  Store,
} from "relay-runtime";

const BASE_URL = process.env.REACT_APP_BASE_URL || "";
const API_URL = `${BASE_URL}/api/graphql`;

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
    formData.append("query", params.text!);
    formData.append("variables", JSON.stringify(variables));

    Object.keys(uploadables).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
        formData.append(key, uploadables[key]);
      }
    });

    body = formData;
  } else {
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
