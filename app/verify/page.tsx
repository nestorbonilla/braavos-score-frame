'use client';
import { StarknetProvider } from "@/components/starknet-provider";
import ConnectWallet from "@/components/connect-wallet";
import { timeValid } from "@/utils";
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyNoParamPageComponent() {
  console.log("___________________________");
  console.log("accessing page verify...");

  const [searchParams] = useSearchParams();
  // console.log("getting searchParams...");
  // console.log(searchParams[1]);
  // const messageBytes = searchParams; // Suponiendo que el primer elemento es el parámetro que buscas
  let messageBytesJson = JSON.stringify({ messageBytes: searchParams[1] });
  // console.log(`messageBytesJson: ${messageBytesJson}`);

  const [invalidVerification, setInvalidVerification] = useState(false);
  const [fid, setFid] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    console.log("going to call api/validate");
    // console.log(`messageBytes: ${messageBytesJson}`);
    // let messageBytesJson = JSON.stringify({ messageBytes });
    // console.log(`messageBytesJson: ${messageBytesJson}`);
    if (messageBytesJson) {
      fetch("/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: messageBytesJson,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("data from api/validate:");
          console.log(data);
          if (data && data.timestamp && data.fid) {
            setTimestamp(data.timestamp);
            setFid(data.fid);
          } else {
            setInvalidVerification(true);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          setInvalidVerification(true);
        });
    } else {
      setInvalidVerification(true);
    }
  }, []); // Dependiendo del valor de messageBytes

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

export default function VerifyNoParamPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyNoParamPageComponent />
    </Suspense>
  );
}