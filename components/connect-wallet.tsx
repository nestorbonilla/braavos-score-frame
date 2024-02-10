"use client";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignTypedData,
  Connector,
} from "@starknet-react/core";
import { useStarknetkitConnectModal } from "starknetkit";
import {
  shortString,
  typedData,
  Contract,
  RpcProvider,
  Signature,
} from "starknet";
import { timeValid, getAbi } from "@/utils";

interface StarknetProScoreResponse {
  score: number;
}

type FarcasterData = {
  fid: number;
  username: string;
  timestamp: string;
};

function ConnectWallet({ fid, username, timestamp }: FarcasterData) {
  const [validSignature, setValidSignature] = useState(false);
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [score, setScore] = useState(0);
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    dappName: "Braavos Pro Score",
  });

  const message: typedData.TypedData = {
    domain: {
      name: "Braavos Pro Score",
      version: "1",
      chainId: shortString.encodeShortString("SN_MAINNET"),
    },
    types: {
      StarkNetDomain: [
        { name: "name", type: "felt" },
        { name: "version", type: "felt" },
        { name: "chainId", type: "felt" },
      ],
      Verification: [
        { name: "fid", type: "felt" },
        { name: "timestamp", type: "felt" },
      ],
    },
    message: {
      fid,
      timestamp,
    },
    primaryType: "Verification",
  };
  const { data, isPending, signTypedData } = useSignTypedData(message);

  const connectWallet = async () => {
    const { connector } = await starknetkitConnectModal();
    await connect({ connector });
  };

  const disconnectWallet = async () => {
    await disconnect();
  };

  const verifySignature = async (
    contractAddress: string,
    signature: Signature
  ) => {
    console.log("accessing verifySignature...");
    const provider = new RpcProvider({
      nodeUrl: process.env.NEXT_PUBLIC_NETHERMIND_MAINNET_URL,
    });

    try {
      const abi = await getAbi(provider, contractAddress);

      const contract = new Contract(abi, contractAddress, provider);
      const msgHash = typedData.getMessageHash(message, contractAddress);

      await contract.isValidSignature(msgHash, signature);
      setValidSignature(true);
      // Get the score of Braavos Wallet
      window.alert(
        `Successfully verified ownership of address: ${address}`
      );

      console.log("To store on db: ", fid, contractAddress, score);
      // Store the result in a database
      try {
        await fetch("/api/database", {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fid, username, sn_address: contractAddress, score, fc_timestamp: timestamp }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("data from api/database:");
            console.log(data);
          });
      } catch (error) {
        console.error("Failed to add mapping:", error);
      }
      // addMapping(fid, contractAddress, score)
      //   .then(() => {
      //     console.log("Mapping added");
      //     window.alert(
      //       `Successfully verified ownership of address: ${address}`
      //     );
      //   })
      //   .catch((err) => console.error("Error adding mapping:", err));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (data && address) {

      // then we try to verify the signature
      console.log("going to callVerifying signature...");
      console.log("address: ", address);
      console.log("data: ", data);
      verifySignature(address!, data);
    }
  }, [data]);

  useEffect(() => {
    console.log("accessing the useEffect() to get the score ");
    // if there's an address then we try to get the score
    if (typeof window !== 'undefined' && window.starknet_braavos) {
      // console.log("Requesting Starknet Pro Score: ", window.starknet_braavos);
      (window.starknet_braavos.request as any)({ type: "wallet_getStarknetProScore" })
        .then((res: StarknetProScoreResponse) => {
          console.log("finding score...", res.score);
          setScore(res.score);
        })
        .catch((error: Error) => {
          console.error("Error fetching Starknet Pro Score:", error);
          setScore(0);
        });
    }
  }, [address]);

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "300px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      {/* {address && <p style={{ marginBottom: "15px" }}>Address: {address}</p>} */}

      {!isConnected ? (
        connectors
          .filter((connector: Connector) => connector.name.toLowerCase().includes('braavos'))
          .map((connector: Connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              disabled={!connector.available()}
              style={{
                padding: "12px 24px",
                cursor: "pointer",
                backgroundColor: "#4CAF50", // Un verde brillante que sugiere acción
                color: "white",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Una sombra suave para dar profundidad
                fontSize: "16px", // Un tamaño de fuente más grande para mejorar la legibilidad
                fontWeight: "bold", // Fuente en negrita para destacar
                display: "flex", // Utiliza flex para alinear el icono y el texto
                alignItems: "center", // Alinea verticalmente el icono y el texto
                justifyContent: "center", // Centra el contenido del botón
                transition: "background-color 0.3s", // Suaviza el cambio de color al hacer hover
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#45a049"} // Oscurece el botón al hacer hover para sugerir interactividad
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"} // Restaura el color original al quitar el hover
            >
              <img src={connector.icon.dark} alt={`Connect ${connector.name}`} style={{ marginRight: "8px", width: "20px", height: "20px" }} />
              Connect {connector.name}
            </button>
          ))
      ) : (
        <div>
          {validSignature ? (
            // <Profile />
            <div>Firma validada</div>
          ) : (
            <button
              onClick={() => {
                // console.log("button pressed");
                // console.log("timeValid: ", timeValid(timestamp));
                console.log("timestamp: ", timestamp);
                if (timeValid(new Date(timestamp).getTime())) {
                  console.log("timestamp is valid! ");
                  signTypedData();
                }
              }}
              disabled={!address}
              style={{
                padding: "10px 15px",
                cursor: "pointer",
                backgroundColor: "black",
                color: "white",
                border: "none",
                borderRadius: "5px",
                marginBottom: "10px",
              }}
            >
              {isPending ? "Waiting for wallet..." : "Verify address ownership"}
            </button>
          )}
          <br />
          <button
            onClick={disconnectWallet}
            style={{
              padding: "10px 15px",
              cursor: "pointer",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Disconnect wallet
          </button>
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;
