import { ConnectorType, useThirdwebContext } from "../components/providers/Web3Provider";
import { Web3Provider } from "@ethersproject/providers";
import { useConnectWallet } from "./useConnectWallet";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { useSwitchNetwork } from ".";

export interface Web3ContextInterface {
  error?: Error;
  chainId?: number;
  provider?: Web3Provider;
  address?: string;
  connectWallet: ReturnType<typeof useConnectWallet>;
  disconnectWallet: () => void;
  connectors: ConnectorType[];
}

export function useWeb3(): Web3ContextInterface {
  const connect = useConnectWallet();
  const { connectors } = useThirdwebContext();
  const web3Context = useWeb3React<Web3Provider>();
  const { library, connector, account, error, chainId, deactivate } = web3Context;
  const { switchNetwork } = useSwitchNetwork();

  const activeProvider = useMemo(() => {
    return library?.provider;
  }, [library?.provider])

  const disconnectWallet = async () => {
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
  };

  return useMemo(() => ({
    error: error,
    chainId,
    provider: library,
    address: account || undefined, // Force no null account
    connectWallet: connect,
    disconnectWallet,
    switchNetwork,
    connectors: Object.keys(connectors) as ConnectorType[],
  }), [web3Context, connect, connectors]);
}
