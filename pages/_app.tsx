import * as React from "react";
import { AppProps } from "next/app";
import "../styles/global.css";

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default App;
