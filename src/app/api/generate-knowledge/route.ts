import { NextResponse } from 'next/server';
import { llamaGenerateKnowledge } from './llama';

// Store visited URLs to avoid duplicates
const visitedUrls = new Set<string>();

// Extract domain from URL
function getDomain(url: string) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch (e) {
    return null;
  }
}

// Extract all internal links from HTML
function extractInternalLinks(html: string, baseUrl: string) {
  const domain = getDomain(baseUrl);
  if (!domain) return [];
  
  const links: string[] = [];
  const linkRegex = /href=["'](.*?)["']/g;
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    try {
      const url = new URL(match[1], baseUrl);
      // Only include links from same domain and not already visited
      if (url.hostname === domain && !visitedUrls.has(url.href)) {
        links.push(url.href);
      }
    } catch (e) {
      // Skip invalid URLs
      continue;
    }
  }
  
  return links;
}

// List of file extensions to skip (non-HTML/text assets)
const SKIP_EXTENSIONS = [
  '.woff2', '.woff', '.ttf', '.eot', '.otf',
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp', '.tiff', '.mp4', '.mp3', '.wav', '.avi', '.mov', '.mkv', '.webm',
  '.css', '.js', '.json', '.pdf', '.zip', '.rar', '.7z', '.tar', '.gz', '.xml', '.rss', '.apk', '.exe', '.dmg', '.bin', '.csv', '.ppt', '.pptx', '.doc', '.docx', '.xls', '.xlsx', '.psd', '.ai', '.sketch', '.csv', '.tsv', '.md', '.map', '.m3u8', '.ts', '.m4a', '.ogg', '.flac', '.aac', '.rtf', '.ics', '.ics', '.swf', '.dat', '.bak', '.tmp', '.log', '.lock', '.db', '.sqlite', '.sqlite3', '.bak', '.bak1', '.bak2', '.bak3', '.bak4', '.bak5', '.bak6', '.bak7', '.bak8', '.bak9', '.bak10', '.bak11', '.bak12', '.bak13', '.bak14', '.bak15', '.bak16', '.bak17', '.bak18', '.bak19', '.bak20', '.bak21', '.bak22', '.bak23', '.bak24', '.bak25', '.bak26', '.bak27', '.bak28', '.bak29', '.bak30', '.bak31', '.bak32', '.bak33', '.bak34', '.bak35', '.bak36', '.bak37', '.bak38', '.bak39', '.bak40', '.bak41', '.bak42', '.bak43', '.bak44', '.bak45', '.bak46', '.bak47', '.bak48', '.bak49', '.bak50',
  '.webmanifest'
];

function shouldSkipUrl(url: string) {
  const lower = url.toLowerCase().split('?')[0].split('#')[0];
  return SKIP_EXTENSIONS.some(ext => lower.endsWith(ext));
}

