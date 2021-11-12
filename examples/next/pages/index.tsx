import { Flex, Heading, Link } from "@chakra-ui/react";

export default function() {
  return (
    <Flex
      width="100vw"
      height="100vh"
      align="center"
      justify="center"
    >
      <Flex direction="column">
        <Heading
          margin="0"
          lineHeight="1.15"
          fontSize="4rem"
        >
          <Link 
            href="https://thirdweb.com"
            color="#0070f3"
            _hover={{
              textDecoration: "underline"
            }}
          >
            Thirdweb
          </Link> UI Library
        </Heading>
      </Flex>
    </Flex>
  )
}