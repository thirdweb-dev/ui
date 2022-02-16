import { defaultChains, defaultL2Chains } from "wagmi";

export const supportedChains = defaultChains
  .concat(defaultL2Chains)
  .filter((c) => SUPPORTED_CHAIN_IDS.includes(c.id));


export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  BSC = 56,
  xDai = 100,
  Polygon = 137,
  Moonriver = 1285,
  Mumbai = 80001,
  Harmony = 1666600000,
  Localhost = 1337,
  Hardhat = 31337,
  Fantom = 250,
  FantomTestnet = 4002,
  Avalanche = 43114,
  AvalancheFujiTestnet = 43113,
}

export const SUPPORTED_CHAIN_IDS = [
  ChainId.Mainnet,
  ChainId.Rinkeby,
  ChainId.Goerli,
  ChainId.Mumbai,
  ChainId.Polygon,
  ChainId.Fantom,
  ChainId.FantomTestnet,
  ChainId.Avalanche,
  ChainId.AvalancheFujiTestnet,
];

export const ChainIdToRPC: Partial<Record<ChainId, string>> = {
  [ChainId.Mainnet]: "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  [ChainId.Rinkeby]: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  [ChainId.Goerli]: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  [ChainId.Polygon]: "https://polygon-rpc.com",
  [ChainId.Fantom]: "https://rpc.ftm.tools",
  [ChainId.Avalanche]: "https://api.avax.network/ext/bc/C/rpc",
  [ChainId.Mumbai]: "https://rpc-mumbai.maticvigil.com",
};

export const ChainIdToNativeSymbol: Partial<Record<ChainId, string>> = {
  [ChainId.Mainnet]: "ETH",
  [ChainId.Rinkeby]: "ETH",
  [ChainId.Goerli]: "ETH",
  [ChainId.Polygon]: "MATIC",
  [ChainId.Fantom]: "FTM",
  [ChainId.Avalanche]: "AVAX",
  [ChainId.Mumbai]: "MATIC",
};

export const ChainIdToName: Partial<Record<ChainId, string>> = {
  [ChainId.Mainnet]: "Mainnet",
  [ChainId.Rinkeby]: "Rinkeby",
  [ChainId.Goerli]: "Goerli",
  [ChainId.Polygon]: "Polygon",
  [ChainId.Fantom]: "Fantom",
  [ChainId.Avalanche]: "Avalanche",
  [ChainId.Mumbai]: "Mumbai",
}