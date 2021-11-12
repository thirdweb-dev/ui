import { ConnectorType, useThirdwebContext } from "../components/Web3Provider";
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
  const { library, account, error, chainId, deactivate } = web3Context;
  const { switchNetwork } = useSwitchNetwork();

  return useMemo(() => ({
    error: error,
    chainId,
    provider: library,
    address: account || undefined, // Force no null account
    connectWallet: connect,
    disconnectWallet: deactivate,
    switchNetwork,
    connectors: Object.keys(connectors) as ConnectorType[],
  }), [web3Context, connect, connectors]);
}
