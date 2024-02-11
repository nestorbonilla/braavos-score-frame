import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';

let imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/images`;

let frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Refresh Leaderboard",
      target: "post",
    },
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div>
              <h1 className="text-2xl mdx:text-3xl lg:text-4xl font-bold leading-tight text-white dark:text-gray-200">Braavos Pro Score: Top Players</h1>
              <p className="mt-4 text-md md:text-lg lg:text-xl text-gray-300 dark:text-gray-400 leading-normal py-2 px-4 dark:bg-gray-800 rounded-lg">
                Welcome, Braavos Pro!
              </p>
              <p className="mt-4 text-md md:text-lg lg:text-xl text-gray-300 dark:text-gray-400 leading-normal py-2 px-4 dark:bg-gray-800 rounded-lg">
                Join the elite of Braavos wallet users in our daily leaderboard challenge! Connect, verify, and play to see your name among the top 10. Are you ready to claim your spot?
              </p>
              <p className="mt-4 text-md md:text-lg lg:text-sm text-gray-300 dark:text-gray-400 leading-normal py-2 px-4 dark:bg-gray-800 rounded-lg">
                * Heads up! This app is exclusively for Braavos wallets on Starknet Mainnet. Update your score every 24 hours directly through our Farcaster frame.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}