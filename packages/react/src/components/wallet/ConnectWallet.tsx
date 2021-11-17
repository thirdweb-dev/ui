import { ButtonProps } from "@chakra-ui/button";
import {
  AspectRatio,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { useWeb3 } from "../../hooks";
import { AddressCopyButton } from "./AddressCopyButton";
import { ConnectButton } from "./ConnectButton";
import { ModalDisconnected } from "./ModalDisconnected";

export const ConnectWallet: React.FC<ButtonProps> = ({ ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address, provider, disconnectWallet } = useWeb3();

  const activeProvider = useMemo(() => {
    return provider?.provider;
  }, [provider?.provider]);

  return (
    <>
      <ConnectButton onOpen={onOpen} {...props} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent pb={4} bg="gray.50">
          <ModalCloseButton />

          <ModalBody pt="24px">
            <Flex direction="column">
              {address ? (
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
              ) : (
                <ModalDisconnected />
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
