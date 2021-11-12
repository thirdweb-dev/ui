import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";

export default function () {
  return (
    <Flex width="100vw" height="100vh" align="center" justify="center">
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
              textDecoration: "underline",
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
          Welcome to the Thirdweb Component Library. This is a toolbox of all
          the components you'll need to start easily integrating web3 into your
          apps.
          <br />
          <br />
          You can learn more about our components by clicking on the links
          below.
        </Text>

        <NextLink href="/connect">
          <Flex
            mt="64px"
            width="100%"
            align="center"
            direction="column"
            borderRadius="16px"
            padding="20px"
            border="1px solid #EAEAEA"
            cursor="pointer"
            _hover={{
              bg: "#FAFAFA",
            }}
          >
            <Text fontSize="20px" fontWeight="bold">
              Web3 Connector
            </Text>
            <Text fontSize="14px" mt="8px" color="#999" textAlign="center">
              This component completely handles wallet connection and network
              switching.
            </Text>
          </Flex>
        </NextLink>

        <NextLink href="/hooks">
          <Flex
            width="100%"
            mt="24px"
            align="center"
            direction="column"
            borderRadius="16px"
            padding="20px"
            border="1px solid #EAEAEA"
            cursor="pointer"
            _hover={{
              bg: "#FAFAFA",
            }}
          >
            <Text fontSize="20px" fontWeight="bold">
              Web3 Connection Hooks
            </Text>
            <Text fontSize="14px" mt="8px" color="#999" textAlign="center">
              These hooks let you make your own custom web3 connection setup.
            </Text>
          </Flex>
        </NextLink>
      </Flex>
    </Flex>
  );
}
