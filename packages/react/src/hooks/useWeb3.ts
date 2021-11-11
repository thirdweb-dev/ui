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
  const { connectors } = useThirdwebContext();
  const web3Ctx = useWeb3React<Web3Provider>();
  const connect = useConnectWallet();
  return useMemo(
    () => ({
      provider: web3Ctx.library,
      //force no null, just keep it to undefined or string
      account: web3Ctx.account || undefined,
      error: web3Ctx.error,
      connectedChainId: web3Ctx.chainId,
      connectWallet: connect,
      disconnectWallet: web3Ctx.deactivate,
      enabledConnectors: Object.keys(connectors) as ConnectorType[],
    }),
    [web3Ctx, connect, connectors],
  );
}
