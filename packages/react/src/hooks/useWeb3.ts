import { useCallback, useEffect, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import {
  ConnectorType,
  useThirdwebContext,
} from "../components/providers/Web3Provider";
import { useConnectWallet } from "./useConnectWallet";
import { useSwitchNetwork } from "./useSwitchNetwork";

export interface Web3ContextInterface {
  error?: Error;
  chainId?: number;
  provider?: Web3Provider;
  activeProvider?: ExternalProvider;
  address?: string;
  connectWallet: ReturnType<typeof useConnectWallet>;
  disconnectWallet: () => void;
  connectors: ConnectorType[];
}

export function useWeb3(): Web3ContextInterface {
  const toast = useToast();
  const connect = useConnectWallet();
  const { connectors, displayErrors } = useThirdwebContext();
  const web3Context = useWeb3React<Web3Provider>();
  const { library, connector, account, error, chainId, deactivate } = web3Context;
  const { switchNetwork } = useSwitchNetwork();

  useEffect(() => {
    if (error && displayErrors) {
      toast({
        title: error.message,
        status: "error",
        duration: 5000,
        position: "bottom-right",
        isClosable: true
      })
    }
  }, [library])

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

  return useMemo(
    () => ({
      error,
      chainId,
      provider: library,
      activeProvider,
      // Force no null account
      address: account || undefined,
      connectWallet: connect,
      disconnectWallet,
      switchNetwork,
      connectors: Object.keys(connectors) as ConnectorType[],
    }),
    [
      account,
      chainId,
      activeProvider,
      connect,
      connectors,
      disconnectWallet,
      error,
      library,
      switchNetwork,
    ],
  );
}
