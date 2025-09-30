// pages/api/test-replicate.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { prompt, model } = req.body;
  if (!prompt) {
    res.status(400).json({ error: "Missing prompt" });
    return;
  }
  const selectedModel = typeof model === "string" && model.length > 0 ? model : "meta/meta-llama-3-8b-instruct";

  // Use a chat-optimized model for better results
  try {
    // Handle IBM Granite model input if needed (currently expects 'prompt')
    let input: Record<string, any>;
    if (selectedModel.startsWith("ibm-granite/")) {
      // IBM Granite expects 'input' as the key for the prompt
      input = {
        input: prompt,
        max_new_tokens: 200,
        temperature: 0.7,
      };
    } else {
      input = {
        prompt,
        max_new_tokens: 200,
        temperature: 0.7,
      };
    }

    const output = await replicate.run(selectedModel as `${string}/${string}` | `${string}/${string}:${string}` , {
      input,
    });
    const responseText = Array.isArray(output) ? output.join("") : String(output);
    res.status(200).json({ output: responseText });
  } catch (error: any) {
    // Log error details for debugging
    // eslint-disable-next-line no-console
    console.error("[Replicate API Error]", error);
    res.status(500).json({ error: error.message || "Unknown error", details: error });
  }
}
