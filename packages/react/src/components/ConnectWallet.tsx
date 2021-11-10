import React, { useState } from "react";
import { useThirdweb } from "../hooks";
import styled from "styled-components";

const Button = styled.button`
  height: 50px;
  background: #111111;
  color: white;
  padding: 0px 20px;
  border-radius: 8px;
  outline: none !important;
  border: none !important;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.85;
  }
`

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
  const { account, activateInjected, deactivate } = useThirdweb();

  return (
    <>
      <Button onClick={() => setModal(true)}>
        {account ? "Info" : "Connect Wallet"}
      </Button>
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
                <Button onClick={deactivate}>
                  Deactivate
                </Button>
                <p>Connected Account: {account}</p>
              </>
            ) : (
              <Button onClick={activateInjected}>
                Connect Metamask
              </Button>
            )}
          </Modal>
        </ModalOverlay>
      )}
    </>
  );
};
