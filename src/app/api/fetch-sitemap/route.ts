import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ urls: [] });
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) return NextResponse.json({ urls: [] });
    const xml = await res.text();
    const parsed = await parseStringPromise(xml);
    const urls: string[] = [];
    if (parsed.urlset && parsed.urlset.url) {
      for (const u of parsed.urlset.url) {
        if (u.loc && u.loc[0]) urls.push(u.loc[0]);
      }
    } else if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
      for (const s of parsed.sitemapindex.sitemap) {
        if (s.loc && s.loc[0]) urls.push(s.loc[0]);
      }
    }
    return NextResponse.json({ urls });
  } catch {
    return NextResponse.json({ urls: [] });
  }
}
