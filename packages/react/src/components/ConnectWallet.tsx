import React, { useState } from "react";
// import { Button } from "@chakra-ui/react";
import { useWeb3 } from "../hooks";
import styled from "styled-components";
import { ConnectorType } from "..";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`

const Modal = styled.div`
  padding: 20px !important;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: black;
  background: white;
  border-radius: 8px;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1);
  position: absolute;
`

export const ConnectWallet: React.FC = () => {
  const [modal, setModal] = useState(false);
  const [email, setEmail] = useState<string>("");
  const { 
    address, 
    connectWallet,
    disconnectWallet,
    connectors
  } = useWeb3();

  function activateConnector(connector: any, options?: any) {
    if (options) {
      connectWallet(connector, options);
    } else {
      connectWallet(connector);
    }
  }

  return (
    <>
      <button onClick={() => setModal(true)}>
        {address ? "Info" : "Connect Wallet"}
      </button>
      {modal && (
        <ModalOverlay>
          <Modal>
            <p 
              onClick={() => setModal(false)}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                color: "black",
                cursor: "pointer"
              }}
            >
              &times;
            </p>

            Wallet Connection

            {address ? (
              <>
                <button onClick={disconnectWallet}>
                  Deactivate
                </button>
                <p>Connected Account: {address}</p>
              </>
            ) : (
              <>
                {connectors.map((connectorType: ConnectorType) => {
                  if (connectorType === "magic") {
                    return (
                      <div style={{ marginTop: "8px", marginBottom: "8px" }}>
                        <input
                          placeholder="Magic Email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                        />
                        <button onClick={() => activateConnector("magic", { email })}>
                          Connect Magic
                        </button>
                      </div>
                    )
                  } else {
                    return (
                      <button 
                        onClick={() => activateConnector(connectorType)}
                        style={{ marginTop: "8px", marginBottom: "8px" }}
                      >
                        Connect&nbsp;
                        {connectorType === "walletconnect" ?
                          "Wallet Connect" 
                        : connectorType === "walletlink" ?
                          "Coinbase Wallet"
                        : connectorType === "injected" ?
                          "Metamask" 
                        : ""}
                      </button>
                    )
                  }
                })}
              </>
            )}
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};