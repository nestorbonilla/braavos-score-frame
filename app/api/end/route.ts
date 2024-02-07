import { NextRequest, NextResponse } from 'next/server';
export async function POST(req: NextRequest): Promise<Response> {
  let data = await req.json();
  let buttonId = data.untrustedData.buttonIndex;

  let path: string;
  if (buttonId === 1) {
    path = '/api/frame?id=2';
  } else if (buttonId === 2) {
    path = 'pinatacloud';
  } else {
    path = '';
  }
  let headers = new Headers();
  headers.set('Location', `${process.env.NEXT_PUBLIC_BASE_URL}/`);
  let response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/${path}`, {
    headers: headers,
    status: 302,
  });
  return response;
}
export let dynamic = 'force-dynamic';