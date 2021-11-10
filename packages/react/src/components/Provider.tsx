import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { ThirdwebContextProvider } from "../hooks/useThirdweb";
import { Connector } from "../connectors";
import React from "react";

export const ThirdwebProvider: React.FC<{
  connectors: Connector[]
}> = ({ connectors, children }) => {
  function getLibrary(provider: any): Web3Provider {
    const library = new Web3Provider(provider);
    return library;
  }
  
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ThirdwebContextProvider connectors={connectors}>
        {children}
      </ThirdwebContextProvider>
    </Web3ReactProvider>
  )
}