import {
  Environment,
  FetchFunction,
  Network,
  RecordSource,
  RequestParameters,
  Store,
  Variables,
} from "relay-runtime";

const BASENAME = import.meta.env.VITE_BASENAME || "";
const API_URL = `${BASENAME}/api/graphql`;

const buildRequestUrl = (params: RequestParameters, variables: Variables) => {
  const url = new URL(API_URL);
  url.searchParams.set("_trace_opname", params.name);
  if (params.operationKind === "query") {
    Object.entries(variables).forEach(([k, v]) => {
      url.searchParams.set(
        `_trace_variables.${k}`,
        typeof v === "object" ? JSON.stringify(v) : String(v)
      );
    });
  }
  return url;
};

const fetchRelay: FetchFunction = async (
  params,
  variables,
  cacheConfig,
  uploadables?
) => {
  const headers = new Headers({ Accept: "application/json" });

  let body: string | FormData;
  if (uploadables) {
    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({ query: params.text, variables })
    );

    const map: Record<string, string[]> = {};
    Object.keys(uploadables).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(uploadables, key)) {
        formData.append(key, uploadables[key]);
        map[key] = [key];
      }
    });
    formData.append("map", JSON.stringify(map));

    body = formData;
  } else {
    headers.append("Content-Type", "application/json");

    body = JSON.stringify({
      query: params.text,
      variables,
    });
  }

  const requestUrl = buildRequestUrl(params, variables);

  const response = await fetch(requestUrl, {
    method: "POST",
    headers,
    body,
  });

  // アップロードするファイルが大きすぎると、リクエストがアプリケーションに到達する前にnginxが413を返すのでここでケアしておく
  if (response.status === 413) {
    return {
      data: null,
      errors: [{ message: "アップロードするファイルのサイズが大きすぎます" }],
    };
  }

  // force refresh
  if (response.status === 302) {
    window.location.reload();
  }

  // nginxで弾かれたときなどvalidなJSONが返ってこない場合もあるのでハンドリングしておく
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (ex) {
    console.error(ex);
    return { data: null, errors: [{ message: text }] };
  }
};

export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
