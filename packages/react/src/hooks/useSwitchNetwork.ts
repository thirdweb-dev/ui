import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useMemo, useState } from "react";
import { useThirdwebContext } from "../components/providers/Web3Provider";

export function useSwitchNetwork() {
  const { chainAddConfig } = useThirdwebContext();
  const { library, chainId } = useWeb3React<Web3Provider>();
  const [isSwitching, setIsSwitching] = useState(false);
  const [switchError, setSwitchError] = useState<Error | null>();

  const networkMetadata = {
    1: {
      chainName: "Ethereum Mainnet",
      iconUrl: ""
    },
    4: {
      chainName: "Rinkeby Testnet",
      iconUrl: ""
    }, 
    137: {
      chainName: "Matic Mainnet",
      iconUrl: ""
    }, 
    250: {
      chainName: "Fantom Opera",
      iconUrl: ""
    }, 
    43114: {
      chainName: "Avalanche",
      iconUrl: ""
    }, 
    80001: {
      chainName: "Matic Mumbai",
      iconUrl: ""
    }
  }

  const canAttemptSwitch = useMemo(() => {
    return !!library?.provider.request;
  }, [library?.provider.request]);

  const switchNetwork = useCallback(
    async (newChainId: number) => {
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
    networkMetadata,
    switchNetwork,
    canAttemptSwitch,
    isSwitching,
    switchError,
  };
}
