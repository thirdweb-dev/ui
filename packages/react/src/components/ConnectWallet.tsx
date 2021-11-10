import { useThirdweb } from "../hooks";
import styled from "styled-components";
import React from "react";

const Button = styled.button`
  height: 50px;
  background: #111111;
  color: white;
  padding: 0px 20px;
  border-radius: 8px;
  outline: none !important;
  border: none !important;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.85;
  }
`

export const ConnectWallet: React.FC = () => {
  const { account, activateInjected, deactivate } = useThirdweb();

  return (
    <Button onClick={account ? deactivate : activateInjected}>
      {account ? "Deactivate" : "Connect"}
    </Button>
  );
};
