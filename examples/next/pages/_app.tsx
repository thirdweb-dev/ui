import { ThirdwebWeb3Provider, ThirdwebThemeProvider } from "@3rdweb/react";
import React from "react";

function ExampleApp({ Component, pageProps }) {
  const connectors = {
    injected: {
      supportedChainIds: [1]
    },
    magic: {
      apiKey: "pk_live_712C1E6230EA31BC",
      chainId: 1,
    },
    walletconnect: {
      supportedChainIds: [1],
    },
    walletlink: {
      appName: "thirdweb - demo",
      url: "https://thirdweb.com",
      darkMode: false,
      supportedChainIds: [1],
    }
  }

  return (
    <ThirdwebWeb3Provider connectors={connectors}>
      <ThirdwebThemeProvider> 
        <Component {...pageProps} />
      </ThirdwebThemeProvider>
    </ThirdwebWeb3Provider>
  );
}

export default ExampleApp;
