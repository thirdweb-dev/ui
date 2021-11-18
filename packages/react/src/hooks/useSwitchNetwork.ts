import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useThirdwebContext } from "../components/providers/Web3Provider";

const defaultChainAddConfig = {
  1: { 
    chainId: "0x1",
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://main-light.eth.linkpool.io/"
    ],
  },
  4: {
    chainId: "0x4",
    chainName: "Rinkeby Tesnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [
      "https://rinkeby-light.eth.linkpool.io/"
    ],
  },
  137: {
    chainId: "0x89",
    chainName: "Matic Mainnet",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: [
      "https://rpc-mainnet.matic.network/",
      "https://rpc-mainnet.maticvigil.com/",
      "https://rpc-mainnet.matic.quiknode.pro/",
    ],
  },
  250: {
    chainId: "0xfa",
    chainName: "Fantom Opera",
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrls: [
      "https://rpc.ftm.tools/"
    ],
  },
  43114: {
    chainId: "0xa86a",
    chainName: "Avalanche Mainnet",
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: [
      "https://api.avax.network/ext/bc/C/rpc"
    ],
  },
  80001: {
    chainId: "0x13881",
    chainName: "Matic Mumbai",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: [
      "https://rpc-endpoints.superfluid.dev/mumbai"
    ],
  }
}

export function useSwitchNetwork() {
  const { chainAddConfig } = useThirdwebContext();
  const { account, library, connector, chainId } = useWeb3React<Web3Provider>();
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState<Error | null>();
  const [connectorProvider, setConnectorProvider] = useState<any>();

  useEffect(() => {
    const getProvider = async () => {
      const connectorProvider = await connector?.getProvider();
      setConnectorProvider(connectorProvider);
    }

    if (connector) {
      getProvider();
    }
  }, [connector])

  useEffect(() => {
    setSwitchError(null);
  }, [chainId, account])

  const canAttemptSwitch = useMemo(() => {
    return !!connectorProvider?.request;
  }, [connectorProvider?.request]);

  const switchNetwork = useCallback(
    async (newChainId: number) => {
      if (!connectorProvider?.request) {
        setSwitchError(new Error("No provider available to switch"));
        return;
      }

      setSwitchError(null);
      if (newChainId === chainId) {
        return;
      }

      setIsSwitching(true);
      const chainHex = `0x${newChainId.toString(16)}`;
      try {
        await connectorProvider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainHex }],
        });
      } catch (_switchError) {
        if (
          (_switchError as any).code === 4902 &&
          chainAddConfig &&
          chainAddConfig[newChainId]
        ) {
          try {
            await connectorProvider.request({
              method: "wallet_addEthereumChain",
              params: [chainAddConfig[newChainId]],
            });
          } catch (addError) {
            setSwitchError(addError as Error);
          }
        } else if (
          (_switchError as any).code === 4902 &&
          defaultChainAddConfig[newChainId]
        ) {
          try {
            await connectorProvider.request({
              method: "wallet_addEthereumChain",
              params: [defaultChainAddConfig[newChainId]],
            });
          } catch (addError) {
            setSwitchError(addError as Error);
          }
        } else {
          setSwitchError(_switchError as Error);
        }
      } finally {
        setIsSwitching(false);
      }
    },
    [chainAddConfig, connectorProvider, library, chainId],
  );

  return {
    switchNetwork,
    canAttemptSwitch,
    isSwitching,
    switchError,
  };
}
