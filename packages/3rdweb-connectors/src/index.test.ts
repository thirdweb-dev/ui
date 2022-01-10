import * as Exports from "./";

it("should expose correct exports", () => {
  expect(Object.keys(Exports)).toMatchInlineSnapshot(`
    [
      "Connector",
      "InjectedConnector",
      "WalletConnectConnector",
      "WalletLinkConnector",
      "chain",
      "defaultChains",
      "defaultL2Chains",
      "developmentChains",
      "units",
      "AddChainError",
      "ChainNotConfiguredError",
      "ConnectorNotFoundError",
      "SwitchChainError",
      "UserRejectedRequestError",
      "normalizeChainId",
    ]
  `);
});
