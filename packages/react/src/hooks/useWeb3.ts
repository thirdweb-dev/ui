import type { Provider } from "@ethersproject/abstract-provider";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useMemo } from "react";
import { ConnectorType, useThirdwebContext } from "../components/Provider";
import { useConnectWallet } from "./useConnectWallet";

export interface Web3ContextInterface {
  provider?: Provider;
  account?: string;
  error?: Error;
  connectedChainId?: number;
  connectWallet: ReturnType<typeof useConnectWallet>;
  disconnectWallet: () => void;
  enabledConnectors: ConnectorType[];
}

export function useWeb3(): Web3ContextInterface {
  const web3Context = useWeb3React<Web3Provider>();
  const { library, account, error, chainId, deactivate } = web3Context;

  const connect = useConnectWallet();
  const { connectors } = useThirdwebContext();

  return useMemo(() => ({
    provider: library,
    account: account || undefined, // Force no null account
    error: error,
    connectedChainId: chainId,
    connectWallet: connect,
    disconnectWallet: deactivate,
    enabledConnectors: Object.keys(connectors) as ConnectorType[],
  }), [web3Context, connect, connectors]);
}