async function fetchWebsiteContent(url: string, maxPages = 50) {
  const results: Array<{id: string, intent: string, text: string, source: string}> = [];
  const domain = getDomain(url);
  if (!domain) throw new Error('Invalid URL');

  // Try to fetch sitemap.xml
  let pageUrls: string[] = [];
  try {
    const sitemapUrl = url.endsWith('/') ? url + 'sitemap.xml' : url + '/sitemap.xml';
    const res = await fetch(sitemapUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    if (res.ok && res.headers.get('content-type')?.includes('xml')) {
      const xmlText = await res.text();
      // Simple regex to extract <loc> URLs from sitemap
      const locRegex = /<loc>([^<]+)<\/loc>/g;
      let match;
      while ((match = locRegex.exec(xmlText)) !== null) {
        if (match[1] && !shouldSkipUrl(match[1])) {
          pageUrls.push(match[1]);
        }
      }
    }
  } catch (err) {
    // Ignore sitemap errors, fallback to crawling
  }

  // If sitemap found and has URLs, use only those
  let urlQueue = pageUrls.length > 0 ? [...pageUrls] : [url];
  let processedPages = 0;

  while (urlQueue.length > 0 && processedPages < maxPages) {
    const currentUrl = urlQueue.shift();
    if (!currentUrl || visitedUrls.has(currentUrl)) continue;
    if (shouldSkipUrl(currentUrl)) continue;

    try {
      // Add delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log(`Fetching: ${currentUrl}`);

      let html = '';
      try {
        const response = await fetch(currentUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          }
        });
        // Skip error pages (404, 403, 500, etc.)
        if (!response.ok || [404, 403, 500].includes(response.status)) {
          console.warn(`Skipping error page: ${currentUrl} (status ${response.status})`);
          continue;
        }
        html = await response.text();
      } catch (fetchErr) {
        console.error(`Fetch failed for ${currentUrl}:`, fetchErr);
        // Skip this URL and continue
        continue;
      }

      // Mark as visited
      visitedUrls.add(currentUrl);

      // Clean HTML content
      const cleanHtml = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      const sentences = cleanHtml.match(/[^.!?]+[.!?]+/g) || [];
      for (const sentence of sentences) {
        const cleanSentence = sentence.trim();
        if (cleanSentence.split(' ').length > 5) {
          // Use LLM to generate id, intent, and text (pass url for fallback)
          let llmResult = null;
          try {
            llmResult = await llamaGenerateKnowledge(cleanSentence, currentUrl);
          } catch (err) {
            llmResult = {};
          }
          // Always generate id and intent from text
          const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
          const guessIntent = (text: string) => {
            const t = text.toLowerCase();
            if (t.includes('shipping')) return 'shipping_details';
            if (t.includes('return')) return 'return_details';
            if (t.includes('exchange')) return 'exchange_policy';
            if (t.includes('refund')) return 'refund_details';
            if (t.includes('order')) return 'order_info';
            if (t.includes('size')) return 'sizing_details';
            if (t.includes('payment')) return 'payment_options';
            if (t.includes('warranty')) return 'warranty_info';
            if (t.includes('quality')) return 'quality_guarantee';
            if (t.includes('product')) return 'product_details';
            if (t.includes('support') || t.includes('help')) return 'support_info';
            if (t.includes('discount')) return 'discount_info';
            if (t.includes('gift')) return 'gift_card_info';
            if (t.includes('loyalty')) return 'loyalty_rewards';
            if (t.includes('app')) return 'mobile_app';
            if (t.includes('store')) return 'offline_stores';
            if (t.includes('track')) return 'tracking_info';
            if (t.includes('care')) return 'care_instructions';
            if (t.includes('eco') || t.includes('sustainab')) return 'eco_friendly';
            if (t.includes('bulk')) return 'bulk_purchase';
            if (t.includes('student')) return 'student_offer';
            if (t.includes('cash on delivery') || t.includes('cod')) return 'cash_on_delivery';
            if (t.includes('cancel')) return 'order_cancellation';
            if (t.includes('page') || t.includes('collection')) return 'page_link';
            if (t.includes('fashion') || t.includes('assistant')) return 'chatbot_info';
            return 'general_info';
          };
          const id = slugify(llmResult.text || cleanSentence);
          const intent = guessIntent(llmResult.text || cleanSentence);
          results.push({
            id,
            intent,
            text: llmResult.text || cleanSentence,
            source: currentUrl
          });
        }
      }

      // If crawling (no sitemap), find more pages to crawl
      if (pageUrls.length === 0) {
        const newLinks = extractInternalLinks(html, currentUrl).filter(link => !shouldSkipUrl(link));
        urlQueue.push(...newLinks);
      }
      processedPages++;

      console.log(`Processed ${processedPages} pages. Queue size: ${urlQueue.length}`);

    } catch (error) {
      console.error(`Error processing ${currentUrl}:`, error);
      // Continue with next URL even if one fails
      continue;
    }
  }

  return results;
}

export async function POST(request: Request) {
  try {
    const { url, maxPages = 50 } = await request.json();

    // Validate URL
    if (!url || typeof url !== 'string' || !/^https?:\/\//i.test(url)) {
      return NextResponse.json(
        { error: 'A valid website URL (including http:// or https://) is required.' },
        { status: 400 }
      );
    }

    // Clear visited URLs for new request
    visitedUrls.clear();

    const content = await fetchWebsiteContent(url, maxPages);
    const pagesCrawled = visitedUrls.size;

    return NextResponse.json({ 
      responses: content,
      metadata: {
        pagesCrawled,
        baseUrl: url
      }
    });
  } catch (error) {
    console.error('Error in generate-knowledge:', error);
    let errorMsg = 'Failed to generate knowledge data';
    if (typeof error === 'object' && error && 'message' in error) {
      errorMsg = (error as any).message || errorMsg;
    } else if (typeof error === 'string') {
      errorMsg = error;
    }
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
