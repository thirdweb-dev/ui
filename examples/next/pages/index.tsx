import { ConnectWallet } from "@3rdweb/react";
import { Text, Flex, Heading, Link } from "@chakra-ui/react";

export default function() {
  return (
    <Flex
      width="100vw"
      height="100vh"
      align="center"
      justify="center"
    >
      <Flex direction="column" align="center">
        <Heading
          mt="0px"
          mb="12px"
          lineHeight="1.15"
          textAlign="center"
          fontSize="4rem"
        >
          <Link 
            target="_blank"
            href="https://thirdweb.com"
            color="#0070f3"
            _hover={{
              textDecoration: "underline"
            }}
          >
            Thirdweb
          </Link> 
          <br />
          Component Library
        </Heading>

        <Text 
          fontSize="16px"
          fontWeight="medium" 
          color="#999" 
          width="540px"
          textAlign="center"
        >
          Welcome to the Thirdweb Component Library. This is a toolbox of all the components
          you'll need to start easily integrating web3 into your apps.
          <br /><br />
          You can view and interact with some of our components below.
        </Text>

        <Text mt="64px" fontSize="32px" fontWeight="bold">
          Web3 Connector
        </Text>
        <Text 
          fontSize="16px"
          fontWeight="medium" 
          color="#999" 
          width="540px"
          textAlign="center"
          mb="32px"
        >
          Our web3 connector completely handles wallet connection and network switching and
          comes with a context wrapper for your app.
        </Text>
        <ConnectWallet />
      </Flex>
    </Flex>
  )
}