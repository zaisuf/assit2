// Proxy API route for OpenRouter
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "Missing OpenRouter API key in environment variables." });
      return;
    }
    const apiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await apiRes.json();
    // Log only the POST, model, and status
    // eslint-disable-next-line no-console
    console.log(`POST /api/openrouter-proxy /${data.model} ${apiRes.status}`);

    // If the response is missing choices or message, or content is empty, use reasoning as fallback
    if (!data || !Array.isArray(data.choices) || !data.choices[0] || !data.choices[0].message) {
      res.status(200).json({
        choices: [
          {
            message: {
              content: "Sorry, I did not get a response from the AI. Please try again.",
            },
          },
        ],
      });
      return;
    }

    // Robust fallback logic for content
    const msg = data.choices[0].message;
    let content = msg.content && msg.content.trim() !== "" ? msg.content : null;
    if (!content && msg.reasoning && msg.reasoning.trim() !== "") {
      content = msg.reasoning;
    }
    if (!content) {
      content = "Sorry, I did not get a response from the AI. Please try again.";
    }
    data.choices[0].message.content = content;
    res.status(apiRes.status).json(data);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[OpenRouter Proxy] Error:", error);
    res.status(500).json({ error: "Proxy error", details: error instanceof Error ? error.message : error });
  }
}
