import { useSwitchNetwork, useWeb3 } from "@3rdweb/hooks";
import { AspectRatio, Button, Flex, Image, Text } from "@chakra-ui/react";
import React from "react";

export function Hooks() {
  const { address, chainId, connectWallet, disconnectWallet } = useWeb3();
  const { canAttemptSwitch } = useSwitchNetwork();

  return (
    <Flex
      direction="column"
      width="100vw"
      height="100vh"
      align="center"
      padding="40px"
    >
      <Text fontWeight="bold" fontSize="24px">
        Web3 Connection Hooks
      </Text>
      <Text
        fontSize="16px"
        fontWeight="medium"
        color="#999"
        width="540px"
        textAlign="center"
        mb="64px"
      >
        Our web3 connection hooks let you use our wallet conenction and network
        switching setup with your own custom components.
        <br />
        <br />
        The component below is built entirely with our connection hooks.
      </Text>

      <Flex
        width="400px"
        bg="gray.50"
        borderRadius="16px"
        direction="column"
        padding="20px"
      >
        <Text fontWeight="bold" fontSize="24px" alignSelf="center">
          Current Status
        </Text>
        <Text>
          <strong>ChainID:</strong> {chainId || "N/A"}
        </Text>
        <Text>
          <strong>Can Switch:</strong> {`${!!canAttemptSwitch}`}
        </Text>
        <Text>
          <strong>Connected:</strong> {`${!!address}`}
        </Text>
        <Text>
          <strong>Wallet Address:</strong>{" "}
          {address ? `${address.slice(0, 16)}...` : "N/A"}
        </Text>

        {address && (
          <Button
            onClick={disconnectWallet}
            mt="8px"
            variant="outline"
            bg="white"
          >
            Disconnect
          </Button>
        )}

        <Text
          fontWeight="bold"
          fontSize="24px"
          alignSelf="center"
          mt="32px"
          mb="8px"
        >
          Connect Wallet
        </Text>

        <Button
          mb="8px"
          size="lg"
          variant="outline"
          bg="white"
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

        <Button
          mb="8px"
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
      </Flex>
    </Flex>
  );
}
