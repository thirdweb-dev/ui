import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useCallback, useEffect, useMemo } from "react";
import {
  ConnectorType,
  NetworkMetadata,
  useThirdwebContext,
} from "../components/providers/Web3Provider";
import { useConnectWallet } from "./useConnectWallet";

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
    chainName: "Ethereum",
    iconUrl:
      "https://ethereum.org/static/4b5288012dc4b32ae7ff21fccac98de1/31987/eth-diamond-black-gray.png",
    symbol: "ETH",
    isTestnet: false,
  },
  4: {
    chainName: "Rinkeby",
    iconUrl:
      "https://ethereum.org/static/4b5288012dc4b32ae7ff21fccac98de1/31987/eth-diamond-black-gray.png",
    symbol: "ETH",
    isTestnet: true,
  },
  137: {
    chainName: "Polygon",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
    symbol: "MATIC",
    isTestnet: false,
  },
  250: {
    chainName: "Fantom",
    iconUrl:
      "https://icodrops.com/wp-content/uploads/2018/04/teryT6Hw_400x400.jpg",
    symbol: "FTM",
    isTestnet: false,
  },
  43114: {
    chainName: "Avalanche",
    iconUrl:
      "https://assets.website-files.com/6059b554e81c705f9dd2dd32/60ec6a944b52e3e96e16af68_Avalanche_Square_Red_Circle.png",
    symbol: "AVAX",
    isTestnet: false,
  },
  80001: {
    chainName: "Mumbai",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png",
    symbol: "MATIC",
    isTestnet: true,
  },
};

export function useWeb3(): Web3ContextInterface {
  const connect = useConnectWallet();
  const { connectors, networkMetadata } = useThirdwebContext();
  const web3Context = useWeb3React<Web3Provider>();
  const { library, connector, account, error, chainId, deactivate } =
    web3Context;

  useEffect(() => {
    const checkInjected = async () => {
      const injected = new InjectedConnector({});
      if (await injected.isAuthorized()) {
        connect("injected");
      }
    };

    setTimeout(() => {
      checkInjected();
    }, 500);
  }, [connect]);

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

  const getNetworkMetadata = useCallback(
    (_chainId: number): NetworkMetadata => {
      return (
        (networkMetadata && networkMetadata[_chainId]) ||
        defaultNetworkMetadata[_chainId] || {
          chainName: "",
          iconUrl: "",
          symbol: "",
        }
      );
    },
    [networkMetadata],
  );

  return useMemo(
    () => ({
      error,
      chainId,
      connector,
      provider: library,
      activeProvider,
      // Force no null account
      address: account || undefined,
      connectors: Object.keys(connectors) as ConnectorType[],
      connectWallet: connect,
      disconnectWallet,
      getNetworkMetadata,
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
