import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useThirdwebContext } from "./Web3Provider";

const defaultChainAddConfig = {
  1: {
    chainId: `0x${Number(1).toString(16)}`,
    chainName: "Mainnet",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://main-light.eth.linkpool.io/"],
  },
  4: {
    chainId: `0x${Number(4).toString(16)}`,
    chainName: "Rinkeby (ETH Testnet)",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby-light.eth.linkpool.io/"],
  },
  137: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet (Matic)",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  250: {
    chainId: `0x${Number(250).toString(16)}`,
    chainName: "Fantom Opera",
    nativeCurrency: {
      name: "Fantom",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.ftm.tools"],
    blockExplorerUrls: ["https://ftmscan.com"],
  },
  43114: {
    chainId: `0x${Number(43114).toString(16)}`,
    chainName: "Avalanche Mainnet C-Chain",
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://cchain.explorer.avax.network"],
  },
  80001: {
    chainId: `0x${Number(80001).toString(16)}`,
    chainName: "Polygon Mumbai Testnet",
    nativeCurrency: {
      name: "Matic",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: [
      "https://rpc-mumbai.maticvigil.com",
      "https://rpc-mumbai.matic.today",
    ],
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
  },
};

export function useSwitchNetwork() {
  const { chainAddConfig } = useThirdwebContext();
  const { account, library, connector, chainId } = useWeb3React<Web3Provider>();
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState<Error | null>();
  const [connectorProvider, setConnectorProvider] = useState<any>();

  useEffect(() => {
    const getProvider = async () => {
      setConnectorProvider(await connector?.getProvider());
    };

    if (connector) {
      getProvider();
    }
  }, [connector]);

  useEffect(() => {
    setSwitchError(null);
  }, [chainId, account]);

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
    [chainAddConfig, connectorProvider, chainId],
  );

  return {
    switchNetwork,
    canAttemptSwitch,
    isSwitching,
    switchError,
  };
}
