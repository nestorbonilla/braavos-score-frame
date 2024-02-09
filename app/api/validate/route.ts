import { NextRequest } from 'next/server';

// Asume que esta función es parte de tu enfoque con la nueva estructura de 'app'.
export async function POST(req: NextRequest) {
  // console.log("___________________________");
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
    const buffer = Buffer.from(messageBytes, "hex");
    const response = await fetch("https://nemes.farcaster.xyz:2281/v1/validateMessage", {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: buffer,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data && data.valid) {
      // Procesa y devuelve la respuesta adecuada.
      return new Response(JSON.stringify({ fid: data.message.data.fid, timestamp: data.message.data.timestamp }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Maneja la respuesta no válida.
      return new Response(JSON.stringify({ error: "Invalid message" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (e) {
    console.error('Error validating message:', e);
    return new Response(JSON.stringify({ error: `Failed to validate message: ${e}` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
