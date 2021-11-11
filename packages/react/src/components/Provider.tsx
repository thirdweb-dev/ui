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
  injected: AbstractConnectorArguments; // MetaMask
  magic: MagicConnectorArguments; // Magic Link
  walletconnect: WalletConnectConnectorArguments; // Mobile Wallets
  walletlink: WalletLinkConnectorArguments; // Coinbase Wallet
};

export type ConnectorType = keyof ConnectorOptions;

export interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: 18;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored
}

export interface ThirdwebContext {
  _inProvider: boolean;
  readonly connectors: Partial<ConnectorOptions>;
  readonly chainAddConfig?: Record<number, AddEthereumChainParameter>;
}

function getLibrary(provider: any): Web3Provider {
  return new Web3Provider(provider);
}

const ThirdwebContext = createContext<ThirdwebContext>({
  _inProvider: false,
  connectors: {},
});

export function useThirdwebContext(): ThirdwebContext {
  const context = useContext(ThirdwebContext);
  invariant(context._inProvider, `
    Attempting to call useThirdwebContext from outside <ThirdwebProvider>, 
    did you forget to wrap your application in a <ThirdwebProvider>? 
  `);
  return context;
}

export const ThirdwebProvider: React.FC<{
  connectors: ThirdwebContext["connectors"];
  chainAddConfig?: ThirdwebContext["chainAddConfig"];
}> = ({
  connectors,
  chainAddConfig,
  children,
}) => {
  return (
    <ThirdwebContext.Provider 
      value={{ 
        _inProvider: true, 
        connectors, 
        chainAddConfig 
      }}
    >
      <Web3ReactProvider getLibrary={getLibrary}>
        {children}
      </Web3ReactProvider>
    </ThirdwebContext.Provider>
  );
};
