# Thirdweb Hooks

<br>

## Introduction

Welcome to the Thirdweb ReactnHooks Library. This package provides you with extensible react hooks to handle the web3 side of your app.

We simplify the process of integrating web3 into your apps while making sure that you still have all the control you would using other lower level web3 frontend libraries.

Our main features are:

- Support for most commonly used web3 providers including: [MetaMask](https://metamask.io/), [WalletConnect](https://walletconnect.com/), [Coinbase Wallet](https://wallet.coinbase.com/), and [Magic Link](https://magic.link/).
- An app wide context containing an [ethers.js](https://github.com/ethers-io/ethers.js/) or [web3.js](https://web3js.readthedocs.io/en/v1.5.2/) instance with everything you need to integrate with the blockchain.

<br>

## Getting Started

To get started with using our hooks, you just need to setup the `ThirdwebWeb3Provider` that provides all the context consumed by your app.

Setting up this context is as easy as wrapping your app with the following setup:

```javascript
import { ThirdwebWeb3Provider } from "@3rdweb/hooks";

const App = ({ children }) => {
  // Put the ethereum chain ids of the chains you want to support
  const supportedChainIds = [1, 4, 137];

  /**
   * Include the connectors you want to support
   * injected - MetaMask
   * magic - Magic Link
   * walletconnect - Wallet Connect
   * walletlink - Coinbase Wallet
   */
  const connectors = {
    injected: {},
    magic: {
      apiKey: "pk_...", // Your magic api key
      chainId: 1, // The chain ID you want to allow on magic
    },
    walletconnect: {},
    walletlink: {
      appName: "thirdweb - demo",
      url: "https://thirdweb.com",
      darkMode: false,
    },
  };

  /**
   * Make sure that your app is wrapped with these contexts.
   * If you're using Next JS, you'll have to replace children with the Component setup
   */
  return (
    <ThirdwebWeb3Provider 
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >
      {children}
    </ThirdwebWeb3Provider>
  );
};
```

### **Use Custom Hooks**

You can build your own connect wallet button with our `useWeb3` and `useSwitchNetwork` hooks.

You can see how these hooks are used in the following example.

```javascript
import React, { useState } from "react"
import { useWeb3, useSwitchNetwork } from "@3rdweb/hooks"

const supportedChainIds = [1, 4, 137];

const CustomConnect = () => {
  const { address, chainId, connectWallet, disconnectWallet, getNetworkMetadata } = useWeb3();
  const { switchNetwork } = useSwitchNetwork();
  const [email, setEmail] = useState("");

  return (
    <>
      Address: {address}
      <br />
      Chain ID: {chainId}
      <br />

      {address && (
        <button onClick={disconnectWallet}>
          Disconnect
        </button>
      )}

      <p>Switch Network</p>
      {supportChainIds.map((cId) => (
        <button onClick={() => switchNetwork(cId)}>
          {getNetworkMetadata(cId).chainName}
        </button>
      ))}

      <input value={email} onChange={e => setEmail(e.target.value)} />
      <button
        onClick={() => connectWallet("magic", {
          email
        })}
      >
        Connect Magic Link
      </button>

      <button onClick={() => connectWallet("injected")}>
        Connect MetaMask
      </button>
      <button onClick={() => connectWallet("walletconnect")}>
        Connect Wallet Connect
      </button>
      <button onClick={() => connectWallet("walletlink")}>
        Connect Coinbase Wallet
      </button>
    <>
  )
}
```

For a fully functional setup using our custom hooks, you can checkout our [NextJS example hooks page](https://github.com/nftlabs/ui/blob/main/examples/next/pages/hooks.tsx).

<br>

### **Access Web3 Setup**

After you setup wallet connection with the above method, accessing your connected web3 provider and its related info is as easy as the following:

```javascript
import React from "react";
import { useWeb3 } from "@3rdweb/react";

const Component = () => {
  // You can do whatever you want with this data
  const { address, chainId, provider } = useWeb3();

  return (
    <div>
      Address: {address}
      <br />
      Chain ID: {chainId}
    </div>
  );
};
```
