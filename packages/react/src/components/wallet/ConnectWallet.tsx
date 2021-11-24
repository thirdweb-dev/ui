import { useWeb3 } from "@3rdweb/hooks";
import { ButtonProps } from "@chakra-ui/button";
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  usePrevious,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { ConnectButton } from "./ConnectButton";
import { ModalConnected } from "./ModalConnected";
import { ModalDisconnected } from "./ModalDisconnected";

export const ConnectWallet: React.FC<
  ButtonProps & {
    disableNetworkSwitching?: boolean;
  }
> = ({ disableNetworkSwitching, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { chainId, address, connector, error } = useWeb3();

  const previousConnector = usePrevious(connector);
  const previousChainId = usePrevious(chainId);
  const previousAddress = usePrevious(address);

  // if chain id changes, then close modal
  useEffect(() => {
    if (previousChainId !== chainId) {
      onClose();
    }
  }, [chainId, previousChainId, onClose]);

  // if chain id changes, then close modal
  useEffect(() => {
    if (previousAddress !== address) {
      onClose();
    }
  }, [onClose, previousAddress, address]);

  // if connector changes, then close modal
  useEffect(() => {
    if (
      (connector && !previousConnector) ||
      (!connector && previousConnector)
    ) {
      onClose();
    }
  }, [connector, onClose, previousConnector]);

  return (
    <>
      <ConnectButton isOpen={isOpen} onOpen={onOpen} {...props} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent pb={4} bg="gray.50">
          <ModalCloseButton />

          <ModalBody pt="24px">
            <Flex direction="column">
              {connector && !error ? (
                <ModalConnected
                  disableNetworkSwitching={disableNetworkSwitching}
                />
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
