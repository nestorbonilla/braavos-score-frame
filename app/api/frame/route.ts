import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<Response> {
  let searchParams = req.nextUrl.searchParams;
  let id: any = searchParams.get("id");
  let idAsNumber = parseInt(id);
  let nextId = idAsNumber + 1;

  return new NextResponse(`
    <!DOCTYPE html>
      <html>
        <head>
          <title>Braavos ProScore Leaderboard</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/QmPCKukNRRynvEwSnuFPe5hyx2JDnWphtDGjQVf66LV88L/starknet_1.png" />
          <meta property="fc:frame:button:1" content="Next Page" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame?id=2" />
        </head>
    </html>`);
}

export const dynamic = "force-dynamic";