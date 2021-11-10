import { InjectedConnector } from "@web3-react/injected-connector";

export const injected = new InjectedConnector({ supportedChainIds: [
  1, // Ethereum Mainnet
  4, // Rinkeby Testnet
  137, // Polygon Mainnet
  250, // Fantom Opera
  43114, // Avalanche Mainnet
  80001, // Mumbai Testnet 
]})