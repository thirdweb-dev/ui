import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

export const ThirdwebThemeProvider: React.FC<{
  theme?: any
}> = ({ 
  theme, 
  children 
}) => {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider>
  )
}