'use client';
import { StarknetProvider } from "@/components/starknet-provider";
import ConnectWallet from "@/components/connect-wallet";
import { timeValid } from "@/utils";
import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyNoParamPageComponent() {
  console.log("___________________________");
  console.log("accessing page verify...");

  console.log("before useSearchParams...");
  const [searchParams] = useSearchParams();
  console.log("after useSearchParams...");
  const messageBytesJson = JSON.stringify({ messageBytes: searchParams[1] });
  const [invalidVerification, setInvalidVerification] = useState(false);
  const [fid, setFid] = useState(0);
  const [timestamp, setTimestamp] = useState(0);

  const fetchValidate = async () => {
    console.log("calling fetchValidate...");
    if (messageBytesJson) {
      try {
        const response = await fetch("/api/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: messageBytesJson,
        });

        const data = await response.json();

        console.log("data from api/validate:");
        console.log(data);

        if (data && data.fc_timestamp && data.fid) {
          setTimestamp(data.fc_timestamp);
          setFid(data.fid);
        } else {
          setInvalidVerification(true);
        }
      } catch (error) {
        console.error('Error:', error);
        setInvalidVerification(true);
      }
    } else {
      setInvalidVerification(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/validate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: messageBytesJson,
        });
        const data = await response.json();
        // Procesar los datos aquí
        console.log(data);
      } catch (error) {
        console.error("Hubo un error con la petición fetch:", error);
      }
    };

    fetchData();
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