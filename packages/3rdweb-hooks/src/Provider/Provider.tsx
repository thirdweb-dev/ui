import React, { useEffect, useMemo, useRef } from "react";
import { Chain, Connector, Data } from "@3rdweb/connectors";
import { useLocalStorage, useEffectOnce, isBrowser } from "@3rdweb/utils";
import { Web3Provider } from "@ethersproject/providers";
import invariant from "tiny-invariant";
import { ISDKOptions, ThirdwebSDK, ValidProviderInput } from "@3rdweb/sdk";
import { useConnectorSigner } from "../hooks";
import { Signer } from "ethers";
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

const InternalThirdwebProvider: React.FC<ThirdwebProviderProps> = ({
  children,
  localStorageKey = "thirdweb:last-used-connector",
  connectors,
  rpcUrlMap,
  desiredNetwork,
  autoConnect = true,
  sdkOptions,
}) => {
  const [lastUsedConnector, setLastUsedConnector] = useLocalStorage<
    string | null
  >(localStorageKey);

  const [state, setState] = React.useState<State>({});

  // attempt to connect to the last used connector
  useEffectOnce(() => {
    if (!autoConnect) return;
    (async () => {
      const sorted = lastUsedConnector
        ? [...connectors].sort((x) => (x.name === lastUsedConnector ? -1 : 1))
        : connectors;
      for (const connector of sorted) {
        if (!connector.ready || !connector.isAuthorized) continue;
        const isAuthorized = await connector.isAuthorized();
        if (!isAuthorized) continue;

        const data = await connector.connect();
        setState((x) => ({ ...x, connector, data }));
        break;
      }
    })();
  });

  // ensure the connectors disconnect
  useEffect(() => {
    return () => {
      if (!state.connector) return;
      state.connector.disconnect();
    };
  }, [state.connector]);

  // Watch connector for events
  useEffect(() => {
    if (!state.connector) return;

    const onChange = (data: Data) =>
      setState((x) => ({
        ...x,
        data: { ...x.data, ...data },
      }));
    const onDisconnect = () => setState({});
    const onError = (error: Error) => setState((x) => ({ ...x, error }));

    state.connector.on("change", onChange);
    state.connector.on("disconnect", onDisconnect);
    state.connector.on("error", onError);

    return () => {
      if (!state.connector) return;
      state.connector.off("change", onChange);
      state.connector.off("disconnect", onDisconnect);
      state.connector.off("error", onError);
    };
  }, [state.connector]);

  const readOnlyRpcUrl = useMemo(() => {
    return rpcUrlMap[desiredNetwork];
  }, [desiredNetwork, rpcUrlMap]);

  const sdk = useMemo(() => {
    if (!readOnlyRpcUrl) {
      return undefined;
    }
    return new ThirdwebSDK(readOnlyRpcUrl, {
      readOnlyRpcUrl: readOnlyRpcUrl,
      ...sdkOptions,
    });
  }, [sdkOptions, readOnlyRpcUrl]);

  const { data: signer } = useConnectorSigner(state.connector);

  useEffect(() => {
    if (!sdk || !Signer.isSigner(signer)) {
      return;
    }
    sdk.setProviderOrSigner(signer);
  }, [sdk, signer]);

  const value: ProviderContextValue = {
    state: {
      connectors,
      connector: state.connector,
      data: state.data,
      desiredNetwork,
      rpcUrlMap,
      sdkOptions,
    },
    sdk,
    setState,
    setLastUsedConnector,
  };

  return (
    <ProviderContext.Provider value={value}>
      {children}
    </ProviderContext.Provider>
  );
};

const queryClient = new QueryClient();

export const ThirdwebProvider: React.FC<ThirdwebProviderProps> = ({
  children,
  ...props
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <InternalThirdwebProvider {...props}>{children}</InternalThirdwebProvider>
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
