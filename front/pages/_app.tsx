import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppProps } from "next/app";
import { RelayEnvironmentProvider } from "react-relay";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { useEnvironment } from "../lib/RelayEnvironment";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { initialRecords, ...rest } = pageProps;
  const environment = useEnvironment(initialRecords);

  return (
    <RelayEnvironmentProvider environment={environment}>
      <div className="container">
        <Header />
        <Component {...rest} />
        <Footer />
      </div>
    </RelayEnvironmentProvider>
  );
};

export default MyApp;
