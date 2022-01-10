import { InjectedConnector } from "@3rdweb/connectors";
import { ThirdwebProvider } from "@3rdweb/hooks";
import type { AppProps } from "next/app";

const rpcUrlMap = {
  mainnet: `wss://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  rinkeby: `wss://eth-rinkeby.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  fantom: "https://rpc.ftm.tools",
  avalanche: "https://api.avax.network/ext/bc/C/rpc",
  polygon: `wss://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  mumbai: `wss://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      rpcUrlMap={rpcUrlMap}
      desiredNetwork="polygon"
      connectors={[new InjectedConnector()]}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
