import { join } from "path";
import satori from "satori";
import fs from "fs";

type Score = {
  id: number;
  fid: number;
  sn_address: string;
  score: number;
  open: boolean;
  created_at: string;
  username: string;
  fc_timestamp: string;
};

export const generateImage = async (scores: Score[]) => {

  // console.log("receiving scores in generateImage: ", scores);
  let interRegPath = join(process.cwd(), "public/Inter-Regular.ttf");
  let interReg = fs.readFileSync(interRegPath);

  let interBoldPath = join(process.cwd(), "public/Inter-Bold.ttf");
  let interBold = fs.readFileSync(interBoldPath);

  let sideImage = `${process.env.NEXT_PUBLIC_BASE_URL}/braavos_logo.png`;
  return await satori(
    <div
      style={{
        display: "flex", // Use flex layout
        flexDirection: "row", // Align items horizontally
        alignItems: "stretch", // Stretch items to fill the container height
        width: "100%",
        height: "100vh", // Full viewport height
        background: "#242424"
      }}
    >
      <img
        alt="Braavos logo"
        style={
          {
            height: "100%", // Make image full height
            objectFit: "cover", // Cover the area without losing aspect ratio
            width: "35%", // Image takes up 40% of the container's width
          }
        }
        src={sideImage}
      />
      <div
        style={
          {
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingLeft: 24,
            paddingRight: 60,
            lineHeight: 1.2,
            fontSize: 24,
            color: "black",
            flex: 1,
            overflow: "hidden",
            marginTop: 24,
          }
        }
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            paddingLeft: 24,
            paddingRight: 24,
            lineHeight: 1.2,
            fontSize: 24,
            color: "black",
            flex: 1,
            overflow: "hidden",
            marginTop: 24,
          }}
        >
          <div style={{ marginTop: 30, fontWeight: "bolder", color: "white", display: "flex", width: "100%", justifyContent: "space-between" }}>Braavos Pro Score: Top Players</div>
          <div style={{ marginTop: 50, color: "white", display: "flex", width: "100%", justifyContent: "space-between", borderBottom: "4px solid white", paddingBottom: "10px", marginBottom: "20px" }}>
            <div style={{ width: "30%", fontWeight: "bold" }}>User</div>
            <div style={{ width: "30%", fontWeight: "bold" }}>Score</div>
            <div style={{ width: "30%", fontWeight: "bold" }}>Last Update</div>
          </div>
          {scores.map((score: Score, index: number) => (
            <div key={index} style={{ color: "white", display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ width: '30%' }}>{score.username}</span>
              <span style={{ width: '30%' }}>{score.score} / 100</span>
              <span style={{ width: '30%' }}>{score.fc_timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      width: 1146,
      height: 600,
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
};
