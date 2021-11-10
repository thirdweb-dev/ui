import { ThirdWebProvider } from "@3rdweb/react";
import React from "react";

function ExampleApp({ Component, pageProps }) {
  return (
    <ThirdWebProvider>
      <Component {...pageProps} />
    </ThirdWebProvider>
  );
}

export default ExampleApp;
