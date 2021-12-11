import { BigNumber } from "@ethersproject/bignumber";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { formatEther } from "@ethersproject/units";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Avalanche, Ethereum, Fantom, Polygon } from "@3rdweb/chain-icons";
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

const defaultNetworkMetadata: Record<number, NetworkMetadata> = {
  1: {
    chainName: "Ethereum",
    icon: Ethereum,
    symbol: "ETH",
    isTestnet: false,
  },
  4: {
    chainName: "Rinkeby",
    icon: Ethereum,
    symbol: "ETH",
    isTestnet: true,
  },
  137: {
    chainName: "Polygon",
    icon: Polygon,
    symbol: "MATIC",
    isTestnet: false,
  },
  250: {
    chainName: "Fantom",
    icon: Fantom,
    symbol: "FTM",
    isTestnet: false,
  },
  43114: {
    chainName: "Avalanche",
    icon: Avalanche,
    symbol: "AVAX",
    isTestnet: false,
  },
  80001: {
    chainName: "Mumbai",
    icon: Polygon,
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
