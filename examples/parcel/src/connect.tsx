import { ConnectWallet } from "@3rdweb/react";
import { Flex, Text } from "@chakra-ui/react";
import React from "react";

export function Connect() {
  return (
    <Flex
      direction="column"
      width="100vw"
      height="100vh"
      align="center"
      padding="40px"
    >
      <Text fontSize="32px" fontWeight="bold">
        Web3 Connector
      </Text>
      <Text
        fontSize="16px"
        fontWeight="medium"
        color="#999"
        width="540px"
        textAlign="center"
        mb="64px"
      >
        Our web3 connector component completely handles wallet connection and
        network switching and comes with a context wrapper for your app.
        <br /> <br />
        You can also customize which connector types you support for your app,
        including Metamask, Coinbase, WalletConnect, and Magic Link.
        <br />
        <br />
        You can interact with the component below.
      </Text>
      <ConnectWallet />
    </Flex>
  );
}
