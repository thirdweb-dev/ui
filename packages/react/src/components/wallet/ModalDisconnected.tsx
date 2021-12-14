import { useWeb3 } from "@3rdweb/hooks";
import {
  AspectRatio,
  Button,
  Divider,
  Flex,
  Heading,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

export const ModalDisconnected: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { address, connectWallet, connectors } = useWeb3();

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
    <Flex direction="column">
      {connectors.includes("magic") && (
        <Stack spacing={4}>
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

      {connectors.includes("magic") &&
        connectors.some((connector) => connector !== "magic") && (
          <Divider mt="32px" mb="24px" width="md" alignSelf="center" />
        )}

      {connectors.some((connector) => connector !== "magic") && (
        <Stack spacing={4}>
          <Heading as="h4" size="sm" mt="0px" fontWeight="600">
            Connect a{address ? " different" : ""} wallet
          </Heading>

          {connectors.includes("injected") &&
            typeof window !== "undefined" &&
            "ethereum" in window && (
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
    </Flex>
  );
};
