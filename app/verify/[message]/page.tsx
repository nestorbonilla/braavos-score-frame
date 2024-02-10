'use client';
import { StarknetProvider } from "@/components/starknet-provider";
import ConnectWallet from "@/components/connect-wallet";
import { useState, useEffect } from 'react';

export default function VerifyPage({ params }: { params: { message: string } }) {
  console.log("___________________________");
  console.log("accessing page verify...");

  const messageBytesJson = JSON.stringify({ messageBytes: params.message });
  const [invalidVerification, setInvalidVerification] = useState(false);
  const [fid, setFid] = useState(0);
  const [timestamp, setTimestamp] = useState(0);

  // useEffect(() => {
  //   const fetchValidate = async () => {
  //     console.log("calling fetchValidate...");
  //     if (messageBytesJson) {
  //       try {
  //         const response = await fetch("/api/validate", {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: messageBytesJson,
  //         });

  //         const data = await response.json();

  //         console.log("data from api/validate:");
  //         console.log(data);

  //         if (data && data.fc_timestamp && data.fid) {
  //           setTimestamp(data.fc_timestamp);
  //           setFid(data.fid);
  //         } else {
  //           setInvalidVerification(true);
  //         }
  //       } catch (error) {
  //         console.error('Error:', error);
  //         setInvalidVerification(true);
  //       }
  //     } else {
  //       setInvalidVerification(true);
  //     }
  //   };
  //   fetchValidate();
  // }, []);

  return (
    <div>
      {invalidVerification ? (
        <div>
          <h1>Invalid Verification</h1>
          <p>The verification link is invalid or has expired.</p>
        </div>
      ) : (
        <StarknetProvider>
          {fid && timestamp ? (
            <ConnectWallet fid={fid} timestamp={timestamp} />
          ) : (
            <p>Loading verification data...</p>
          )}
        </StarknetProvider>
      )}
    </div>
  );

}