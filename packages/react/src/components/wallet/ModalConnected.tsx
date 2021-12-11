import { useSwitchNetwork, useThirdwebContext, useWeb3 } from "@3rdweb/hooks";
import {
  Alert,
  AlertIcon,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { NetworkIcon } from "../shared/NetworkIcon";
import { AddressCopyButton } from "./AddressCopyButton";

export const ModalConnected: React.FC<{
  disableNetworkSwitching?: boolean;
}> = ({ disableNetworkSwitching }) => {
  const { supportedChainIds } = useThirdwebContext();
  const { switchError } = useSwitchNetwork();
  const {
    chainId,
    connector,
    error,
    address,
    activeProvider,
    disconnectWallet,
    getNetworkMetadata,
  } = useWeb3();

  return (
    <Flex direction="column">
      {!disableNetworkSwitching &&
        !connector?.magic &&
        !connector?.walletConnectProvider && (
          <>
            <Flex direction="column">
              <Heading as="h4" size="sm" fontWeight="600" mb="12px">
                Switch network
              </Heading>
              {supportedChainIds
                .filter((cId) => !getNetworkMetadata(cId).isTestnet)
                .map((cId, index) => (
                  <Network key={index} index={index} cId={cId} />
                ))}
              {supportedChainIds
                .filter((cId) => getNetworkMetadata(cId).isTestnet)
                .map((cId, index) => (
                  <Network key={index} index={index} cId={cId} />
                ))}
            </Flex>

            <Divider mt="32px" mb="24px" width="md" alignSelf="center" />
          </>
        )}

      {disableNetworkSwitching && (
        <>
          <Flex direction="column">
            <Heading as="h4" size="sm" fontWeight="600" mb="12px">
              Connected network
            </Heading>
            <Network index={0} cId={chainId || 0} />
          </Flex>

          <Divider mt="32px" mb="24px" width="md" alignSelf="center" />
        </>
      )}

      <Stack spacing={4}>
        <Heading as="h4" size="sm" fontWeight="600">
          Connected wallet
        </Heading>

        {error || switchError ? (
          <Alert
            status="error"
            borderRadius="md"
            fontSize="sm"
            fontWeight="medium"
          >
            <AlertIcon />
            {switchError?.message || error?.message}
          </Alert>
        ) : (
          <Flex align="center">
            <Flex direction="column" align="start">
              <AddressCopyButton variant="outline" address={address} />
            </Flex>

            <Button
              onClick={disconnectWallet}
              variant="outline"
              ml="auto"
              size="sm"
            >
              {activeProvider?.isMetaMask ? "Switch" : "Disconnect"}
            </Button>
          </Flex>
        )}
      </Stack>
    </Flex>
  );
};

const Network: React.FC<{
  index: number;
  cId: number;
}> = ({ index, cId }) => {
  const { chainId, getNetworkMetadata } = useWeb3();
  const { switchNetwork } = useSwitchNetwork();

  return (
    <Flex
      key={index}
      alignSelf="center"
      onClick={() => switchNetwork(cId)}
      align="center"
      width="md"
      px="20px"
      py="2px"
      cursor="pointer"
    >
      <Flex
        width="100%"
        align="center"
        borderRadius="25px"
        padding="6px"
        justify="space-between"
        bg={cId === chainId ? "gray.100" : undefined}
        _hover={{
          bg: "gray.200",
        }}
      >
        <Flex align="center">
          <NetworkIcon chainId={cId} />
          <Text ml="12px" fontWeight="medium" fontSize="14px">
            {getNetworkMetadata(cId).chainName}
          </Text>
          {getNetworkMetadata(cId).isTestnet && (
            <Text fontSize="14px" color="gray.400">
              &nbsp;(testnet)
            </Text>
          )}
        </Flex>
        {cId === chainId && (
          <Text color="blue.400" fontSize="14px" mr="8px">
            Connected
          </Text>
        )}
      </Flex>
    </Flex>
  );
};
