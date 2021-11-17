import React from "react";
import { Flex, Stack, Heading, Button, Divider } from "@chakra-ui/react";
import { AddressCopyButton } from "./AddressCopyButton";
import { useWeb3 } from "../..";

export const ModalConencted: React.FC = () => {
  const { address, disconnectWallet, activeProvider } = useWeb3();

  return (
    <Flex direction="column">
      
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