import React, { useState, useMemo } from "react";
import { 
  Flex,
  Heading, 
  Stack,
  AspectRatio,
  Image,
  Button, 
  useDisclosure,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalHeader
} from "@chakra-ui/react";
import { useWeb3 } from "../hooks";
import { AddressCopyButton } from "./AddressCopyButton";
import { Card } from "./shared/Card";

export const ConnectWallet: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState<string>("");
  const { 
    address, 
    provider,
    connectWallet,
    disconnectWallet,
    connectors
  } = useWeb3();

  const activeProvider = useMemo(() => {
    return provider?.provider;
  }, [provider?.provider]);

  function activateConnector(connector: any, options?: any) {
    if (options) {
      connectWallet(connector, options);
    } else {
      connectWallet(connector);
    }
  }

  return (
    <>
      <Button onClick={onOpen}>
        {address ? "Info" : "Connect Wallet"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent pb={4} bg="gray.50">
          <ModalHeader as={Heading} size="lg">
            Connection Manager
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Stack spacing={4}>
              {address && (
                <>
                  <Stack as={Card}>
                    <Heading as="h4" size="sm" fontWeight="600">
                      Connected Wallet
                    </Heading>
                    <Flex align="center">
                      <Flex px={2} direction="column" align="start">
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
                  </Stack>

                  <hr />
                </>
              )}
              <Stack as={Card} spacing={4}>
                <Heading as="h4" size="sm" fontWeight="600">
                  Connect a{address ? " different" : ""} wallet
                </Heading>
                <Button
                  size="lg"
                  variant="outline"
                  isFullWidth
                  iconSpacing="auto"
                  rightIcon={
                    <AspectRatio ratio={1} w={6}>
                      <Image src="/logos/metamask-fox.svg" />
                    </AspectRatio>
                  }
                  onClick={() => activateConnector("injected")}
                >
                  MetaMask
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  isFullWidth
                  iconSpacing="auto"
                  rightIcon={
                    <AspectRatio ratio={1} w={6}>
                      <Image src="/logos/walletconnect-logo.svg" />
                    </AspectRatio>
                  }
                  onClick={() => activateConnector("walletconnect")}
                >
                  WalletConnect
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  isFullWidth
                  iconSpacing="auto"
                  rightIcon={
                    <AspectRatio ratio={1} w={6}>
                      <Image src="/logos/coinbase-wallet-logo.svg" />
                    </AspectRatio>
                  }
                  onClick={() => activateConnector("walletlink")}
                >
                  Coinbase Wallet
                </Button>
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};