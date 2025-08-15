import type { NextApiRequest, NextApiResponse } from "next";

// Add your Google Gemini API key to .env.local as GOOGLE_GEMINI_API_KEY
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (!GOOGLE_GEMINI_API_KEY) {
    return res.status(500).json({ error: "Google Gemini API key not set in environment" });
  }
  const { prompt, model } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  try {
    // Only supported models for Google Gemini API
    const supportedModels = [
      "gemini-1.5-flash-latest",
      // Add more supported Gemini models here as needed
    ];
    if (!supportedModels.includes(model)) {
      return res.status(400).json({
        error: `Model '${model}' is not supported by the Google Gemini API backend.`,
        details: {
          supportedModels,
          message: "Please select a supported Gemini model. Gemma models are not available via this API."
        }
      });
    }
    const apiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GOOGLE_GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    const data = await apiRes.json();
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ error: data.error?.message || "Google Gemini API error", details: data });
    }
    // Gemini returns candidates[0].content.parts[0].text
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    return res.status(200).json({ output });
  } catch (err: any) {
    return res.status(500).json({ error: "Failed to call Google Gemini API", details: err.message || err });
  }
}
