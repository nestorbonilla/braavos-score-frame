import { NextRequest } from "next/server";
import { ImageResponse } from "next/og";
import { join } from "path";
import * as fs from "fs";

export const dynamic = "force-dynamic";

const interRegPath = join(process.cwd(), "public/Inter-Regular.ttf");
let interReg = fs.readFileSync(interRegPath);

const interBoldPath = join(process.cwd(), "public/Inter-Bold.ttf");
let interBold = fs.readFileSync(interBoldPath);

const sideImage = `${process.env.NEXT_PUBLIC_BASE_URL}/braavos_logo.png`;

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const message = searchParams.get("message") ?? "";
  let scores = [{
    user: "@0xNestor",
    score: "30",
    lastUpdate: "2024-02-10"
  }, {
    user: "@User2",
    score: "88",
    lastUpdate: "2024-02-12"
  }];
  let table = createScoresTable(scores);
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex", // Use flex layout
          flexDirection: "row", // Align items horizontally
          alignItems: "stretch", // Stretch items to fill the container height
          width: "100%",
          height: "100vh", // Full viewport height
          background: "linear-gradient(to right, #1b4abe, #031846)"
        }}
      >
        <img
          style={
            {
              height: "100%", // Make image full height
              objectFit: "cover", // Cover the area without losing aspect ratio
              width: "35%", // Image takes up 40% of the container's width
            }
          }
          // src="https://imagedelivery.net/BXluQx4ige9GuW0Ia56BHw/2639523a-690b-47af-16ab-ca07697fd000/original"
          src={sideImage}
        />
        <div
          style={
            {
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingLeft: 24,
              paddingRight: 24,
              lineHeight: 1.2,
              fontSize: 36,
              color: "black",
              flex: 1,
              overflow: "hidden",
              marginTop: 24,
            }
          }
        >
          {table}

        </div>
      </div>
    ),
    {
      width: 1528,
      height: 800,
      fonts: [
        {
          name: "Inter",
          data: interReg,
          weight: 400,
          style: "normal",
        },
        {
          name: "Inter",
          data: interBold,
          weight: 800,
          style: "normal",
        },
      ],
    }
  );
}

function createScoresTable(scores: any) {
  return (
    <div
      style={
        {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          paddingLeft: 24,
          paddingRight: 24,
          lineHeight: 1.2,
          fontSize: 36,
          color: "black",
          flex: 1,
          overflow: "hidden",
          marginTop: 24,
        }
      }
    >
      <div style={{ marginTop: 80, color: "white", display: "flex", width: "100%", justifyContent: "space-between", borderBottom: "2px solid white", paddingBottom: "10px", marginBottom: "10px" }}>
        <div style={{ width: "30%" }}>User</div>
        <div style={{ width: "30%" }}>Score</div>
        <div style={{ width: "30%" }}>Last Update</div>
      </div>
      {scores.map(function (score: any, index: any, array: any) {
        return (
          <div key={index} style={{ color: "white", display: "flex", width: "100%", justifyContent: "space-between", marginBottom: "5px" }}>
            <div style={{ width: "30%" }}>{score.user}</div>
            <div style={{ width: "30%" }}>{score.score}</div>
            <div style={{ width: "30%" }}>{score.lastUpdate}</div>
          </div>
        )
      })}
    </div>
  );
}