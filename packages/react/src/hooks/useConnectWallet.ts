import { useWeb3React } from "@web3-react/core";
import { useCallback } from "react";
import invariant from "tiny-invariant";
import {
  ConnectorOptions,
  ConnectorType,
  useThirdwebContext,
} from "../components/Provider";

export type ConnectorActivateOptions = {
  /**
   * basically metamask
   */
  injected: undefined;
  /**
   * magic.link
   */
  magic: { email: string };
  /**
   * most mobile wallets
   */
  walletconnect: undefined;
  /**
   * coinbase wallet
   */
  walletlink: undefined;
};

export function useConnectWallet() {
  const { activate } = useWeb3React();
  const { connectors } = useThirdwebContext();

  return useCallback(
    async <TConnectorType extends ConnectorType>(
      connectorType: TConnectorType,
      connectOptions?: ConnectorActivateOptions[TConnectorType],
    ) => {
      invariant(
        connectors[connectorType],
        `Invalid connect() call for connector: ${connectorType}. It is not defined in on the <ThirdwebContext>.`,
      );

      switch (connectorType) {
        case "injected": {
          const { InjectedConnector } = await import(
            "@web3-react/injected-connector"
          );
          const connectorOptions = connectors[
            connectorType
          ] as ConnectorOptions["injected"];
          return await activate(new InjectedConnector(connectorOptions));
        }
        case "magic": {
          const { MagicConnector } = await import(
            "@web3-react/magic-connector"
          );
          const { email } = connectOptions as ConnectorActivateOptions["magic"];
          const connectorOptions = connectors[
            connectorType
          ] as ConnectorOptions["magic"];
          return await activate(
            new MagicConnector({ ...connectorOptions, email }),
          );
        }
        case "walletlink": {
          const { WalletLinkConnector } = await import(
            "@web3-react/walletlink-connector"
          );
          const connectorOptions = connectors[
            connectorType
          ] as ConnectorOptions["walletlink"];
          return await activate(new WalletLinkConnector(connectorOptions));
        }
        case "walletconnect": {
          const { WalletConnectConnector } = await import(
            "@web3-react/walletconnect-connector"
          );
          const connectorOptions = connectors[
            connectorType
          ] as ConnectorOptions["walletlink"];
          return await activate(new WalletConnectConnector(connectorOptions));
        }
        default:
          throw new Error("unsupported connector" + connectorType);
      }
    },
    [connectors, activate],
  );
}
