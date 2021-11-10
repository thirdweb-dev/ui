import React, { createContext, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "../connectors";

const ThirdwebContext = createContext({});

export function useThirdweb() {
  return useContext(ThirdwebContext);
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