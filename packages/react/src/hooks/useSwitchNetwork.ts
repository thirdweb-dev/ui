import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useMemo, useState } from "react";
import { useThirdwebContext } from "../components/providers/Web3Provider";

const defaultNetworkMetadata = {
  1: {
    chainName: "Ethereum Mainnet",
    iconUrl: "https://ethereum.org/static/4b5288012dc4b32ae7ff21fccac98de1/31987/eth-diamond-black-gray.png"
  },
  4: {
    chainName: "Rinkeby Testnet",
    iconUrl: "https://ethereum.org/static/4b5288012dc4b32ae7ff21fccac98de1/31987/eth-diamond-black-gray.png"
  }, 
  137: {
    chainName: "Matic Mainnet",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"
  }, 
  250: {
    chainName: "Fantom Opera",
    iconUrl: "https://icodrops.com/wp-content/uploads/2018/04/teryT6Hw_400x400.jpg"
  }, 
  43114: {
    chainName: "Avalanche",
    iconUrl: "https://assets.website-files.com/6059b554e81c705f9dd2dd32/60ec6a944b52e3e96e16af68_Avalanche_Square_Red_Circle.png"
  }, 
  80001: {
    chainName: "Matic Mumbai",
    iconUrl: "https://s2.coinmarketcap.com/static/img/coins/64x64/3890.png"
  }
}

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
  const { library, chainId } = useWeb3React<Web3Provider>();
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState<Error | null>();

  const canAttemptSwitch = useMemo(() => {
    return !!library?.provider.request;
  }, [library?.provider.request]);

  const switchNetwork = useCallback(
    async (newChainId: number) => {
      console.log(newChainId);

      if (!library?.provider.request) {
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
        await library?.provider.request({
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
            await library?.provider.request({
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
            await library?.provider.request({
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
    [chainAddConfig, library, chainId],
  );

  return {
    networkMetadata: defaultNetworkMetadata,
    switchNetwork,
    canAttemptSwitch,
    isSwitching,
    switchError,
  };
}
