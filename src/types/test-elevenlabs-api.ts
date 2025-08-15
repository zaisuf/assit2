const fs = require('fs');

async function testElevenLabsAPI() {
  const apiKey = 'sk_428f03a2846494eefc8e9840dd7f72f93f881b99f7ed6dff';
  const url = 'https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL';
  const body = {
    text: 'Hello, this is a test of the ElevenLabs API.',
    model_id: 'eleven_monolingual_v1', // Use the free tier flash model
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.5
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'xi-api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'audio/mpeg',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to convert text to speech');
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync('output.mp3', buffer);
  console.log('Audio saved as output.mp3');
}

testElevenLabsAPI().catch(console.error);
