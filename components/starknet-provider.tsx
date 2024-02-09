"use client";
import React from "react";

import { mainnet, goerli } from "@starknet-react/chains";
import {
  StarknetConfig,
  nethermindProvider,
  braavos,
  useInjectedConnectors,
  voyager,
} from "@starknet-react/core";

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const { connectors } = useInjectedConnectors({
    // Show these connectors if the user has no connector installed.
    recommended: [braavos()],
    // Hide recommended connectors if the user has any connector installed.
    includeRecommended: "always",
    // Randomize the order of the connectors.
    order: "random",
  });

  return (
    <StarknetConfig
      chains={[mainnet]}
      provider={nethermindProvider({
        apiKey: process.env.NEXT_PUBLIC_NETHERMIND_API_KEY!,
      })}
      connectors={connectors}
      explorer={voyager}
    >
      {children}
    </StarknetConfig>
  );
}
