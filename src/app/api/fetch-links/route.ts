import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ links: [] });
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return NextResponse.json({ links: [] });
    const html = await res.text();
    // Simple anchor tag extraction
    const links: { href: string, text: string }[] = [];
    const anchorRegex = /<a [^>]*href=["']([^"'#>]+)["'][^>]*>(.*?)<\/a>/gi;
    let match;
    while ((match = anchorRegex.exec(html)) !== null) {
      let href = match[1];
      let text = match[2].replace(/<[^>]+>/g, '').trim();
      if (href.startsWith('/')) {
        // Convert relative to absolute
        try {
          const u = new URL(url);
          href = u.origin + href;
        } catch {}
      }
      if (/^https?:\/\//.test(href)) {
        links.push({ href, text });
      }
    }
    return NextResponse.json({ links });
  } catch {
    return NextResponse.json({ links: [] });
  }
}
