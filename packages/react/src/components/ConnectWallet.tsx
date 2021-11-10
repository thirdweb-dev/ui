import React, { useState } from "react";
import { useThirdweb } from "../hooks";
import styled from "styled-components";
import { Connector } from "../connectors";

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
    account, 
    connectors,
    activate,
    deactivate 
  } = useThirdweb();

  function activateConnector(connector: Connector, options?: any) {
    if (activate) {
      if (options) {
        activate(connector, options);
      } else {
        activate(connector);
      }
    }
  }

  return (
    <>
      <button onClick={() => setModal(true)}>
        {account ? "Info" : "Connect Wallet"}
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

            {account ? (
              <>
                <button onClick={deactivate}>
                  Deactivate
                </button>
                <p>Connected Account: {account}</p>
              </>
            ) : (
              <>
                {connectors.map((connector: Connector) => {
                  if (connector === "magic") {
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
                        onClick={() => activateConnector(connector)}
                        style={{ marginTop: "8px", marginBottom: "8px" }}
                      >
                        Connect&nbsp;
                        {connector === "walletconnect" ?
                          "Wallet Connect" 
                        : connector === "walletlink" ?
                          "Coinbase Wallet"
                        : connector === "injected" ?
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