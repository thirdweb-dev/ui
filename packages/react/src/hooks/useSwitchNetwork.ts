import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useMemo, useState } from "react";
import { useThirdwebContext } from "../components/providers/Web3Provider";

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
    switchNetwork,
    canAttemptSwitch,
    isSwitching,
    switchError,
  };
}
