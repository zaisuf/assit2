import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audio = formData.get('audio');
  if (!audio || !(audio instanceof Blob)) {
    return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  const groqUrl = 'https://api.groq.com/openai/v1/audio/transcriptions';

  const arrayBuffer = await audio.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const file = new File([uint8Array], 'audio.wav', { type: 'audio/wav' });

  const groqForm = new FormData();
  groqForm.append('file', file);
  groqForm.append('model', 'whisper-large-v3');
  groqForm.append('response_format', 'json');

  const groqRes = await fetch(groqUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: groqForm,
  });

  if (!groqRes.ok) {
    const error = await groqRes.text();
    return NextResponse.json({ error }, { status: 500 });
  }

  const data = await groqRes.json();
  return NextResponse.json({ text: data.text });
}
