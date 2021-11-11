import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useCallback, useMemo, useState } from "react";
import { useThirdwebContext } from "../components/Provider";

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
        //this is a no-op
        console.debug("chainId === newChainId, no-op");
        return;
      }
      setIsSwitching(true);
      const chainHex = `0x${newChainId.toString(16)}`;
      try {
        await library?.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: chainHex }],
        });
      } catch (switchError) {
        //if we fail to switch, first try to add the new chain
        if (
          (switchError as any).code === 4902 &&
          chainAddConfig &&
          chainAddConfig[newChainId]
        ) {
          try {
            await library?.provider.request({
              method: "wallet_addEthereumChain",
              params: [chainAddConfig[newChainId]],
            });
          } catch (addError) {
            //if we fail to add, we can't switch
            setSwitchError(addError as Error);
          }
        } else {
          setSwitchError(switchError as Error);
        }
      } finally {
        setIsSwitching(false);
      }
    },
    [chainAddConfig, library, chainId],
  );

  return { switchNetwork, canAttemptSwitch, isSwitching, switchError };
}
