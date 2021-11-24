import { ThirdwebWeb3Provider, ThirdwebWeb3ProviderProps } from "@3rdweb/hooks";
import type { Theme } from "@chakra-ui/react";
import React from "react";
import { ThirdwebThemeProvider } from "./ThemeProvider";

interface ThirdwebProviderProps extends ThirdwebWeb3ProviderProps {
  theme?: Theme;
}

export const ThirdwebProvider: React.FC<ThirdwebProviderProps> = ({
  theme,
  children,
  ...restProps
}) => {
  return (
    <ThirdwebWeb3Provider {...restProps}>
      <ThirdwebThemeProvider theme={theme}>{children}</ThirdwebThemeProvider>
    </ThirdwebWeb3Provider>
  );
};
