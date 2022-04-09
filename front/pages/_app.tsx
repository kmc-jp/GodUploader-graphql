import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RelayEnvironmentProvider } from "react-relay";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { useEnvironment } from "../lib/RelayEnvironment";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { initialRecords, ...rest } = pageProps;
  const environment = useEnvironment(initialRecords);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, []);

  return (
    <RelayEnvironmentProvider environment={environment}>
      {isLoading && <LoadingOverlay />}
      <div className="container">
        <Header />
        <Component {...rest} />
        <Footer />
      </div>
    </RelayEnvironmentProvider>
  );
};

export default MyApp;
