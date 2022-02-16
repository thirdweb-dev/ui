import React from "react";
import { Provider } from "wagmi"; 
import { Web3Provider } from "@ethersproject/providers";
import invariant from "tiny-invariant";
import { ISDKOptions, ThirdwebSDK } from "@3rdweb/sdk";
import { QueryClient, QueryClientProvider } from "react-query";

interface State {
  connector?: Connector;
  data?: Data<Web3Provider>;
  error?: Error;
}

interface EnrichedState extends State {
  connectors: Connector[];
  desiredNetwork: Chain["name"];
  rpcUrlMap: Record<Chain["name"], string>;
  sdkOptions?: Partial<ISDKOptions>;
}

interface ProviderContextValue {
  state: EnrichedState;
  setState: React.Dispatch<React.SetStateAction<State>>;
  setLastUsedConnector: (newValue: string | null) => void;
  sdk?: ThirdwebSDK;
}

const ProviderContext = React.createContext(
  undefined as unknown as ProviderContextValue
);

interface ThirdwebProviderProps {
  autoConnect?: boolean;
  connectors: EnrichedState["connectors"];
  desiredNetwork?: EnrichedState["desiredNetwork"];
  localStorageKey?: string;
  rpcUrlMap: EnrichedState["rpcUrlMap"];
  sdkOptions?: EnrichedState["sdkOptions"];
}
const queryClient = new QueryClient();

export const ThirdwebProvider: React.FC<ThirdwebProviderProps> = ({
  children,
  autoConnect = true,
}) => {
  const connectors = {};

  return (
    <QueryClientProvider client={queryClient}>
      <Provider autoConnect={autoConnect} connectors={connectors}>
        {children}
      </Provider>
    </QueryClientProvider>
  );
};

export function useThirdwebContext() {
  const context = React.useContext(ProviderContext);
  invariant(
    context,
    "useThirdwebContext must be used within a ThirdwebProvider"
  );
  return context;
}
