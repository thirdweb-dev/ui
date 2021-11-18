import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { AbstractConnectorArguments } from "@web3-react/types";
import { WalletConnectConnectorArguments } from "@web3-react/walletconnect-connector";
import React, { createContext, useContext } from "react";
import invariant from "tiny-invariant";

interface MagicConnectorArguments {
  apiKey: string;
  chainId: number;
}

interface WalletLinkConnectorArguments {
  url: string;
  appName: string;
  appLogoUrl?: string;
  darkMode?: boolean;
  supportedChainIds?: number[];
}

export type ConnectorOptions = {
  // MetaMask
  injected: AbstractConnectorArguments;
  // Magic Link
  magic: MagicConnectorArguments;
  // Mobile Wallets
  walletconnect: WalletConnectConnectorArguments;
  // Coinbase Wallet
  walletlink: WalletLinkConnectorArguments;
};

export type ConnectorType = keyof ConnectorOptions;

export interface AddEthereumChainParameter {
  // A 0x-prefixed hexadecimal string
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    // 2-6 characters long
    symbol: string;
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  // Currently ignored
  iconUrls?: string[];
}

export interface NetworkMetadata {
  chainName: string;
  iconUrl: string;
  symbol: string;
}

export interface ThirdwebContext {
  _inProvider: boolean;
  readonly connectors: Partial<ConnectorOptions>;
  readonly supportedChainIds: number[];
  readonly networkMetadata?: Record<number, NetworkMetadata>;
  readonly chainAddConfig?: Record<number, AddEthereumChainParameter>;
}

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider);
}

const ThirdwebContext = createContext<ThirdwebContext>({
  _inProvider: false,
  connectors: {},
  supportedChainIds: [],
});

export function useThirdwebContext(): ThirdwebContext {
  const context = useContext(ThirdwebContext);
  invariant(
    context._inProvider,
    `
    Attempting to call useThirdwebContext from outside <ThirdwebProvider>, 
    did you forget to wrap your application in a <ThirdwebProvider>? 
  `,
  );
  return context;
}

export const ThirdwebWeb3Provider: React.FC<{
  connectors: ThirdwebContext["connectors"];
  supportedChainIds: ThirdwebContext["supportedChainIds"];
  networkMetadata?: ThirdwebContext["networkMetadata"];
  chainAddConfig?: ThirdwebContext["chainAddConfig"];
}> = ({
  connectors,
  supportedChainIds,
  networkMetadata,
  chainAddConfig,
  children,
}) => {
  return (
    <ThirdwebContext.Provider
      value={{
        _inProvider: true,
        connectors,
        supportedChainIds,
        networkMetadata,
        chainAddConfig,
      }}
    >
      <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
    </ThirdwebContext.Provider>
  );
};
