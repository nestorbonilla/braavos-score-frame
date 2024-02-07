
// import Head from "next/head";

// export default function Home() {
//   return (
//     <>
//       <Head>
//         <meta property="og:title" content="Frame" />
//         <meta property="og:image" content={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/QmPCKukNRRynvEwSnuFPe5hyx2JDnWphtDGjQVf66LV88L/starknet_1.png`} />
//         <meta property="fc:frame" content="vNext" />
//         <meta property="fc:frame:image" content={`${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/QmPCKukNRRynvEwSnuFPe5hyx2JDnWphtDGjQVf66LV88L/starknet_2.png`} />
//         <meta property="fc:frame:button:1" content="Connect Starknet Wallet" />
//         <meta property="fc:frame:button:1:action" content="post_redirect" />
//         <meta
//           property="fc:frame:post_url"
//           content={`${process.env.NEXT_PUBLIC_BASE_URL}/api/redirect`}
//         />
//       </Head>
//     </>
//   );
// }


import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

let frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Connect Braavos Wallet",
      action: "link",
      target: "https://instagram.com/0xnestor/",
    }
  ],
  image: `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/QmPCKukNRRynvEwSnuFPe5hyx2JDnWphtDGjQVf66LV88L/starknet_1.png`,
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

export default function Page() {
  return (
    <>
      <h1>Braavos ProScore Leaderboard</h1>
    </>
  );
}