import { InjectedConnector } from "@web3-react/injected-connector";
import { MagicConnector } from "@web3-react/magic-connector";
import { WalletLinkConnector } from "@web3-react/walletlink-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export type Connector = 
  | "injected"
  | "magic"
  | "walletlink"
  | "walletconnect"

export const injected = new InjectedConnector({ supportedChainIds: [
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