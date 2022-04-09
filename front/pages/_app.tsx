import { AppProps } from "next/app";
import { ReactRelayContext } from "react-relay";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import RelayEnvironment from "../lib/RelayEnvironment";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ReactRelayContext.Provider
    value={{ environment: RelayEnvironment, variables: {} }}
  >
    <div>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  </ReactRelayContext.Provider>
);

export default MyApp;
