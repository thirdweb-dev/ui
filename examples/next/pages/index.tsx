import { useConnectWallet } from "@3rdweb/react";
import React from "react";

export default function ExamplePage() {
  const context = useConnectWallet();
  console.log("*** context", context);
  return <div>foo bar</div>;
}
