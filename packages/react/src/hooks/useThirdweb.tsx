import React, { createContext, useContext } from "react";
import { Web3ReactProvider, useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { injected } from "../connectors";

const ThirdwebContext = createContext({});

export function useThirdweb() {
  return useContext(ThirdwebContext);
}

export const ThirdwebProvider: React.FC<{
  connectors: string[]
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

export const ThirdwebContextProvider: React.FC<{
  connectors: string[]
}> = ({ connectors, children }) => {
  const { activate } = useWeb3React();

  function activateInjected() {
    if (connectors.includes("injected")) {
      activate(injected);
    }
  }

  return (
    <ThirdwebContext.Provider
      value={{
        connectors,
        activateInjected
      }}
    >
      {children}
    </ThirdwebContext.Provider>
  )
}