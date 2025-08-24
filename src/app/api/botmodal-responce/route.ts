


import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { db } from '../firebase/firebase-admin';
import stringSimilarity from 'string-similarity';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { message, designId, userId: userIdFromBody } = body;
  let fetchedContent = '';
  let foundUrl = '';
  let matchedIntent = '';
  let userId = userIdFromBody;

  // 1. Detect userId if not provided
  if (!userId && designId) {
    // Search all users for a uidesing/{designId} doc
    const usersSnap = await db.collection('users').get();
    for (const userDoc of usersSnap.docs) {
      const uidesingDoc = await db.collection('users').doc(userDoc.id).collection('uidesing').doc(designId).get();
      if (uidesingDoc.exists) {
        userId = userDoc.id;
        break;
      }
    }
  }
  if (!userId) {
    return NextResponse.json({ error: 'userId not found for designId', designId }, { status: 400 });
  }

  // 2. Query Firebase for all intents and URLs for this user
  try {
    const docRef = db.doc(`/users/${userId}/allPages/data`);
    const docSnap = await docRef.get();
    if (docSnap.exists) {
      const raw = docSnap.data() || {};
      type PageType = { intent: string; url: string; keywords?: string[] };
      const pages: PageType[] = raw.pages || [];

      // --- SYSTEM-LEVEL PRICING INTENT CHECK ---
      const pricingWords = ["plan", "price", "charge", "cost", "subscription", "fee"];
      const lowerMsg = message.toLowerCase();
      let pricingMatch = pricingWords.some(word => lowerMsg.includes(word));
      if (pricingMatch) {
        // Try to find a page with intent 'pricing' (or similar)
        const pricingPage = pages.find((p: PageType) => typeof p.intent === 'string' && p.intent.toLowerCase().includes('pricing'));
        if (pricingPage) {
          matchedIntent = pricingPage.intent;
          foundUrl = pricingPage.url;
          // Debug: log forced pricing intent
          console.log("[chatbot-response] Forced pricing intent by system-level check.");
        }
      }

      // If not forced, do normal fuzzy/substring matching
      if (!matchedIntent) {
        let matchedPage = null;
        let bestScore = 0;
        let bestIntent = null;
        let bestPage = null;
        let bestKeyword = null;
        for (const page of pages) {
          if (page?.intent) {
            const keywords = Array.isArray(page.keywords) && page.keywords.length > 0
              ? [page.intent, ...page.keywords]
              : [page.intent];
            for (const keyword of keywords) {
              const score = stringSimilarity.compareTwoStrings(lowerMsg, keyword.toLowerCase());
              if (score > bestScore) {
                bestScore = score;
                bestIntent = page.intent;
                bestPage = page;
                bestKeyword = keyword;
              }
            }
          }
        }
        // Set a lower threshold for fuzzy match (e.g. 0.3)
        if (bestScore > 0.6 && bestIntent && bestPage) {
          matchedIntent = bestIntent;
          foundUrl = bestPage.url;
          matchedPage = bestPage;
        } else if (bestScore > 0.3 && bestKeyword) {
          // Not a strong match, but close enough: send bestKeyword as system context
          matchedIntent = bestIntent || '';
          foundUrl = bestPage?.url || '';
          matchedPage = bestPage;
          // Attach bestKeyword to be used in LLM context below
          (global as any)._fuzzyMatchedKeyword = bestKeyword;
        } else {
          // fallback to substring match if no good fuzzy match
          for (const page of pages) {
            const keywords = Array.isArray(page.keywords) && page.keywords.length > 0
              ? [page.intent, ...page.keywords]
              : [page.intent];
            for (const keyword of keywords) {
              if (lowerMsg.includes(keyword.toLowerCase())) {
                matchedIntent = page.intent;
                foundUrl = page.url;
                matchedPage = page;
                break;
              }
            }
            if (matchedPage) break;
          }
        }
        // Debug: log matched intent, URL, fuzzy score, and matched keyword
        console.log("[chatbot-response] Matched intent:", matchedIntent, "URL:", foundUrl, "Fuzzy score:", bestScore, "Matched keyword:", bestKeyword);
      }
    }
  } catch (e) {
    // ignore, fallback to no url
    console.log("[chatbot-response] Firebase error:", e);
  }
  // 3. Fetch content from foundUrl if any
  let buttonContext = '';
  if (foundUrl) {
    try {
      const res = await fetch(foundUrl);
      if (res.ok) {
        const html = await res.text();
        // Use cheerio to parse HTML and extract main content and buttons/links
        const $ = cheerio.load(html);
        // Extract main content (try <main>, fallback to <body>)
        let mainText = $('main').text();
        if (!mainText || mainText.trim().length < 100) {
          mainText = $('body').text();
        }
        fetchedContent = mainText.replace(/\s+/g, ' ');
        // Extract buttons and links
        const buttons: string[] = [];
        $('button').each((i: number, el: any) => {
          const text = $(el).text().trim();
          if (text) buttons.push(`Button: "${text}"`);
        });
        $('a').each((i: number, el: any) => {
          const text = $(el).text().trim();
          if (text) buttons.push(`Link: "${text}"`);
        });
        if (buttons.length > 0) {
          buttonContext = `Buttons and links found on the page: ${buttons.join(', ')}`;
        }
      }
    } catch (e) {
      fetchedContent = '';
      buttonContext = '';
    }
    // Debug: log fetched content length
    console.log("[chatbot-response] Fetched content length:", fetchedContent.length);
    if (buttonContext) {
      console.log("[chatbot-response] Button context:", buttonContext);
    }
  }
  // 4. Build messages for LLM
  const messages = [];
  if (fetchedContent) {
    // Only send the first 4000 characters to the LLM for context
    messages.push({ role: 'system', content: `Here is some context from the relevant website: ${fetchedContent.slice(0, 4000)}` });
  }
  if (buttonContext) {
    messages.push({ role: 'system', content: buttonContext });
  }
  // If a fuzzy matched keyword was found (but not a strong match), add as system context
  if ((global as any)._fuzzyMatchedKeyword) {
    messages.push({ role: 'system', content: `The user's message is similar to: ${(global as any)._fuzzyMatchedKeyword}` });
    delete (global as any)._fuzzyMatchedKeyword;
  }
  messages.push({ role: 'user', content: message });
  // 5. Call Groq API
  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages,
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1,
      stream: false,
    }),
  });
  if (!groqRes.ok) {
    const errorData = (await groqRes.json().catch(() => null)) as { error?: { message?: string } } | null;
    return NextResponse.json({ error: errorData?.error?.message || 'Groq API error' }, { status: 500 });
  }
  const data = (await groqRes.json()) as { choices: { message: { content: string } }[] };
  return NextResponse.json({
    response: data.choices[0].message.content,
    fetchedContent,
    debug: {
      foundUrl,
      matchedIntent,
      fetchedContentLength: fetchedContent.length
    }
  });
}
