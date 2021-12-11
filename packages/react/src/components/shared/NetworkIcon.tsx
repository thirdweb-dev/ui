import React from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { Image } from "@chakra-ui/react";

interface INetworkIcon {
  chainId: number;
}

export const NetworkIcon: React.FC<INetworkIcon> = ({ chainId }) => {
  const { getNetworkMetadata } = useWeb3();
  const icon = getNetworkMetadata(chainId).icon;

  if (typeof icon === "string") {
    return (
      <Image
        src={icon as string}
        height="36px"
        width="36px"
        borderRadius="25px"
      />
    );
  }

  return (icon as React.FC)({});
};