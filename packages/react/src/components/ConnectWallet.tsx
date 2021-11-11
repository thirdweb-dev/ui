import React, { useState } from "react";
import { 
  Input,
  Flex,
  Text,
  Button, 
  useDisclosure,
  Modal,
  ModalContent,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalHeader
} from "@chakra-ui/react";
import { useWeb3 } from "../hooks";
import { ConnectorType } from "..";

export const ConnectWallet: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
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
      <Button onClick={onOpen}>
        {address ? "Info" : "Connect Wallet"}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent alignItems="center">
          <ModalCloseButton />
          <ModalHeader>
            Connect Wallet
          </ModalHeader>
          <ModalBody>
            {address ? (
              <Flex direction="column" alignItems="center">
                <Text>{address}</Text>
                <Button mt="16px" onClick={disconnectWallet}>Deactivate</Button>
              </Flex>
            ) : (
              <Flex direction="column" alignItems="center">
                {connectors.map((connectorType: ConnectorType, index) => {
                  if (connectorType === "magic") {
                    return (
                      <Flex marginY="8px" key={index}>
                        <Input
                          placeholder="Magic Email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          borderRadius="8px 0px 0px 8px"
                        />
                        <Button 
                          onClick={() => activateConnector("magic", { email })}
                          borderRadius="0px 8px 8px 0px"
                          minWidth="160px"
                        >
                          Connect Magic
                        </Button>
                      </Flex>
                    )
                  } else {
                    return (
                      <Button
                        key={index}
                        onClick={() => activateConnector(connectorType)}
                        marginY="8px"
                      >
                        Connect&nbsp;
                        {connectorType === "walletconnect" ?
                          "Wallet Connect" 
                        : connectorType === "walletlink" ?
                          "Coinbase Wallet"
                        : connectorType === "injected" ?
                          "Metamask" 
                        : ""}
                      </Button>
                    )
                  }
                })}
              </Flex>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};