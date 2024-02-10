'use client';
import { StarknetProvider } from "@/components/starknet-provider";
import ConnectWallet from "@/components/connect-wallet";
import { useState, useEffect, useRef } from 'react';

export default function VerifyPage({ params }: { params: { message: string } }) {

  let messageBytesJson = JSON.stringify({ messageBytes: params.message });
  let [invalidVerification, setInvalidVerification] = useState(false);
  let [fid, setFid] = useState(0);
  let [username, setUsername] = useState("");
  let [fcTimestamp, setFCTimestamp] = useState("");
  let [scores, setScores] = useState([]);
  let fetchCalled = useRef(false);

  let fetchValidate = async () => {
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
        setInvalidVerification(true);
      }
    } else {
      setInvalidVerification(true);
    }
  };

  let fetchScores = async () => {
    setScores(await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/database`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then((res) => res.json())
      .then((res) => {
        return res.data.map((score: { username: string, score: number, fc_timestamp: string }) => ({
          ...score,
          fc_timestamp: formatTimestampToUS(score.fc_timestamp),
        }));
      }));
  }

  useEffect(() => {
    fetchScores();
    if (!fetchCalled.current) {
      fetchValidate();
      fetchCalled.current = true;
    }
  }, []);

  function formatTimestampToUS(timestamp: string): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div>
              <h1 className="text-2xl mdx:text-3xl lg:text-4xl font-bold leading-tight text-white dark:text-gray-200">Braavos Pro Score: Top Players</h1>
              <p className="mt-4 text-md md:text-lg lg:text-xl text-gray-300 dark:text-gray-400 leading-normal py-2 px-4 dark:bg-gray-800 rounded-lg shadow">
                {username ? `Welcome, ${username}!` : "Welcome, Braavos Pro!"}
              </p>
              <p className="mt-4 text-md md:text-lg lg:text-xl text-gray-300 dark:text-gray-400 leading-normal py-2 px-4 dark:bg-gray-800 rounded-lg shadow">
                Join the elite of Braavos wallet users in our daily leaderboard challenge! Connect, verify, and play to see your name among the top 10. Are you ready to claim your spot?
              </p>
            </div>

            {/* Conditional rendering block remains unchanged */}
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
                  <p className="mt-4 text-md md:text-lg lg:text-xl text-gray-300 dark:text-gray-400 leading-normal py-2 px-4 dark:bg-gray-800 rounded-lg shadow">Loading verification data...</p>
                )}
              </StarknetProvider>
            )}

            {/* Table block */}
            <div className="mt-8">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Username</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Score</th>
                        <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">FC Timestamp</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {scores.map((score: { username: string, score: number, fc_timestamp: string }) => (
                        <tr key={score.username}>
                          <td className="py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{score.username}</td>
                          <td className="px-3 py-4 text-sm text-gray-500">{score.score}</td>
                          <td className="px-3 py-4 text-sm text-gray-500">{new Date(score.fc_timestamp).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}