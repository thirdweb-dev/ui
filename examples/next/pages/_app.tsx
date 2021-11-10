import { ThirdwebProvider } from "@3rdweb/react";
import React from "react";

function ExampleApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider 
      connectors={["injected"]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default ExampleApp;
