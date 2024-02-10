import { NextRequest } from 'next/server';
import { NeynarAPIClient, FeedType, FilterType } from "@neynar/nodejs-sdk";

// Asume que esta función es parte de tu enfoque con la nueva estructura de 'app'.
export async function POST(req: NextRequest) {
  console.log("___________________________");
  console.log("accessing api/validate...");

  // Asumiendo que el cuerpo de la solicitud es un ReadableStream, 
  // y necesitas convertirlo a JSON.
  const reader = req.body!.getReader();
  const chunks: Uint8Array[] = [];
  let done, value;
  while (({ done, value } = await reader.read()) && !done) {
    chunks.push(value as Uint8Array);
  }
  const bodyString = new TextDecoder().decode(Buffer.concat(chunks));
  const body = JSON.parse(bodyString);

  const messageBytes = body.messageBytes;
  // console.log(`messageBytes: ${messageBytes}`);

  if (!messageBytes) {
    return new Response(JSON.stringify({ error: "Missing messageBytes" }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);
    const response = await client.validateFrameAction(messageBytes);
    
    if (response.valid) {
      let fid = response.action?.interactor.fid;
      let username = response.action?.interactor.username;
      let fc_timestamp = response.action?.timestamp;
      // let fc_timestamp = '2024-02-10T07:44:59.000Z';
      
      let newRow = JSON.stringify({
        fid,
        username,
        fc_timestamp
      });
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: newRow,
      })
        .then((res) => res.json());
      return new Response(JSON.stringify({ fid, username, fc_timestamp }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      throw new Error(`HTTP error! status: ${response}`);
    }
  } catch (e) {
    console.error('Error validating message:', e);
    return new Response(JSON.stringify({ error: `Failed to validate message: ${e}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
