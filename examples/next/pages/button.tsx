import { ConnectWallet } from "@3rdweb/react";
import React from "react";

export default function ExamplePage() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "100vw",
      height: "100vh"
    }}>
      <ConnectWallet />
    </div>
  );
}
