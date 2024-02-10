import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<Response> {
  let searchParams = req.nextUrl.searchParams;
  // let id: any = searchParams.get("id");
  // let idAsNumber = parseInt(id);
  // let nextId = idAsNumber + 1;
  let imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/images`;

  return new NextResponse(`
    <!DOCTYPE html>
      <html>
        <head>
          <title>Braavos ProScore Leaderboard</title>
          <meta property="fc:frame" content="vNext" />
          <meta property="fc:frame:image" content="${imageUrl}" />
          <meta property="fc:frame:button:1" content="Next Page" />
          <meta property="fc:frame:post_url" content="${process.env.NEXT_PUBLIC_BASE_URL}/api/frame" />
        </head>
    </html>`);
}

export const dynamic = "force-dynamic";