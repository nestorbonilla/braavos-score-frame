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
    // const buffer = Buffer.from(messageBytes, "hex");
    const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);
    const response = await client.validateFrameAction(messageBytes);
    // console.log("response: ", response);
    
    if (response.valid) {
      let fid = response.action?.interactor.fid;
      let timestamp = 1707455233004;
      let newRow = JSON.stringify({
        fid,
        timestamp
      });
      console.log("newRow: ", newRow);
      const dbResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: newRow,
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("data from api/database:");
        console.log(data);
      });

      // if (!dbResponse.success) {
      //   throw new Error('Error al insertar datos');
      // }
      return new Response(JSON.stringify({ fid, timestamp }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } else {
      throw new Error(`HTTP error! status: ${response}`);
    }

    // const data = await response.json();

    // if (data && data.valid) {
    //   // Procesa y devuelve la respuesta adecuada.
    //   return new Response(JSON.stringify({ fid: data.message.data.fid, timestamp: data.message.data.timestamp }), {
    //     status: 200,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // } else {
    //   // Maneja la respuesta no válida.
    //   return new Response(JSON.stringify({ error: "Invalid message" }), {
    //     status: 400,
    //     headers: { 'Content-Type': 'application/json' }
    //   });
    // }
  } catch (e) {
    console.error('Error validating message:', e);
    return new Response(JSON.stringify({ error: `Failed to validate message: ${e}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
