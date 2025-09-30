import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  let url;
  if (req.method === 'POST') {
    url = req.body.url;
  } else {
    url = req.query.url;
  }
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }
  try {
    if (!/^https?:\/\//.test(url)) url = 'https://' + url;
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    let pageText = '';
    try {
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
      await page.waitForSelector('body', { timeout: 10000 });
      // Get all visible text from the page and clean it up
      pageText = await page.evaluate(() => {
        let text = document.body.innerText;
        // Remove extra whitespace and collapse multiple blank lines
        text = text.replace(/\s+\n/g, '\n').replace(/\n{2,}/g, '\n');
        return text.trim();
      });
    } finally {
      await browser.close();
    }
    res.status(200).json({ text: pageText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
