import { Connector } from "@3rdweb/connectors";
import { useQuery } from "react-query";
import { useThirdwebContext } from "../..";

export function useConnectorSigner(connector?: Connector) {
  return useQuery(["activeSigner"], async () => await connector?.getSigner(), {
    enabled: !!connector?.getSigner,
  });
}

export function useConnector() {
  const {
    state: { connector },
  } = useThirdwebContext();
  return useConnectorSigner(connector);
}
