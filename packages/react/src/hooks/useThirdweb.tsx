import React, { createContext, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { Connector, injected, createMagicConnector } from "../connectors";

export type ThirdwebContextData = {
  account: string | null | undefined;
  connectors: Connector[];
  activateInjected?: () => void;
  activateMagic?: (email: string) => void;
  deactivate?: () => void;
}

const ThirdwebContext = createContext<ThirdwebContextData>({
  account: undefined,
  connectors: [],
});

export function useThirdweb() {
  return useContext(ThirdwebContext);
}

export const ThirdwebContextProvider: React.FC<{
  connectors: Connector[]
}> = ({ connectors, children }) => {
  const { account, activate, deactivate } = useWeb3React();

  function activateInjected() {
    if (connectors.includes("injected")) {
      activate(injected);
    }
  }

  function activateMagic(email: string) {
    if (connectors.includes("magic")) {
      const magicConnector = createMagicConnector(email);
      console.log(magicConnector);
      activate(magicConnector);
    }
  }

  return (
    <ThirdwebContext.Provider
      value={{
        account,
        connectors,
        activateInjected,
        activateMagic,
        deactivate
      }}
    >
      {children}
    </ThirdwebContext.Provider>
  )
}