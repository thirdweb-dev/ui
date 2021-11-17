import { ThirdwebThemeProvider, ThirdwebWeb3Provider } from "@3rdweb/react";
import React from "react";

function ExampleApp({ Component, pageProps }) {
  const supportedChainIds = [1, 4, 137, 250, 43114, 80001];
  const connectors = {
    injected: {},
    magic: {
      apiKey: "pk_live_712C1E6230EA31BC",
      chainId: 1,
    },
    walletconnect: {},
    walletlink: {
      appName: "thirdweb - demo",
      url: "https://thirdweb.com",
      darkMode: false
    },
  };

  return (
    <ThirdwebWeb3Provider connectors={connectors} supportedChainIds={supportedChainIds}>
      <ThirdwebThemeProvider>
        <Component {...pageProps} />
      </ThirdwebThemeProvider>
    </ThirdwebWeb3Provider>
  );
}

export default ExampleApp;
