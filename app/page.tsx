import { getFrameMetadata } from '@coinbase/onchainkit';
import type { Metadata } from 'next';
import { getFrameMessage } from "frames.js";
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  NextServerPageProps,
  getPreviousFrame,
} from "frames.js/next/server";

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
  // post_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/frame`,
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