import {
  Button,
  ButtonGroup,
  ButtonGroupProps,
  Icon,
  IconButton,
  Tooltip,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { IoCopy } from "react-icons/io5";

interface IAddressCopyButton extends Omit<ButtonGroupProps, "onClick"> {
  address?: string;
  noIcon?: boolean;
}

export const AddressCopyButton: React.FC<IAddressCopyButton> = ({
  address,
  noIcon,
  ...restButtonProps
}) => {
  const { onCopy } = useClipboard(address || "");
  const toast = useToast();

  function shortenAddress(str: string) {
    return str.substring(0, 6) + '...' + str.substring(str.length - 4)
  }

  const defaultProps: ButtonGroupProps = {
    flexGrow: 0,
    variant: "solid",
    size: "sm",
    fontSize: "md",
    fontWeight: "normal",
  };
  return (
    <Tooltip hasArrow label="Copy address to clipboard">
      <ButtonGroup
        {...{ ...defaultProps, ...restButtonProps }}
        isAttached
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onCopy();
          toast({
            title: "Address copied.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }}
      >
        {noIcon ? null : (
          <IconButton
            mr="-px"
            borderRight="none"
            aria-label="Add to friends"
            icon={<Icon as={IoCopy} />}
          />
        )}
        <Button>{address && shortenAddress(address)}</Button>
      </ButtonGroup>
    </Tooltip>
  );
};
