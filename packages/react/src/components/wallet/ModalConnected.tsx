import React from "react";
import { Flex, Stack, Heading, Button, Divider, Select } from "@chakra-ui/react";
import { useThirdwebContext } from "../providers/Web3Provider";
import { AddressCopyButton } from "./AddressCopyButton";
import { useSwitchNetwork, useWeb3 } from "../..";

export const ModalConnected: React.FC = () => {
  const { supportedChainIds } = useThirdwebContext();
  const { networkMetadata, switchNetwork, switchError } = useSwitchNetwork();
  const { chainId, address, disconnectWallet, activeProvider } = useWeb3();

  return (
    <Flex direction="column">
      <Stack spacing={4}>
        <Heading as="h4" size="sm" fontWeight="600">
          Switch network
        </Heading>
        <Select 
          mt="24px" 
          placeholder="Select a network..."
          onChange={e => switchNetwork(parseInt(e.target.value))}
          value={chainId}
        >
          {supportedChainIds.map(chainId =>
            <option value={chainId}>
              {networkMetadata[chainId] ? networkMetadata[chainId].chainName : chainId}
            </option>
          )}
        </Select>
      </Stack>
      
      <Divider mt="32px" mb="24px" width="md" alignSelf="center" />

      <Stack spacing={4}>
        <Heading as="h4" size="sm" fontWeight="600">
          Connected wallet
        </Heading>
        <Flex align="center">
          <Flex direction="column" align="start">
            <AddressCopyButton
              variant="outline"
              address={address}
            />
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
      </Stack>
    </Flex>
  )
}