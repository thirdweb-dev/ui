# Thirdweb React

<br>

## Introduction

Welcome to the Thirdweb Component Library. This package provides you with extensible components to handle the web3 side of your app.

We simplify the process of integrating web3 into your apps while making sure that you still have all the control you would using other lower level web3 frontend libraries.

Our main features are:

- Support for most commonly used web3 providers including: [MetaMask](https://metamask.io/), [WalletConnect](https://walletconnect.com/), [Coinbase Wallet](https://wallet.coinbase.com/), and [Magic Link](https://magic.link/).
- An app wide context containing an [ethers.js](https://github.com/ethers-io/ethers.js/) or [web3.js](https://web3js.readthedocs.io/en/v1.5.2/) instance with everything you need to integrate with the blockchain.
- Easy-to-use plug-and-play components that let you implement complex and fully-featured web3 app setups with only a few lines of code.

<br>

## Getting Started

To get started with the Thirdweb Component Library, you just need to setup the `ThirdwebWeb3Context` that provides all the context consumed by your app, and the `ThirdwebThemeProvider`, which lets you use our custom components.

Setting up this context is as easy as wrapping your app with the following setup:

```javascript
import { ThirdwebWeb3Provider, ThirdwebThemeProvider } from "@3rdweb/react";

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
    <ThirdwebWeb3Provider>
      <ThirdwebThemeProvider>{children}</ThirdwebThemeProvider>
    </ThirdwebWeb3Provider>
  );
};
```

<br>

## Connect Wallet & Web3 Setup

Currently, we provide you with components and hooks to easily integrate web3 into your app and setup an app wide context without having to deal with the complexity of lower level web3 configuration.

There are two main ways to implement wallet connection and web3 integration with the Thirdweb Component Library, both of which we will go over below:

1. You can use our fully configured `ConnectWallet` component to handle all web3 connection and integration, including wallet connection and network switching. This is the easiest way to use the Thirdweb Component Library.
2. If you want to make your own unique web3 connection setup, you can use our `useWeb3` and `useSwitchNetwork` hooks to make your own custom component.

### **Use Connect Wallet**

Using our `ConnectWallet` component is the easiest way to integrate web3 into your app, complete with network switching, wallet connection, and everything else you need. Adding our connect wallet button is as easy as the following:

```javascript
import React from "react";
import { ConnectWallet } from "@3rdweb/react";

const Connect = () => {
  return <ConnectWallet />;
};
```

You can place this button anywhere in your app and it will display a wallet connection that displays connected chain, wallet address, and balance information as well as a fully-featured connection manager modal.

For a fully functional setup using our `ConnectWallet` button, you can checkout our [NextJS example connect page](https://github.com/nftlabs/ui/blob/main/examples/next/pages/connect.tsx).

<br>

### **Use Custom Hooks**

If you want to create your own custom component instead of using ours, you can build it with our `useWeb3` and `useSwitchNetwork` hooks.

```javascript
import React, { useState } from "react"
import { useWeb3, useSwitchNetwork } from "@3rdweb/react"

const CustomConnect = () => {
  const { address, chainId, connectWallet, disconnectWallet } = useWeb3();
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

After you setup wallet connection with one of the above methods, accessing your connected web3 provider and its related info is as easy as the following:

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
