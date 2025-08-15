

import fetch from 'node-fetch';
import Replicate from 'replicate';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const QDRANT_URL = 'https://434e5e58-4cfe-48b6-81fd-85f35ef6db53.us-west-1-0.aws.cloud.qdrant.io';
const QDRANT_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.ZL0xYuO2_f5v4TYGKFGILWgiHtL35c4sJyFdVyXXGE4';
const QDRANT_COLLECTION = process.env.QDRANT_COLLECTION || 'website_chunks';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { chunks } = req.body;
  if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid chunks' });
  }

  try {
    // Use Replicate SDK and batch texts for embedding
    const replicate = new Replicate({ auth: REPLICATE_API_TOKEN });
    const texts = chunks.map(chunk => chunk.text);
    const output = await replicate.run(
      "nateraw/bge-large-en-v1.5:9cf9f015a9cb9c61d1a2610659cdac4a4ca222f2d3707a68517b18c198a9add1",
      { input: { texts: JSON.stringify(texts) } }
    );
    if (!output || !Array.isArray(output) || output.length !== chunks.length) {
      throw new Error("Replicate embedding output mismatch or error");
    }
    const embeddedChunks = chunks.map((chunk, idx) => ({ ...chunk, vector: output[idx] }));

    // Save to Qdrant
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const points = embeddedChunks.map((chunk, idx) => {
      let pointId = chunk.id;
      // If not a valid UUID, generate one
      if (!pointId || !uuidRegex.test(pointId)) {
        pointId = randomUUID();
      }
      return {
        id: pointId,
        vector: chunk.vector,
        payload: {
          intent: chunk.intent,
          text: chunk.text,
        },
      };
    });

    // Qdrant REST API call
    const qdrantHeaders = { 'Content-Type': 'application/json' };
    if (QDRANT_API_KEY) qdrantHeaders['api-key'] = QDRANT_API_KEY;
    const qdrantRes = await fetch(`${QDRANT_URL}/collections/${QDRANT_COLLECTION}/points?wait=true`, {
      method: 'PUT',
      headers: qdrantHeaders,
      body: JSON.stringify({ points }),
    });
    if (!qdrantRes.ok) {
      const err = await qdrantRes.text();
      throw new Error('Qdrant error: ' + err);
    }
    res.status(200).json({ success: true, pointsSaved: points.length });
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}

