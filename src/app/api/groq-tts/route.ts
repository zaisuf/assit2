import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { text, model, voice, response_format } = await req.json();

  const apiKey = process.env.GROQ_API_KEY;
  const groqUrl = 'https://api.groq.com/openai/v1/audio/speech';

  const groqRes = await fetch(groqUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: text,
      voice,
      response_format: response_format || 'mp3',
    }),
  });

  if (!groqRes.ok) {
    const error = await groqRes.text();
    return NextResponse.json({ error }, { status: 500 });
  }

  const arrayBuffer = await groqRes.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const audioUrl = `data:audio/mp3;base64,${base64}`;
  return NextResponse.json({ audioUrl });
}
