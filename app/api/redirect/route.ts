
import { getFrameMetadata } from '@coinbase/onchainkit';

export async function POST(req: Request) {
  let body = await req.json();
  console.log("accessing api/redirect post...");
  const signedMessage = body as {
    untrustedData: {
      fid: number;
      url: string;
      messageHash: string;
      timestamp: number;
      network: number;
      buttonIndex: number;
      castId: { fid: number; hash: string };
    };
    trustedData?: {
      messageBytes: string;
    };
  };
  if (signedMessage.untrustedData.buttonIndex == 1) {
    // Refresh image
    console.log("should refresh image");
    let imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/images`;
    
    return new Response(
      `
      <!DOCTYPE html>
      <html>
          <head>
              <title>Create your Story</title>
              <meta property="og:title" content="Create your Story" />
              <meta property="og:image" content="${imageUrl}" />
              <meta name="fc:frame" content="vNext">
              <meta name="fc:frame:image" content="${imageUrl}">
              <meta name="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/redirect">
              <meta name="fc:frame:button:1" content="Refresh Leaderboard">
              <meta name="fc:frame:button:1:action" content="post">
              <meta name="fc:frame:button:2" content="Connects Braavos Wallet">
              <meta name="fc:frame:button:2:action" content="post_redirect">
          </head>
      <body>
      <p> Something here </p>
      </body>
      </html>
  `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
        status: 200,
      }
    );
    // return new Response('Good Request', { status: 200 });
    
  }
  if (signedMessage.untrustedData.buttonIndex == 2) {
    console.log("should go to sign page");
    const messageBytes = signedMessage?.trustedData?.messageBytes;
    if (messageBytes) {
      const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify/${encodeURIComponent(messageBytes)}`;
      return new Response(null, {
        status: 302,
        headers: {
          Location: redirectUrl,
        },
      });
    } else {
      return new Response('Bad Request', { status: 400 });
    }
  }
}
export const dynamic = "force-dynamic";