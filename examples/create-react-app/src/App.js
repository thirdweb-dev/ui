import { ThirdwebProvider, ConnectWallet } from '@3rdweb/react';
import './App.css';

const supportedChainIds = [1, 4, 137, 250, 43114, 80001];
const connectors = {
  injected: {},
  magic: {
    apiKey: "pk_live_712C1E6230EA31BC",
    chainId: 1,
  },
  walletconnect: {},
  walletlink: {
    appName: "thirdweb - demo",
    url: "https://thirdweb.com",
    darkMode: false,
  },
};

function ExampleApp() {
  return (
    <ThirdwebProvider
      connectors={connectors}
      supportedChainIds={supportedChainIds}
    >
      <ConnectWallet />
    </ThirdwebProvider>
  );
}

export default ExampleApp;
