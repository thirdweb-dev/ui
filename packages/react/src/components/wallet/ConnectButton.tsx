import { useSwitchNetwork, useWeb3 } from "@3rdweb/hooks";
import { Icon } from "@chakra-ui/icons";
import { Button, Divider, Flex, Stack, Text, Tooltip } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";
import { NetworkIcon } from "../shared/NetworkIcon";
import { shortenAddress } from "../../utils/shortenAddress";

export const ConnectButton: React.FC<{
  onOpen: () => void;
  isOpen: boolean;
}> = ({ onOpen, isOpen, ...props }) => {
  const { address, balance, chainId, error, getNetworkMetadata } = useWeb3();
  const { switchError } = useSwitchNetwork();

  const networkMetadata = useMemo(() => {
    if (chainId) {
      return getNetworkMetadata(chainId);
    }
  }, [chainId, getNetworkMetadata]);

  return (
    <Tooltip
      zIndex={-1}
      hasArrow
      isOpen={!isOpen && (!!error || !!switchError)}
      label={
        switchError
          ? switchError.message
          : error
          ? error.message
          : address
          ? "Manage your connected wallet"
          : "Connect your wallet to get started"
      }
    >
      {address ? (
        <Flex
          borderRadius="25px"
          borderWidth="1px"
          borderColor="gray.300"
          padding="6px"
          height="48px"
          align="center"
          onClick={onOpen}
          cursor="pointer"
          _hover={{
            borderColor: "#5CC4FF",
          }}
          {...props}
        >
          <Stack flexShrink={0} direction="row" align="center" pr={3}>
            <NetworkIcon chainId={chainId as number} />
            <Stack textAlign="left" justify="flex-start" spacing={0}>
              <Text color="heading" lineHeight={1}>
                {shortenAddress(address)}
              </Text>
              <Text color="gray.500" fontSize="12px" lineHeight={1}>
                {networkMetadata?.chainName}
              </Text>
            </Stack>
          </Stack>
          <Divider
            borderColor="gray.300"
            flexShrink={0}
            orientation="vertical"
          />
          <Text
            flexShrink={0}
            px={3}
            fontSize="12px"
            color="#0098EE"
            lineHeight="14px"
          >
            {balance?.formatted}
            {networkMetadata && networkMetadata.symbol.length > 2 && <br />}
            {networkMetadata?.symbol}
          </Text>
        </Flex>
      ) : (
        <Button
          px={6}
          borderRadius="8px"
          leftIcon={
            error || switchError ? (
              <Icon as={FiAlertTriangle} />
            ) : (
              <Icon as={IoWalletOutline} />
            )
          }
          onClick={onOpen}
          iconSpacing={3}
          colorScheme={error || switchError ? "red" : "blue"}
          {...props}
        >
          {error || switchError ? "Network Error" : "Connect Wallet"}
        </Button>
      )}
    </Tooltip>
  );
};
