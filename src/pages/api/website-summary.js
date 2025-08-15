
import fetch from 'node-fetch';
import puppeteer from 'puppeteer';
// Helper to get fully rendered page text using Puppeteer
async function getRenderedPageText(url) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
    // Wait for body to be present
    await page.waitForSelector('body', { timeout: 10000 });
    // Get visible text only
    const text = await page.evaluate(() => document.body.innerText);
    return text;
  } finally {
    await browser.close();
  }
}

export default async function handler(req, res) {
  // Support both GET (query params) and POST (body)
  let url, query;
  let footerText;
  if (req.method === 'POST') {
    url = req.body.url;
    query = req.body.query;
    footerText = req.body.footerText;
  } else {
    url = req.query.url;
    query = req.query.query;
    footerText = req.query.footerText;
  }
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  try {
    let baseUrl = url;
    if (!baseUrl.startsWith('http')) baseUrl = 'https://' + baseUrl;
    if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

    // Step 1: Use user-provided footer text to extract page names
    let chunks = [];
    let urls = [];
    let matchedSitemapUrls = [];
    try {
      // Only fetch/render the single user-provided page to get footer links
      const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      let pageFooterLinks = [];
      try {
        const page = await browser.newPage();
        await page.goto(baseUrl, { waitUntil: 'networkidle2', timeout: 45000 });
        await page.waitForSelector('body', { timeout: 10000 });
        // Get all footer links (anchor tags in <footer>)
        pageFooterLinks = await page.evaluate(() => {
          const links = [];
          const socialPatterns = [
            /instagram\.com/i,
            /facebook\.com/i,
            /twitter\.com/i,
            /linkedin\.com/i,
            /youtube\.com/i,
            /whatsapp\.com/i,
            /tiktok\.com/i,
            /pinterest\.com/i,
            /snapchat\.com/i,
            /x\.com/i,
            /fb\.com/i,
            /wa\.me/i
          ];
          const footer = document.querySelector('footer');
          if (footer) {
            footer.querySelectorAll('a').forEach(a => {
              const href = a.href || '';
              if (socialPatterns.some(re => re.test(href))) return;
              links.push({
                text: a.textContent ? a.textContent.trim() : '',
                href
              });
            });
          }
          return links;
        });
      } finally {
        await browser.close();
      }
      // Only return the detected footer links
      res.status(200).json({ footerLinks: pageFooterLinks });
    } catch (e) {
      res.status(500).json({ error: 'Could not fetch or render the page footer', details: e.message });
    }
  } catch (error) {
    // Return full error stack for debugging
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}
