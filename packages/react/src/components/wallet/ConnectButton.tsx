import { Icon } from "@chakra-ui/icons";
import { Button, ButtonProps, Tooltip } from "@chakra-ui/react";
import React from "react";
import { IoWalletOutline } from "react-icons/io5";
import { useWeb3 } from "../..";

interface IConnectButton extends ButtonProps {
  handleConnectModalOpen: () => void;
}

export const ConnectButton: React.FC<IConnectButton> = ({
  handleConnectModalOpen,
  ...restProps
}) => {
  const { address } = useWeb3();

  return (
    <Tooltip
      hasArrow
      label={
        account
          ? "Manage connected wallet"
          : "Connect your wallet to get started"
      }
    >
      <Button
        px={6}
        borderRadius="full"
        colorScheme="primary"
        variant="outline"
        leftIcon={<Icon mt="-1px" as={IoWalletOutline}></Icon>}
        onClick={handleConnectModalOpen}
        iconSpacing={3}
        {...restProps}
      >
        {account ? shortenIfAddress(account) : "Connect Wallet"}
      </Button>
    </Tooltip>
  );
};
