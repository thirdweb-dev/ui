import { ChakraProvider, Theme } from "@chakra-ui/react";
import React from "react";

export const ThirdwebThemeProvider: React.FC<{
  theme?: Theme;
}> = ({ theme, children }) => {
  return <ChakraProvider theme={theme}>{children}</ChakraProvider>;
};
