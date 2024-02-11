import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/generateImage";
import sharp from "sharp";
import axios from "axios";

function formatTimestampToUS(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);
  console.log("___________________________");
  console.log("accessing api/images...");

  // Get raw scores from the database
  let response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/database`, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    }
  });

  // Process the scores and its timestamps
  const scores = response.data.data.map((score: { username: string, score: number, fc_timestamp: string }) => ({
    ...score,
    fc_timestamp: formatTimestampToUS(score.fc_timestamp),
  }));

  // Generate the image and convert it to PNG
  let svg = await generateImage(scores);
  let pngBuffer = await sharp(Buffer.from(svg))
    .toFormat("png")
    .toBuffer();

  return new NextResponse(pngBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "max-age=1",
    },
  });
}
