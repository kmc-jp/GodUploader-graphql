import {Environment, Network, RecordSource, Store} from 'relay-runtime';

const fetchRelay = async (params: any, variables: any) => {
  const response = await fetch("http://localhost:5000/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  });
  return await response.json();
};

export default new Environment({
  network: Network.create(fetchRelay),
  store: new Store(new RecordSource()),
});
