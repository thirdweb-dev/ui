import React, { createContext, useContext } from "react";
import { useWeb3React } from "@web3-react/core";
import { 
  Connector, 
  injectedConnector, 
  createMagicConnector,
  walletConnectConnector,
  walletLinkConnector
} from "../connectors";

export type ThirdwebContextData = {
  account: string | null | undefined;
  connectors: Connector[];
  activate?: (conenctor: Connector, options?: any) => void;
  deactivate?: () => void;
}

type ActivateOptions = {
  email?: string;
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
  const { 
    account, 
    activate: activateConnector, 
    deactivate 
  } = useWeb3React();

  function activate(connector: Connector, options?: ActivateOptions) {
    if (connectors.includes(connector)) {
      switch (connector) {
        case "injected":
          activateConnector(injectedConnector);
          break;
        case "magic":
          if (!options?.email) {
            return;
          }

          const { email } = options;
          const magicConnector = createMagicConnector(email);
          activateConnector(magicConnector);
          break;
        case "walletconnect":
          activateConnector(walletConnectConnector);
          break;
        case "walletlink":
          activateConnector(walletLinkConnector)
          break;
      }
    }
  }

  return (
    <ThirdwebContext.Provider
      value={{
        account,
        connectors,
        activate,
        deactivate
      }}
    >
      {children}
    </ThirdwebContext.Provider>
  )
}