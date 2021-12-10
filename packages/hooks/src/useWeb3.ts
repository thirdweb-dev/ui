import { BigNumber } from "@ethersproject/bignumber";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useConnectWallet } from "./useConnectWallet";
import {
  ConnectorType,
  NetworkMetadata,
  useThirdwebContext,
} from "./Web3Provider";

interface Balance {
  value?: BigNumber;
  formatted: string;
}

export interface Web3ContextInterface {
  error?: Error;
  chainId?: number;
  balance?: Balance;
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
      "https://gateway.pinata.cloud/ipfs/QmQy3qKSfhxgE4xs9YJM6bG5f5cTJi9wXVFgroqPTbF2T9",
    symbol: "ETH",
    isTestnet: false,
  },
  4: {
    chainName: "Rinkeby",
    iconUrl:
      "https://gateway.pinata.cloud/ipfs/QmQy3qKSfhxgE4xs9YJM6bG5f5cTJi9wXVFgroqPTbF2T9",
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

  const [balance, setBalance] = useState<Balance>();

  useEffect(() => {
    if (error?.message.includes("The user rejected the request.")) {
      deactivate();
    }
  }, [error, deactivate]);

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

  useEffect(() => {
    const getBalance = async () => {
      if (account) {
        const accountBalance = await library?.getBalance(account);
        setBalance({
          value: accountBalance,
          formatted: formatEther(accountBalance || 0).slice(0, 6),
        });
      } else {
        setBalance({
          formatted: "0.0",
        });
      }
    };

    getBalance();
  }, [library, account]);

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
      balance,
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
      balance,
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
