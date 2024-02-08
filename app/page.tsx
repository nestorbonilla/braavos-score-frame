import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

let imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/images?date=${Date.now()}`;
// let imageUrl = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/QmPCKukNRRynvEwSnuFPe5hyx2JDnWphtDGjQVf66LV88L/starknet_1.png`;

let frameMetadata = getFrameMetadata({
  buttons: [
    {

      label: "Connects Braavos Wallet",
      action: "post_redirect",
    }
  ],
  image: imageUrl,
  post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/redirect`,
});

export const metadata: Metadata = {
  title: 'Braavos ProScore Leaderboard',
  description: 'Leaderboard for Braavos ProScore',
  openGraph: {
    title: 'Braavos ProScore Leaderboard',
    description: 'Leaderboard for Braavos ProScore',
    images: imageUrl,
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Braavos ProScore Leaderboard</h1>
    </>
  );
}