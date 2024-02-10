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
        { name: "username", type: "felt" },
        { name: "address", type: "felt" },
        { name: "score", type: "felt" },
        { name: "timestamp", type: "felt" },
      ],
    },
    message: {
      fid,
      username,
      address,
      score,
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
      // window.alert(
      //   `Successfully verified ownership of address: ${address}`
      // );

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
              type="button"
              key={connector.id}
              onClick={() => connect({ connector })}
              disabled={!connector.available()}
              className="inline-flex items-center gap-x-2 rounded-md bg-[#031846] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
                if (timeValid(new Date(timestamp).getTime())) {
                  console.log("timestamp is valid! ");
                  signTypedData();
                }
              }}
              disabled={!address}
              className="inline-flex items-center gap-x-2 rounded-md bg-green-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              {isPending ? "Waiting for wallet..." : "Verify address ownership"}
            </button>
          )}
          <br />
          <button
            onClick={disconnectWallet}
            className="inline-flex items-center gap-x-2 rounded-md bg-[#031846] px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
}

export default ConnectWallet;
