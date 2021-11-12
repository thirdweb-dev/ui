import { ChakraProvider } from "@chakra-ui/react";
import React from "react";

export const ThirdwebThemeProvider: React.FC<{
  theme?: any;
}> = ({ theme, children }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
