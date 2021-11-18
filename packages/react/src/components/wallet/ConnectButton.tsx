import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "@chakra-ui/icons";
import { formatEther } from "@ethersproject/units";
import { Button, Stack, Flex, Tooltip, Image, Text, Divider } from "@chakra-ui/react";
import { IoWalletOutline } from "react-icons/io5";
import { useSwitchNetwork } from "../..";
import { useWeb3 } from "../../hooks/useWeb3";
import { shortenAddress } from "../../utils/shortenAddress";

export const ConnectButton: React.FC<{
  onOpen: () => void;
}> = ({ onOpen, ...props }) => {
  const { address, provider, chainId } = useWeb3();
  const { networkMetadata } = useSwitchNetwork();
  const [renderBalance, setRenderBalance] = useState("");

  useEffect(() => {
    const getBalance = async () => {
      if (address) {
        const balance = await provider?.getBalance(address);
        setRenderBalance(formatEther(balance || 0).slice(0, 6));
      } else {
        setRenderBalance("");
      }
    }

    getBalance();
  }, [provider])

  const renderSymbol = useMemo(() => {
    return (chainId && networkMetadata[chainId]?.symbol) || "";
  }, [chainId]);

  const renderIcon = useMemo(() => {
    return (
      (chainId && networkMetadata[chainId]?.iconUrl) || undefined
    );
  }, [chainId]);

  return (
    <Tooltip
      hasArrow
      label={
        address
          ? "Manage your connected wallet"
          : "Connect your wallet to get started"
      }
    >
      {address ? (
        <Flex 
          borderRadius="25px"
          borderWidth="1px"
          borderColor="gray.300"
          padding="5px"
          height="50px"
          align="center"
          onClick={onOpen}
          cursor="pointer"
          _hover={{
            borderColor: "#5CC4FF"
          }}
          {...props}
        >
          <Stack flexShrink={0} direction="row" align="center" pr={3}>
            {renderIcon && (
              <Image 
                height="40px"
                width="40px"
                borderRadius="25px"
                src={renderIcon} 
              />
            )}
            <Stack textAlign="left" justify="flex-start" spacing={0}>
              <Text size="label.md" color="heading" lineHeight={1}>
                {shortenAddress(address)}
              </Text>
              <Text color="gray.500" fontSize="12px" lineHeight={1}>
                {chainId && networkMetadata[chainId]?.chainName}
              </Text>
            </Stack>
          </Stack>
          <Divider
            borderColor="gray.300"
            flexShrink={0}
            orientation="vertical"
          />
          <Text 
            flexShrink={0} px={3} 
            fontSize="12px" 
            color="#0098EE" 
            lineHeight="14px"
          >
            {renderBalance}
            {renderSymbol.length > 2 && <br />}
            {renderSymbol}
          </Text>
        </Flex>
      ) : (
        <Button
          px={6}
          borderRadius="8px"
          leftIcon={<Icon mt="-1px" as={IoWalletOutline}></Icon>}
          onClick={onOpen}
          iconSpacing={3}
          {...props}
        >
          Connect Wallet
        </Button>
      )}
    </Tooltip>
  );
};
