import { AppProps } from "next/app";

import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <div>
    <Header />
    <Component {...pageProps} />
    <Footer />
  </div>
);

export default MyApp;
