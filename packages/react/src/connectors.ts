import { InjectedConnector } from "@web3-react/injected-connector";
import { MagicConnector } from "@web3-react/magic-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export type Connector = 
  | "injected"
  | "magic"
  | "walletlink"
  | "walletconnect"


const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.RPC_URL_1 as string,
  4: process.env.RPC_URL_4 as string
}

export const injectedConnector = new InjectedConnector({ supportedChainIds: [
  1, // Ethereum Mainnet
  4, // Rinkeby Testnet
  137, // Polygon Mainnet
  250, // Fantom Opera
  43114, // Avalanche Mainnet
  80001, // Mumbai Testnet 
]})

export const createMagicConnector = (email: string) => {
  return new MagicConnector({
    apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY as string,
    chainId: 4, // Mumbai Testnet
    email: email
  })
}

export const walletConnectConnector = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true
})

export const walletLinkConnector = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: 'Thirdweb Wallet',
  supportedChainIds: [1, 3, 4, 5, 42, 10, 137, 69, 420, 80001]
})