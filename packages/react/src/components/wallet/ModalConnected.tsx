import React from "react";
import { Flex, Stack, Heading, Button, Divider, Select, Image, Text } from "@chakra-ui/react";
import { useThirdwebContext } from "../providers/Web3Provider";
import { AddressCopyButton } from "./AddressCopyButton";
import { useSwitchNetwork, useWeb3 } from "../..";

export const ModalConnected: React.FC = () => {
  const { supportedChainIds } = useThirdwebContext();
  const { networkMetadata, switchNetwork, switchError } = useSwitchNetwork();
  const { chainId, connector, address, disconnectWallet, activeProvider } = useWeb3();

  return (
    <Flex direction="column">
      {!connector?.magic && (  
        <>
          <Flex direction="column">
            <Heading as="h4" size="sm" fontWeight="600" mb="12px">
              Switch network
            </Heading>
            {supportedChainIds.filter(id => id !== chainId).map(chainId =>   
              <Flex 
                alignSelf="center"
                onClick={() => switchNetwork(chainId)}
                align="center"
                width="md"
                _hover={{
                  bg: "gray.100"
                }}
                height="50px"
                px="20px"
                my="4px"
                cursor="pointer"
              >
                <Image 
                  src={networkMetadata[chainId]?.iconUrl || ""} 
                  height="36x"
                  width="36px"
                  borderRadius="25px"
                />
                <Text ml="12px" fontWeight="medium" fontSize="14px">
                  {networkMetadata[chainId]?.chainName}
                </Text>
              </Flex>
            )}
          </Flex>
          
          <Divider mt="32px" mb="24px" width="md" alignSelf="center" />
        </>
      )}

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