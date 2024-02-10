
export async function POST(req: Request) {
  let body = await req.json();
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
export const dynamic = "force-dynamic";