# Conversation API Documentation

This API allows you to interact with a modern house design AI assistant using either text or audio input. The backend automatically manages speech detection (VAD), transcription, and conversation logic. No microphone or VAD logic is needed on the client side for audio uploads.

## Endpoint

`POST /api/conversation`

---

## Modes of Use

### 1. Text Input (JSON)
Send a JSON body with your message:

```
POST /api/conversation
Content-Type: application/json

{
  "apiKey": "<your_api_key>",
  "agentId": "<your_agent_id>",
  "text": "Tell me about modern house design.",
  "tts": true
}
```

- `apiKey`: Your API key (required)
- `agentId`: Your agent ID (required)
- `text`: The user's message (required)
- `tts`: (optional, boolean) If true, returns TTS audio (base64)

### 2. Audio Input (multipart/form-data)
Send a single audio file (with speech and silence) as `file`:

```
POST /api/conversation
Content-Type: multipart/form-data

Fields:
- apiKey: <your_api_key>
- agentId: <your_agent_id>
- file: <audio file> (e.g., .wav, .webm, .mp3)
- tts: true (optional)
- language: en (optional, default: en)
```

- The backend will automatically:
  - Use VAD to split the audio into speech segments (auto mic on/off)
  - Transcribe each segment
  - Join the transcriptions and use as the conversation input
  - Return the AI response (and TTS audio if requested)

#### Example using `curl`:

```
curl -X POST https://yourdomain.com/api/conversation \
  -F "apiKey=<your_api_key>" \
  -F "agentId=<your_agent_id>" \
  -F "file=@your_audio_file.wav" \
  -F "tts=true"
```

---

## Response

```
{
  "text": "AI response text...",
  "audio": "<base64_wav_audio>" // Only if tts=true
}
```

- `text`: The AI's response
- `audio`: (optional) Base64-encoded WAV audio of the response

---

## Notes
- For audio input, you do NOT need to manage the microphone or VAD logic. Just upload a single audio file (with speech and silence), and the backend will handle everything.
- For text input, simply send your message as JSON.
- The API will validate your API key and agent ID.

---

## Example Client Code (Text)
```js
fetch('/api/conversation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    apiKey: 'YOUR_API_KEY',
    agentId: 'YOUR_AGENT_ID',
    text: 'Tell me about modern house design.',
    tts: true
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## Example Client Code (Audio)
```js
const formData = new FormData();
formData.append('apiKey', 'YOUR_API_KEY');
formData.append('agentId', 'YOUR_AGENT_ID');
formData.append('file', audioBlob, 'audio.wav');
formData.append('tts', 'true');

fetch('/api/conversation', {
  method: 'POST',
  body: formData
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

For more details, see the backend code in `src/app/api/conversation/route.ts`.
