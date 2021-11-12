import { ButtonProps } from "@chakra-ui/button";
import {
  AspectRatio,
  Button,
  Flex,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { useWeb3 } from "../../hooks";
import { Card } from "../shared/Card";
import { AddressCopyButton } from "./AddressCopyButton";
import { ConnectButton } from "./ConnectButton";

export const ConnectWallet: React.FC<ButtonProps> = ({ ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { address, provider, connectWallet, disconnectWallet, connectors } =
    useWeb3();

  const activeProvider = useMemo(() => {
    return provider?.provider;
  }, [provider?.provider]);

  function isEmailValid() {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  async function connectMagic() {
    if (isEmailValid()) {
      setEmail("");
      setLoading(true);
      await connectWallet("magic", { email });
      setLoading(false);
    } else {
      setError(true);
    }
  }

  return (
    <>
      <ConnectButton onOpen={onOpen} {...props} />
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

                  <hr />
                </>
              )}

              {connectors.includes("magic") && (
                <Stack as={Card} spacing={4}>
                  <Heading as="h4" size="sm" fontWeight="600">
                    Connect with email
                  </Heading>
                  <Flex direction="column">
                    <Flex>
                      <Input
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError(false);
                        }}
                        placeholder="name@example.com"
                        borderRadius="4px 0px 0px 4px"
                      />
                      <Button
                        borderRadius="0px 4px 4px 0px"
                        width="120px"
                        onClick={connectMagic}
                      >
                        {loading ? (
                          <Flex>
                            <Spinner />
                          </Flex>
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    </Flex>
                    {error && (
                      <Text color="red.400" fontSize="14px" mt="4px">
                        Please enter a valid email.
                      </Text>
                    )}
                  </Flex>
                </Stack>
              )}

              {connectors.some((connector) => connector !== "magic") && (
                <Stack as={Card} spacing={4}>
                  <Heading as="h4" size="sm" fontWeight="600">
                    Connect a{address ? " different" : ""} wallet
                  </Heading>

                  {connectors.includes("injected") && (
                    <Button
                      size="lg"
                      variant="outline"
                      isFullWidth
                      iconSpacing="auto"
                      rightIcon={
                        <AspectRatio ratio={1} w={6}>
                          <Image src="https://thirdweb.com/logos/metamask-fox.svg" />
                        </AspectRatio>
                      }
                      onClick={() => connectWallet("injected")}
                    >
                      MetaMask
                    </Button>
                  )}

                  {connectors.includes("walletconnect") && (
                    <Button
                      size="lg"
                      variant="outline"
                      isFullWidth
                      iconSpacing="auto"
                      rightIcon={
                        <AspectRatio ratio={1} w={6}>
                          <Image src="https://thirdweb.com/logos/walletconnect-logo.svg" />
                        </AspectRatio>
                      }
                      onClick={() => connectWallet("walletconnect")}
                    >
                      WalletConnect
                    </Button>
                  )}

                  {connectors.includes("walletlink") && (
                    <Button
                      size="lg"
                      variant="outline"
                      isFullWidth
                      iconSpacing="auto"
                      rightIcon={
                        <AspectRatio ratio={1} w={6}>
                          <Image src="https://thirdweb.com/logos/coinbase-wallet-logo.svg" />
                        </AspectRatio>
                      }
                      onClick={() => connectWallet("walletlink")}
                    >
                      Coinbase Wallet
                    </Button>
                  )}
                </Stack>
              )}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
