import { NextRequest, NextResponse } from "next/server";
import { getFrameHtml } from "frames.js";
import axios from "axios";
import sharp from "sharp";

const bufferToBase64 = (buffer: Buffer): string => {
  return `data:image/png;base64,${buffer.toString('base64')}`;
};

export async function POST(req: NextRequest) {
  
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
    // console.log("should refresh image");
    // console.log("___________________________");
    let imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/images`;
    const response = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: 'arraybuffer', // Indica que esperas un buffer de datos
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      }
    });
    const pngBuffer: Buffer = await sharp(Buffer.from(response.data)).toFormat("png").toBuffer();
    const base64ImageString: string = bufferToBase64(pngBuffer);
    // let imageUrl = "https://brown-crowded-macaw-851.mypinata.cloud/ipfs/QmPCKukNRRynvEwSnuFPe5hyx2JDnWphtDGjQVf66LV88L/starknet_2.png";
    
    return new NextResponse(
      `<!DOCTYPE html><html><head>
        <title>This is frame 7</title>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${base64ImageString}" />
        <meta property="fc:frame:button:1" content="Refresh Leaderboard" />
        <meta property="fc:frame:button:1:action" content="post" />
        <meta property="fc:frame:button:2" content="Connects Braavos Wallet" />
        <meta property="fc:frame:button:2:action" content="post_redirect" />
        <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/redirect" />
        </head>
      </html>`
    );
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