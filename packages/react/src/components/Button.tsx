import { useWeb3React } from "@web3-react/core";
import React from "react";

export const ConnectButton: React.FC = () => {
  const { account } = useWeb3React();
  return <button>{account ? account : "Connect"}</button>;
};
