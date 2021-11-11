import { Web3Provider } from "@ethersproject/providers";
import { Web3ReactProvider } from "@web3-react/core";
import { AbstractConnectorArguments } from "@web3-react/types";
import { WalletConnectConnectorArguments } from "@web3-react/walletconnect-connector";
import React, { createContext, useContext } from "react";
import invariant from "tiny-invariant";

//connector types
//from magic-conector
interface MagicConnectorArguments {
  apiKey: string;
  chainId: number;
  //email has to be passed in from input
  // email: string;
}
// from walletlink-connector
interface WalletLinkConnectorArguments {
  url: string;
  appName: string;
  appLogoUrl?: string;
  darkMode?: boolean;
  supportedChainIds?: number[];
}

export type ConnectorOptions = {
  /**
   * basically metamask
   */
  injected: AbstractConnectorArguments;
  /**
   * magic.link
   */
  magic: MagicConnectorArguments;
  /**
   * most mobile wallets
   */
  walletconnect: WalletConnectConnectorArguments;
  /**
   * coinbase wallet
   */
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
  // Currently ignored.
  iconUrls?: string[];
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
  const ctx = useContext(ThirdwebContext);
  invariant(
    ctx._inProvider,
    "Attempting to call useThirdwebContext from outside <ThirdwebProvider>, did you forget to wrap your application in a <ThirdwebProvider>?",
  );
  return ctx;
}

interface ThirdwebProviderProps {
  connectors: ThirdwebContext["connectors"];
  chainAddConfig?: ThirdwebContext["chainAddConfig"];
}

export const ThirdwebProvider: React.FC<ThirdwebProviderProps> = ({
  connectors,
  chainAddConfig,
  children,
}) => {
  return (
    <ThirdwebContext.Provider
      value={{ _inProvider: true, connectors, chainAddConfig }}
    >
      <Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
    </ThirdwebContext.Provider>
  );
};
