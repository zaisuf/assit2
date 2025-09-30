import type { NextApiRequest, NextApiResponse } from "next";

// Make sure to add DEEPAI_API_KEY and DEEPSEEK_API_KEY to your .env.local file
const DEEPAI_API_KEY = process.env.DEEPAI_API_KEY;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { prompt, model } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }
  if (model === "deepseek-r1") {
    if (!DEEPSEEK_API_KEY) {
      return res.status(500).json({ error: "DeepSeek API key is missing. Please set DEEPSEEK_API_KEY in your .env.local file and restart the server." });
    }
    try {
      // DeepSeek R1 API endpoint and payload (assumed, update if needed)
      const apiRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${DEEPSEEK_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "user", content: prompt }
          ]
        }),
      });
      const data = await apiRes.json();
      if (!apiRes.ok) {
        return res.status(apiRes.status).json({ error: data.error || "DeepSeek API error", details: data });
      }
      // DeepSeek returns { choices: [{ message: { content: string } }] }
      return res.status(200).json({ output: data.choices?.[0]?.message?.content || "No response from DeepSeek." });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to call DeepSeek API", details: err.message || err });
    }
  } else {
    if (!DEEPAI_API_KEY) {
      return res.status(500).json({ error: "DeepAI API key is missing. Please set DEEPAI_API_KEY in your .env.local file and restart the server." });
    }
    try {
      const apiRes = await fetch("https://api.deepai.org/api/text-generator", {
        method: "POST",
        headers: {
          "Api-Key": DEEPAI_API_KEY,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ text: prompt }).toString(),
      });
      const data = await apiRes.json();
      if (!apiRes.ok) {
        return res.status(apiRes.status).json({ error: data.error || "DeepAI API error", details: data });
      }
      // DeepAI returns { output: string }
      return res.status(200).json({ output: data.output });
    } catch (err: any) {
      return res.status(500).json({ error: "Failed to call DeepAI API", details: err.message || err });
    }
  }
}
