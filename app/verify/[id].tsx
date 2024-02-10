'use client';
import { StarknetProvider } from "@/components/starknet-provider";
import ConnectWallet from "@/components/connect-wallet";
import { useRouter } from "next/router";
import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyPageComponent() {
  console.log("___________________________");
  console.log("accessing page verify...");

  const router = useRouter();
  const { id } = router.query; // Aquí obtienes el parámetro 'id' de la URL.

  return (
    <div>
      <h1>Verificación</h1>
      <p>ID de verificación: {id}</p> {/* Aquí utilizas el parámetro 'id'. */}
    </div>
  );

}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPageComponent />
    </Suspense>
  );
}