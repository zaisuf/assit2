import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { chunks } = req.body;
  if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid chunks' });
  }

  try {
    // For each chunk, ask the LLM to split it into logical sections ("chunks")
    const chunkedResults = [];
    for (const { text, url } of chunks) {
      const prompt = `Split the following web page content into logical, self-contained knowledge chunks (max 300 words each). For each chunk, provide a short intent label (2-4 words, lowercase, snake_case) describing the main topic. Return as a JSON array of objects: {intent, text}.\n\nPage URL: ${url}\n\nContent:\n${text}`;
      const llmRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that splits web page content into logical, self-contained knowledge chunks for retrieval. For each chunk, provide a short intent label (2-4 words, lowercase, snake_case) describing the main topic. Output as a JSON array of objects: {intent, text}.'
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.3,
          max_tokens: 900,
          top_p: 1,
          stream: false,
        }),
      });
      if (!llmRes.ok) {
        throw new Error('LLM API error');
      }
      const llmData = await llmRes.json();
      let content = llmData.choices[0].message.content;
      // Try to parse JSON array from LLM output
      let parsedChunks = [];
      try {
        // Find first [ and last ] to extract JSON array
        const start = content.indexOf('[');
        const end = content.lastIndexOf(']');
        if (start !== -1 && end !== -1) {
          content = content.slice(start, end + 1);
        }
        parsedChunks = JSON.parse(content);
      } catch (e) {
        // fallback: treat as single chunk
        parsedChunks = [{ intent: 'general', text: content }];
      }
      // Add id field to each chunk
      const urlSlug = url.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
      const withIds = parsedChunks.map((chunk, idx) => ({
        id: `${urlSlug}-${idx + 1}`,
        intent: chunk.intent || 'general',
        text: chunk.text || '',
      }));
      chunkedResults.push(...withIds);
    }
    res.status(200).json({ chunkedResults });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}
