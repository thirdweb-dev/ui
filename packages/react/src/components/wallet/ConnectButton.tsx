import { Icon } from "@chakra-ui/icons";
import { Button, Tooltip } from "@chakra-ui/react";
import React from "react";
import { IoWalletOutline } from "react-icons/io5";
import { useWeb3 } from "../..";
import { shortenAddress } from "../../utils/shortenAddress";

export const ConnectButton: React.FC<{
  onOpen: () => void;
}> = ({
  onOpen,
  ...props
}) => {
  const { address } = useWeb3();

  return (
    <Tooltip
      hasArrow
      label={
        address
          ? "Manage your connected wallet"
          : "Connect your wallet to get started"
      }
    >
      <Button
        px={6}
        borderRadius="8px"
        leftIcon={<Icon mt="-1px" as={IoWalletOutline}></Icon>}
        onClick={onOpen}
        iconSpacing={3}
        {...props}
      >
        {address ? shortenAddress(address) : "Connect Wallet"}
      </Button>
    </Tooltip>
  );
};
