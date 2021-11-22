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
import React, { useState, useEffect } from "react";
import { useWeb3 } from "../../hooks";
import { ConnectButton } from "./ConnectButton";
import { ModalConnected } from "./ModalConnected";
import { ModalDisconnected } from "./ModalDisconnected";

export const ConnectWallet: React.FC<ButtonProps> = ({ ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { chainId, connector } = useWeb3();
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [chainId, onClose]);

  useEffect(() => {
    if (connected && !connector) {
      setConnected(false);
      onClose();
    } else if (!connected && connector) {
      setConnected(true);
      onClose();
    }
  }, [connector]);

  return (
    <>
      <ConnectButton isOpen={isOpen} onOpen={onOpen} {...props} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent pb={4} bg="gray.50">
          <ModalCloseButton />

          <ModalBody pt="24px">
            <Flex direction="column">
              {connector ? <ModalConnected /> : <ModalDisconnected />}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
