import React from "react";
import { ButtonProps } from "@chakra-ui/button";
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useWeb3 } from "../../hooks";
import { ConnectButton } from "./ConnectButton";
import { ModalConencted } from "./ModalConnected";
import { ModalDisconnected } from "./ModalDisconnected";

export const ConnectWallet: React.FC<ButtonProps> = ({ ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useWeb3();

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
                <ModalConencted />
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
