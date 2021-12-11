import React from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { Icon, Image, IconProps } from "@chakra-ui/react";

interface INetworkIcon
  extends Pick<IconProps, "height" | "width" | "borderRadius"> {
  chainId: number;
}

export const NetworkIcon: React.FC<INetworkIcon> = ({
  chainId,
  height = "36px",
  width = "36px",
  borderRadius = 0,
}) => {
  const { getNetworkMetadata } = useWeb3();
  const icon = getNetworkMetadata(chainId).icon;

  if (typeof icon === "string") {
    return (
      <Image
        src={icon}
        height={height}
        width={width}
        borderRadius={borderRadius}
      />
    );
  }

  return (
    <Icon as={icon} height={height} width={width} borderRadius={borderRadius} />
  );
};
