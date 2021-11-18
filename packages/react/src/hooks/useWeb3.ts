import { useCallback, useMemo } from "react";
import { ConnectorType, NetworkMetadata, useThirdwebContext } from "../components/providers/Web3Provider";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useConnectWallet } from "./useConnectWallet";
import { useWeb3React } from "@web3-react/core";

export interface Web3ContextInterface {
  error?: Error;
  chainId?: number;
  provider?: Web3Provider;
  connector?: AbstractConnector & {
    [key: string]: any;
  };
  activeProvider?: ExternalProvider;
  address?: string;
  connectors: ConnectorType[];
  connectWallet: ReturnType<typeof useConnectWallet>;
  disconnectWallet: () => void;
  getNetworkMetadata: (chainId: number) => NetworkMetadata;
}

const defaultNetworkMetadata = {
  1: {
    chainName: "Ethereum Mainnet",
    iconUrl: "https://ethereum.org/static/4b5288012dc4b32ae7ff21fccac98de1/31987/eth-diamond-black-gray.png",
    symbol: "ETH"
  },
  4: {
    chainName: "Rinkeby Testnet",
    iconUrl: "https://ethereum.org/static/4b5288012dc4b32ae7ff21fccac98de1/31987/eth-diamond-black-gray.png",
    symbol: "ETH"
  }, 
  137: {
    chainName: "Matic Mainnet",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
    symbol: "MATIC"
  }, 
  250: {
    chainName: "Fantom Opera",
    iconUrl: "https://icodrops.com/wp-content/uploads/2018/04/teryT6Hw_400x400.jpg",
    symbol: "FTM"
  }, 
  43114: {
    chainName: "Avalanche",
    iconUrl: "https://assets.website-files.com/6059b554e81c705f9dd2dd32/60ec6a944b52e3e96e16af68_Avalanche_Square_Red_Circle.png",
    symbol: "AVAX"
  }, 
  80001: {
    chainName: "Matic Mumbai",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
    symbol: "MATIC"
  }
}

export function useWeb3(): Web3ContextInterface {
  const connect = useConnectWallet();
  const { connectors, networkMetadata } = useThirdwebContext();
  const web3Context = useWeb3React<Web3Provider>();
  const { library, connector, account, error, chainId, deactivate } = web3Context;

  const activeProvider = useMemo(() => {
    return library?.provider;
  }, [library?.provider]);

  const disconnectWallet = useCallback(async () => {
    const provider = activeProvider;
    if (!provider) {
      return;
    }

    if (provider.isMetaMask && provider.request) {
      const request = await provider.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      return request;
    } else {
      if (connector && (connector as any).close) {
        (connector as any).close();
        return;
      }
      return deactivate();
    }
  }, [activeProvider, connector, deactivate]);

  const getNetworkMetadata = useCallback((chainId: number): NetworkMetadata => {
    return networkMetadata && networkMetadata[chainId] || defaultNetworkMetadata[chainId] || {
      chainName: "",
      iconUrl: "",
      symbol: ""
    }
  }, [networkMetadata])

  return useMemo(
    () => ({
      error,
      chainId,
      connector,
      provider: library,
      activeProvider,
      address: account || undefined, // Force no null account
      connectors: Object.keys(connectors) as ConnectorType[],
      connectWallet: connect,
      disconnectWallet,
      getNetworkMetadata
    }),
    [
      account,
      chainId,
      connector,
      activeProvider,
      connect,
      connectors,
      disconnectWallet,
      getNetworkMetadata,
      error,
      library,
    ],
  );
}
