import React from "react";
import { Connector, Provider as WagmiProvider } from "wagmi"; 
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { WalletLinkConnector } from "wagmi/connectors/walletLink";
import { ISDKOptions } from "@3rdweb/sdk";
import { QueryClient, QueryClientProvider } from "react-query";
import { ChainId, ChainIdToRPC, supportedChains } from "../constants/chain";
import { SdkProvider } from "./SdkProvider";

interface ThirdwebProviderProps {
  autoConnect?: boolean;
  connectors?:  Connector[];
  rpcUrlMap?: Partial<Record<ChainId, string>>;
  sdkOptions?: Partial<ISDKOptions>;
  desiredNetwork?: ChainId;
  localStorageKey?: string;
}

const queryClient = new QueryClient();

// TODO: Add support for custom RPCs
const connectors = ({ chainId }: { chainId?: number }) => {
  const supportedChainId = (chainId || 1) as ChainId;
  
  return [
    new InjectedConnector({
      options: { shimDisconnect: true },
      chains: supportedChains,
    }),
    new WalletConnectConnector({
      options: {
        chainId,
        rpc: ChainIdToRPC as Record<number, string>,
        qrcode: true,
      },
    }),
    new WalletLinkConnector({
      options: {
        appName: "thirdweb",
        appLogoUrl: "https://thirdweb.com/favicon.ico",
        darkMode: false,
        jsonRpcUrl: ChainIdToRPC[supportedChainId] || "",
      },
    }),
  ];
};

export const ThirdwebProvider: React.FC<ThirdwebProviderProps> = ({
  children,
  sdkOptions,
  autoConnect = true,
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider autoConnect={autoConnect} connectors={connectors}>
        <SdkProvider sdkOptions={sdkOptions}>
          {children}
        </SdkProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
};