import React, { useEffect, useMemo } from "react";
import { ISDKOptions, ThirdwebSDK } from "@3rdweb/sdk"
import { useAccount, useNetwork, useSigner } from "wagmi";

interface ISdkProviderProps {
  sdkOptions?: Partial<ISDKOptions>;
}

interface SdkContextValue {
  sdk: ThirdwebSDK;
}

const SdkContext = React.createContext(
  undefined as unknown as SdkContextValue
);

export const SdkProvider: React.FC<ISdkProviderProps> = ({ children, sdkOptions }) => {
  const [{ data: account }] = useAccount();
  const [{ data: network }] = useNetwork();
  const [{ data: signer }, getSigner] = useSigner();

  // Refetch the signer everytime connector, account, or network changes
  useEffect(() => {
    getSigner();
  }, [
    account?.connector, 
    account?.address, 
    network?.chain?.id, 
    getSigner
  ]);

  const sdk = new ThirdwebSDK("mainnet", {
    ...sdkOptions,
  });

  return (
    <SdkContext.Provider value={{ sdk }}>
      {children}
    </SdkContext.Provider>
  )
}