// pages/_middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  // Check if the path matches your redirect condition
  if (req.nextUrl.pathname.startsWith('/api/redirect')) {
    const url = req.nextUrl.clone();
    const searchParams = url.searchParams;
    // Example: Extracting a query parameter and deciding to redirect based on its presence
    const messageBytes = searchParams.get('messageBytes');

    if (messageBytes) {
      // Change the pathname for redirection and keep the search parameters if needed
      url.pathname = '/api/verify';
      // Optionally modify searchParams here
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}
