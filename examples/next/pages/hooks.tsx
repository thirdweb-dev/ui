import { useSwitchNetwork, useWeb3 } from "@3rdweb/react";
import React from "react";

export default function ExamplePage() {
  const { address, chainId, connectWallet, error } = useWeb3();
  const { canAttemptSwitch, switchNetwork, switchError } = useSwitchNetwork();
  
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeContent: "center",
      }}
    >
      <div>
        <h2>Current status</h2>
        <div>
          Current chainId: <pre>{chainId}</pre>
        </div>
        <div>
          Can attempt to switch: <pre>{`${!!canAttemptSwitch}`}</pre>
        </div>
        <div>
          Connected: <pre>{`${!!address}`}</pre>
        </div>
        {address && (
          <div>
            Wallet Address: <pre>{address}</pre>
          </div>
        )}
      </div>
      <button onClick={() => connectWallet("injected")}>
        Connect with Metamask
      </button>
      <button onClick={() => connectWallet("walletconnect")}>
        Connect with WalletConnect
      </button>
      <button onClick={() => connectWallet("walletlink")}>
        Connect with WalletLink
      </button>
      <hr />
      <button onClick={() => switchNetwork(137)}>Switch ChainId</button>

      <div>
        <h3>Error</h3>
        <pre>{error?.message || switchError?.message}</pre>
      </div>
    </div>
  );
}
