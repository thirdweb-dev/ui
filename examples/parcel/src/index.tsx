import { ThirdwebThemeProvider, ThirdwebWeb3Provider } from "@3rdweb/react";
import React from "react";
import ReactDOM from "react-dom";
import { ExampleApp } from "./App";

const connectors = {
  injected: {
    supportedChainIds: [1],
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
  },
};

const app = document.getElementById("app");
ReactDOM.render(
  <ThirdwebWeb3Provider connectors={connectors}>
    <ThirdwebThemeProvider>
      <ExampleApp />
    </ThirdwebThemeProvider>
  </ThirdwebWeb3Provider>,
  app,
);
