// pages/api/test-openai.ts
import type { NextApiRequest, NextApiResponse } from "next";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { prompt, model } = req.body;
  if (!prompt || !model) {
    res.status(400).json({ error: "Missing prompt or model" });
    return;
  }
  if (!OPENAI_API_KEY) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY in environment" });
    return;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: "You are a helpful AI assistant. Only reply with your final answer for the user. Do not include your reasoning or thought process." },
          { role: "user", content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
        top_p: 1,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      // Special handling for quota exceeded error
      if (data?.error?.message && data.error.message.includes("quota")) {
        return res.status(429).json({
          error: "OpenAI API quota exceeded. Please check your plan and billing details.",
          details: data.error.message,
          docs: "https://platform.openai.com/docs/guides/error-codes/api-errors"
        });
      }
      throw new Error(data?.error?.message || data?.error || response.statusText);
    }
    const output = data.choices?.[0]?.message?.content || "No response from model.";
    res.status(200).json({ output });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("[OpenAI API Error]", error);
    res.status(500).json({ error: error.message || "Unknown error", details: error });
  }
}
