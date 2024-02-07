import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

let frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Connect Braavos Wallet",
    }
  ],
  image: `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/QmPCKukNRRynvEwSnuFPe5hyx2JDnWphtDGjQVf66LV88L/starknet_1.png`,
  post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame?id=1`,
});

export const metadata: Metadata = {
  title: 'Braavos ProScore Leaderboard',
  description: 'Leaderboard for Braavos ProScore',
  openGraph: {
    title: 'Braavos ProScore Leaderboard',
    description: 'Leaderboard for Braavos ProScore',
    type: 'website',
    images: `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/QmPCKukNRRynvEwSnuFPe5hyx2JDnWphtDGjQVf66LV88L/starknet_1.png`,
  },
  other: {
    ...frameMetadata,
  },
};