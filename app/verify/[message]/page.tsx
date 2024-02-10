'use client';
import { StarknetProvider } from "@/components/starknet-provider";
import ConnectWallet from "@/components/connect-wallet";
import { useState, useEffect, useRef } from 'react';

export default function VerifyPage({ params }: { params: { message: string } }) {
  console.log("___________________________");
  console.log("accessing page verify...");

  const messageBytesJson = JSON.stringify({ messageBytes: params.message });
  const [invalidVerification, setInvalidVerification] = useState(false);
  const [fid, setFid] = useState(0);
  const [username, setUsername] = useState("");
  const [fcTimestamp, setFCTimestamp] = useState(0);
  const fetchCalled = useRef(false);

  const fetchValidate = async () => {
    console.log("calling fetchValidate...");
    if (messageBytesJson) {
      try {
        await fetch("/api/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: messageBytesJson,
        })
          .then((res) => res.json())
          .then((res) => {
            console.log("data from api/validate:");
            console.log(res);
            if (res && res.fc_timestamp && res.fid) {
              setFid(res.fid);
              setUsername(res.username);
              setFCTimestamp(res.fc_timestamp);
            } else {
              setInvalidVerification(true);
            }
          });
      } catch (error) {
        console.error('Error:', error);
        setInvalidVerification(true);
      }
    } else {
      setInvalidVerification(true);
    }
  };
  useEffect(() => {
    if (!fetchCalled.current) {
      fetchValidate();
      fetchCalled.current = true; // Marca que la función se ha llamado
    }
  }, []);

  return (
    <div>
      {invalidVerification ? (
        <div>
          <h1>Invalid Verification</h1>
          <p>The verification link is invalid or has expired.</p>
        </div>
      ) : (
        <StarknetProvider>
          {fid && fcTimestamp ? (
            <ConnectWallet fid={fid} username={username} timestamp={fcTimestamp} />
          ) : (
            <p>Loading verification data...</p>
          )}
        </StarknetProvider>
      )}
    </div>
  );

}