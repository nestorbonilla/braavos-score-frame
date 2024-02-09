"use client";
import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSignTypedData,
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
// import Profile from "@/components/profile";

interface StarknetProScoreResponse {
  score: number; // Asumiendo que la respuesta es algo así
  // Agrega más campos según lo que esperas recibir
}

type FarcasterData = {
  fid: number;
  timestamp: number;
};

function ConnectWallet({ fid, timestamp }: FarcasterData) {
  const [validSignature, setValidSignature] = useState(false);
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
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

  const addMapping = async (fid: number, starknetAddress: string) => {
    try {
      const response = await fetch("/api/addMapping", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fid, starknetAddress, score }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      return response.json();
    } catch (error) {
      console.error("Failed to add mapping:", error);
    }
  };

  const [score, setScore] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.starknet_braavos) {
      // console.log("Requesting Starknet Pro Score: ", window.starknet_braavos);
      (window.starknet_braavos.request as any)({ type: "wallet_getStarknetProScore" })
        .then((res: StarknetProScoreResponse) => {
          console.log(res.score);
          setScore(res.score);
        })
        .catch((error: Error) => {
          console.error("Error fetching Starknet Pro Score:", error);
          setScore(0);
        });
    }
  }, [address]);

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
      console.log("going to callVerifying signature...");
      console.log("address: ", address);
      console.log("data: ", data);
      verifySignature(address!, data);
    }
  }, [data]);

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
        <button
          onClick={connectWallet}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            backgroundColor: "black",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Connect to Starknet
        </button>
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
                if (timeValid(timestamp)) {
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
