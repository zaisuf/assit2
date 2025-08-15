
"use client";
import React, { useState, useRef, useEffect } from 'react';
import GoogleTTSSelector from './GoogleTTSSelector';

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type RenderUiDesignProps = {
  designId: string;
  onFetchedContent?: (data: { content: string; intent?: string; url?: string }) => void;
};

export default function RenderUiDesign({ designId, onFetchedContent }: RenderUiDesignProps) {
  // TTS debounce ref
  const lastTTSTimeRef = useRef<number>(0);
  const TTS_COOLDOWN = 2000; // 2 seconds cooldown

  const googleTTS = async (text: string, languageCode: string = 'en-US', voice?: string): Promise<string | null> => {
    // Check if enough time has passed since last TTS call
    const now = Date.now();
    if (now - lastTTSTimeRef.current < TTS_COOLDOWN) {
      console.log('TTS call ignored - too soon since last call');
      return null;
    }
    lastTTSTimeRef.current = now;

    try {
      const res = await fetch('/api/google-tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          languageCode,
          voice: voice || undefined
        }),
      });
      const data = await res.json();
      if (data.audioUrl) return data.audioUrl;
      return null;
    } catch {
      return null;
    }
  };
  /**
   * Send an audio Blob to the Google STT API endpoint and return the transcript.
   * @param audioBlob The audio file as a Blob (e.g., from MediaRecorder)
   * @param languageCode Optional language code (default 'en-US')
   * @returns transcript text or error string
   */
  const googleSTT = async (audioBlob: Blob, languageCode: string = 'en-US'): Promise<string> => {
    try {
      console.log('[STT] Sending audio to /api/google-stt', { size: audioBlob.size, type: audioBlob.type, languageCode });
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('languageCode', languageCode);
      const res = await fetch('/api/google-stt', {
        method: 'POST',
        body: formData,
      });
      console.log('[STT] Response status:', res.status);
      let data;
      try {
        data = await res.json();
      } catch (jsonErr) {
        console.error('[STT] Failed to parse JSON:', jsonErr);
        return 'STT: Invalid server response.';
      }
      console.log('[STT] Response data:', data);
      if (data.text) return data.text;
      if (data.error) return `STT error: ${data.error}`;
      return 'STT: No transcript.';
    } catch (err) {
      console.error('[STT] Fetch error:', err);
      return 'STT: Failed to contact server.';
    }
  };



  // --- State for WaveNet voice modal ---
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('');

  // Small Chatbot UI (floating button and mini chat window)
  // SmallChatbotUI receives all required state and handlers as props
  // --- Llama Chatbot UI State ---
  const [llamaMessages, setLlamaMessages] = useState<Message[]>([]);
  const [llamaInputText, setLlamaInputText] = useState("");
  const [llamaIsLoading, setLlamaIsLoading] = useState(false);
  const llamaMessageEndRef = useRef<HTMLDivElement>(null);
    // --- Language selection for STT ---
    // List of common Google STT supported languages (add more as needed)
    const GOOGLE_STT_LANGUAGES = [
      { code: 'en-US', label: 'English (US)' },
      { code: 'en-GB', label: 'English (UK)' },
      { code: 'hi-IN', label: 'Hindi (India)' },
      { code: 'ar-SA', label: 'Arabic (Saudi Arabia)' },
      { code: 'es-ES', label: 'Spanish (Spain)' },
      { code: 'fr-FR', label: 'French (France)' },
      { code: 'de-DE', label: 'German (Germany)' },
      { code: 'ru-RU', label: 'Russian (Russia)' },
      { code: 'zh-CN', label: 'Chinese (Mandarin, Simplified)' },
      { code: 'ja-JP', label: 'Japanese' },
      { code: 'ko-KR', label: 'Korean' },
      { code: 'pt-BR', label: 'Portuguese (Brazil)' },
      { code: 'it-IT', label: 'Italian' },
      { code: 'tr-TR', label: 'Turkish' },
      { code: 'bn-BD', label: 'Bengali (Bangladesh)' },
      { code: 'ur-PK', label: 'Urdu (Pakistan)' },
      { code: 'fa-IR', label: 'Persian (Iran)' },
      { code: 'id-ID', label: 'Indonesian' },
      { code: 'th-TH', label: 'Thai' },
      { code: 'vi-VN', label: 'Vietnamese' },
      { code: 'pl-PL', label: 'Polish' },
      { code: 'uk-UA', label: 'Ukrainian' },
      { code: 'ms-MY', label: 'Malay' },
      { code: 'ta-IN', label: 'Tamil (India)' },
      { code: 'te-IN', label: 'Telugu (India)' },
      { code: 'mr-IN', label: 'Marathi (India)' },
      { code: 'gu-IN', label: 'Gujarati (India)' },
      { code: 'pa-IN', label: 'Punjabi (India)' },
      { code: 'kn-IN', label: 'Kannada (India)' },
      { code: 'ml-IN', label: 'Malayalam (India)' },
      { code: 'or-IN', label: 'Odia (India)' },
      { code: 'as-IN', label: 'Assamese (India)' },
      { code: 'si-LK', label: 'Sinhala (Sri Lanka)' },
      { code: 'ne-NP', label: 'Nepali (Nepal)' },
      { code: 'my-MM', label: 'Burmese (Myanmar)' },
      { code: 'am-ET', label: 'Amharic (Ethiopia)' },
      { code: 'sw-KE', label: 'Swahili (Kenya)' },
      { code: 'yo-NG', label: 'Yoruba (Nigeria)' },
      { code: 'zu-ZA', label: 'Zulu (South Africa)' },
      // ...add more as needed
    ];
    const [llamaLanguage, setLlamaLanguage] = useState('en-US');

    // Llama API call (now uses /api/chatbot-response for full parity)
    const callLlamaAPI = async (text: string): Promise<string> => {
      try {
        const res = await fetch('/api/chatbot-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, designId }),
        });
        const data = await res.json();
        if (data.response) return data.response;
        return 'Sorry, no response.';
      } catch {
        return 'Error contacting Llama.';
      }
    };

    // Llama Chatbot UI send handler with TTS
    const handleLlamaSendMessage = async (text: string) => {
      if (!text.trim()) return;
      setLlamaMessages((prev) => [...prev, { role: "user", content: text, timestamp: new Date() }]);
      setLlamaInputText("");
      setLlamaIsLoading(true);
      try {
        const response = await callLlamaAPI(text);
        
        // First update messages state
        setLlamaMessages(prev => [
          ...prev,
          { role: "assistant" as "assistant", content: response, timestamp: new Date() }
        ]);

        // Then handle TTS separately
        if (response && response.trim() && activeView === 'widget') {
          const url = await googleTTS(response, llamaLanguage, selectedVoice);
          if (url) {
            console.log('TTS audio URL:', url);
            const audio = new Audio(url);
            audio.onerror = (e) => {
              console.error('TTS audio playback error', e, url);
              alert('TTS audio could not be played. Check the console for details.');
            };
            audio.onplay = () => {
              console.log('TTS audio started playing:', url);
            };
            try {
              await audio.play();
              console.log('TTS audio started playing:', url);
            } catch (err) {
              console.error('TTS audio play() failed', err, url);
              alert('TTS audio play() failed. Check the console for details.');
            }
          } else {
            console.warn('No TTS audio URL returned');
          }
        }
      } finally {
        setLlamaIsLoading(false);
      }
    };

    useEffect(() => {
      if (llamaMessageEndRef.current) {
        llamaMessageEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [llamaMessages]);


    // --- Always-on Voice Conversation with VAD ---

    // --- AudioWorkletNode-based VAD for always-on voice conversation ---
    const [llamaMicActive, setLlamaMicActive] = useState(false);
    const llamaMediaRecorder = useRef<MediaRecorder | null>(null);
    const llamaAudioChunks = useRef<Blob[]>([]);
    const llamaStreamRef = useRef<MediaStream | null>(null);
    const llamaAudioContext = useRef<AudioContext | null>(null);
    const llamaVADNode = useRef<AudioWorkletNode | null>(null);
  // Increase silence timeout for more natural speech
  const VAD_SILENCE_MS = 1200;
  // Lower threshold for more sensitivity
  const VAD_THRESHOLD = 0.015;
    let vadSilenceTimeout: ReturnType<typeof setTimeout> | null = null;

    // Helper functions for audio processing
    const createWavFromFloat32Array = (samples: Float32Array, sampleRate: number): Blob => {
      const buffer = new ArrayBuffer(44 + samples.length * 2);
      const view = new DataView(buffer);
      
      // Write WAV header
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      view.setUint32(4, 36 + samples.length * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      view.setUint32(16, 16, true);
      view.setUint16(20, 1, true);
      view.setUint16(22, 1, true);
      view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true);
      view.setUint16(32, 2, true);
      view.setUint16(34, 16, true);
      writeString(36, 'data');
      view.setUint32(40, samples.length * 2, true);
      
      // Write audio data
      const volume = 0.8;
      for (let i = 0; i < samples.length; i++) {
        const sample = Math.max(-1, Math.min(1, samples[i])) * volume;
        view.setInt16(44 + i * 2, sample * 0x7FFF, true);
      }
      
      return new Blob([buffer], { type: 'audio/wav' });
    };

    // AudioWorkletProcessor code as a string
    const vadWorkletProcessor = `
      class VADProcessor extends AudioWorkletProcessor {
        constructor() {
          super();
        }
        process(inputs, outputs, parameters) {
          const input = inputs[0][0];
          if (!input) return true;
          let sum = 0;
          for (let i = 0; i < input.length; i++) sum += input[i] * input[i];
          const rms = Math.sqrt(sum / input.length);
          this.port.postMessage(rms);
          return true;
        }
      }
      registerProcessor('vad-processor', VADProcessor);
    `;

    const startLlamaVoiceConversation = async () => {
      if (llamaMicActive) return;
      setLlamaMicActive(true);
      llamaAudioChunks.current = [];
      let speechStartTime = 0;
      let isProcessing = false;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        llamaStreamRef.current = stream;
        llamaAudioContext.current = new window.AudioContext();
        // Dynamically add the worklet
        const blob = new Blob([vadWorkletProcessor], { type: 'application/javascript' });
        const url = URL.createObjectURL(blob);
        await llamaAudioContext.current.audioWorklet.addModule(url);
        const source = llamaAudioContext.current.createMediaStreamSource(stream);
        const vadNode = new window.AudioWorkletNode(llamaAudioContext.current, 'vad-processor');
        llamaVADNode.current = vadNode;
        source.connect(vadNode);

        let isRecording = false;
        let recorder: MediaRecorder | null = null;

        // Track consecutive speech frames for VAD
        let consecutiveSpeechFrames = 0;
        
        vadNode.port.onmessage = (event) => {
          const rms = event.data;
          const now = Date.now();
          
          if (rms > VAD_THRESHOLD) {
            consecutiveSpeechFrames++;
            console.log('[VAD] Speech detected. RMS:', rms, 'Frames:', consecutiveSpeechFrames);
          } else {
            consecutiveSpeechFrames = 0;
            console.log('[VAD] Silence. RMS:', rms);
          }
          
          // Only start recording if we have enough consecutive speech frames
          if (rms > VAD_THRESHOLD && consecutiveSpeechFrames >= 30) { // About 1 second of speech
            if (!isRecording) {
              console.log('[VAD] Speech confirmed', {rms, threshold: VAD_THRESHOLD, frames: consecutiveSpeechFrames});
              speechStartTime = now;
              isRecording = true;
              llamaAudioChunks.current = [];
              
              // Use standard MediaRecorder with optimal settings for STT
              const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
                ? 'audio/webm;codecs=opus'
                : 'audio/webm';
                
              recorder = new MediaRecorder(stream, {
                mimeType: mimeType,
                audioBitsPerSecond: 16000
              });
              
              let audioBuffer = new Float32Array(0);
              const sampleRate = 16000;
              
              recorder.ondataavailable = async (ev) => {
                if (ev.data.size > 0) {
                  llamaAudioChunks.current.push(ev.data);
                  
                  // Convert to WAV and send to STT every 2 seconds
                  if (!isProcessing && llamaAudioChunks.current.length >= 8) { // 8 chunks * 250ms = 2sec
                    isProcessing = true;
                    const blob = new Blob(llamaAudioChunks.current, { type: 'audio/webm' });
                    console.log('[VAD] Processing audio chunk, size:', blob.size, 'chunks:', llamaAudioChunks.current.length);
                    
                    if (blob.size < 1000) {
                      console.log('[VAD] Audio chunk too small, skipping');
                      isProcessing = false;
                      return;
                    }
                    
                    try {
                      const transcript = await googleSTT(blob, llamaLanguage);
                      console.log('[VAD] Got transcript:', transcript);
                      
                      // Only process meaningful transcripts
                      if (transcript && 
                          transcript.trim() && 
                          transcript !== 'STT: No transcript.' &&
                          transcript.length > 2) { // Ignore very short transcripts
                        setLlamaInputText(transcript);
                        await handleLlamaSendMessage(transcript);
                      }
                    } catch (error) {
                      console.error('[VAD] STT error:', error);
                      // If we get an error, clear the audio chunks to start fresh
                      llamaAudioChunks.current = [];
                    }
                    
                    isProcessing = false;
                    llamaAudioChunks.current = [];
                  }
                }
              };
              
              recorder.start(250); // Collect audio in 250ms chunks
              
              // Create audio context for processing
              const audioCtx = new AudioContext();
              const source = audioCtx.createMediaStreamSource(stream);
              const processor = audioCtx.createScriptProcessor(4096, 1, 1);
              
              let audioData = new Float32Array(0);
              
              // Helper functions defined outside the block
              const createWavBlob = (samples: Float32Array, sampleRate: number): Blob => {
                const buffer = new ArrayBuffer(44 + samples.length * 2);
                const view = new DataView(buffer);
                
                const writeString = (view: DataView, offset: number, str: string): void => {
                  for (let i = 0; i < str.length; i++) {
                    view.setUint8(offset + i, str.charCodeAt(i));
                  }
                };
                
                // Write WAV header
                writeString(view, 0, 'RIFF');
                view.setUint32(4, 36 + samples.length * 2, true);
                writeString(view, 8, 'WAVE');
                writeString(view, 12, 'fmt ');
                view.setUint32(16, 16, true);
                view.setUint16(20, 1, true);
                view.setUint16(22, 1, true);
                view.setUint32(24, sampleRate, true);
                view.setUint32(28, sampleRate * 2, true);
                view.setUint16(32, 2, true);
                view.setUint16(34, 16, true);
                writeString(view, 36, 'data');
                view.setUint32(40, samples.length * 2, true);
                
                // Write audio data
                const volume = 0.8;
                for (let i = 0; i < samples.length; i++) {
                  const sample = Math.max(-1, Math.min(1, samples[i])) * volume;
                  view.setInt16(44 + i * 2, sample * 0x7FFF, true);
                }
                
                return new Blob([buffer], { type: 'audio/wav' });
              };
              
              processor.onaudioprocess = (e: AudioProcessingEvent) => {
                const input = e.inputBuffer.getChannelData(0);
                const newData = new Float32Array(audioData.length + input.length);
                newData.set(audioData);
                newData.set(input, audioData.length);
                audioData = newData;
                
                // Process every 2 seconds of audio
                if (audioData.length > audioCtx.sampleRate * 2) {
                  if (!isProcessing) {
                    isProcessing = true;
                    
                    // Convert Float32Array to WAV
                    const wavBlob = createWavBlob(audioData, audioCtx.sampleRate);
                    
                    // Send to STT
                    googleSTT(wavBlob, llamaLanguage).then(transcript => {
                      if (transcript && transcript.trim()) {
                        console.log('[VAD] Real-time transcript:', transcript);
                        setLlamaInputText(transcript);
                        handleLlamaSendMessage(transcript);
                      }
                      isProcessing = false;
                    }).catch(error => {
                      console.error('[VAD] STT error:', error);
                      isProcessing = false;
                    });
                    
                    // Reset audio data
                    audioData = new Float32Array(0);
                  }
                }
              };
              
              source.connect(processor);
              processor.connect(audioCtx.destination);
              
              // Store cleanup function
              const cleanup = () => {
                source.disconnect();
                processor.disconnect();
                audioCtx.close();
                isRecording = false;
                isProcessing = false;
              };
              
              // Add cleanup to component
              console.log('[VAD] Started recording');
            }
            if (vadSilenceTimeout) clearTimeout(vadSilenceTimeout);
          } else if (isRecording) {
            if (vadSilenceTimeout) clearTimeout(vadSilenceTimeout);
            vadSilenceTimeout = setTimeout(() => {
              if (recorder && recorder.state !== 'inactive') {
                console.log('[VAD] Stop recording, will trigger onstop');
                recorder.stop();
                isRecording = false;
              }
            }, VAD_SILENCE_MS);
          }
        };
      } catch {
        setLlamaMicActive(false);
        alert('Could not access microphone.');
      }
    };

    const stopLlamaVoiceConversation = () => {
      setLlamaMicActive(false);
      if (llamaVADNode.current) {
        llamaVADNode.current.disconnect();
        llamaVADNode.current = null;
      }
      if (llamaAudioContext.current) {
        llamaAudioContext.current.close();
        llamaAudioContext.current = null;
      }
      if (llamaStreamRef.current) {
        llamaStreamRef.current.getTracks().forEach(track => track.stop());
        llamaStreamRef.current = null;
      }
    };

    // --- SmallChatbotUI with always-on voice conversation ---
    const SmallChatbotUI = () => {
      return (
        <div
          className="fixed top-8 right-8 z-50 w-80 max-w-[90vw] bg-white rounded-xl shadow-2xl border border-emerald-400 flex flex-col"
          style={{ height: 400, minHeight: 400, maxHeight: 400 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-emerald-500 rounded-t-xl">
            <span className="text-white font-semibold">Chatbot</span>
            <div className="flex items-center space-x-2">
              {/* Language selector */}
              <select
                className="px-2 py-1 rounded text-emerald-900 text-xs bg-white border border-emerald-200 focus:outline-none"
                value={llamaLanguage}
                onChange={e => setLlamaLanguage(e.target.value)}
                title="Select language for speech-to-text"
                style={{ minWidth: 80 }}
              >
                {GOOGLE_STT_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.label}</option>
                ))}
              </select>
              {/* Voice select modal trigger */}
              <button
                className="px-2 py-1 rounded bg-white text-emerald-700 border border-emerald-200 text-xs hover:bg-emerald-100"
                onClick={e => { e.preventDefault(); setIsVoiceModalOpen(true); }}
                title="Select WaveNet voice"
              >
                Voice
              </button>
            </div>
            {/* Modal */}
            {isVoiceModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6 w-96 max-w-full">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Select WaveNet Voice</h2>
                    <button onClick={() => setIsVoiceModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                  </div>
                  <GoogleTTSSelector onVoiceSelect={(voice: string) => {
                    setSelectedVoice(voice);
                    if (voice) {
                      setIsVoiceModalOpen(false);
                      console.log('Selected WaveNet voice:', voice);
                    }
                  }} />
                </div>
              </div>
            )}
          </div>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-2 bg-white"
            style={{ minHeight: 0 }}
          >
            {llamaMessages.length === 0 && (
              <div className="text-gray-400 text-sm text-center mt-8">Say hi to the chatbot!</div>
            )}
            {llamaMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`rounded-lg px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-emerald-100 text-emerald-900' : 'bg-emerald-50 text-emerald-700'}`}>{msg.content}</div>
              </div>
            ))}
            {llamaIsLoading && (
              <div className="flex justify-start"><div className="rounded-lg px-3 py-2 text-sm bg-emerald-50 text-emerald-700">Loading...</div></div>
            )}
            <div ref={llamaMessageEndRef} />
          </div>
          {/* Input & Mic Controls */}
          <form
            className="flex items-center gap-2 px-3 py-2 border-t border-emerald-100 bg-emerald-50 rounded-b-xl"
            onSubmit={e => { e.preventDefault(); handleLlamaSendMessage(llamaInputText); }}
          >
            <button
              type="button"
              className={`rounded-full w-9 h-9 flex items-center justify-center border ${llamaMicActive ? 'bg-emerald-200 border-emerald-400' : 'bg-white border-emerald-200'} mr-1`}
              style={{ outline: llamaMicActive ? '2px solid #10b981' : undefined }}
              onClick={() => {
                if (!llamaMicActive) startLlamaVoiceConversation();
                else stopLlamaVoiceConversation();
              }}
              title={llamaMicActive ? 'Stop voice conversation' : 'Start voice conversation'}
              tabIndex={-1}
            >
              {llamaMicActive ? (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="#10b981"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#10b981" strokeWidth="1.5"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg>
              )}
            </button>
            <input
              type="text"
              className="flex-1 px-3 py-2 rounded bg-white border border-emerald-200 text-emerald-900 placeholder:text-emerald-400 focus:outline-none text-sm"
              placeholder={llamaMicActive ? 'Listening...' : 'Type a message...'}
              value={llamaInputText}
              onChange={e => setLlamaInputText(e.target.value)}
              disabled={llamaMicActive}
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-50"
              disabled={llamaIsLoading || !llamaInputText.trim() || llamaMicActive}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </form>
        </div>
      );
    };
  // --- WebRTC recording logic ---
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Start recording
  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        const recorder = new MediaRecorder(stream);
        mediaRecorder.current = recorder;
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            // Send audio data to server or process it
          }
        };
        recorder.onstop = () => {
          setIsRecording(false);
          stream.getTracks().forEach((track) => track.stop());
        };
        recorder.start();
        setIsRecording(true);
      })
      .catch(() => {
        alert('Could not access microphone.');
      });
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      mediaRecorder.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  // --- WebSocket for real-time audio streaming ---
  const wsRef = useRef<WebSocket | null>(null);
  const [isWSConnected, setIsWSConnected] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');

  // Connect to WebSocket server (update ws://localhost:8001 as needed)
  const connectWebSocket = () => {
    if (wsRef.current && (wsRef.current.readyState === 1 || wsRef.current.readyState === 0)) return;
    const ws = new WebSocket('ws://localhost:8001');
    wsRef.current = ws;
    ws.onopen = () => setIsWSConnected(true);
    ws.onclose = () => setIsWSConnected(false);
    ws.onerror = () => setIsWSConnected(false);
    ws.onmessage = (event) => {
      // Expect server to send back JSON: { text: "..." }
      try {
        if (typeof event.data === 'string' && event.data.trim().length > 0) {
          const data = JSON.parse(event.data);
          if (data.text) setLiveTranscript(data.text);
        }
      } catch (err) {
        console.error('WebSocket message JSON parse error:', err, 'Data:', event.data);
      }
    };
  };

  // --- Real-time recording and streaming logic ---
  const startStreamingRecording = () => {
    connectWebSocket();
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0 && wsRef.current && wsRef.current.readyState === 1) {
            wsRef.current.send(e.data);
          }
        };
        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
          if (wsRef.current && wsRef.current.readyState === 1) wsRef.current.send(JSON.stringify({ done: true }));
        };
        mediaRecorder.start(250); // send audio chunks every 250ms
      })
      .catch(() => {
        alert('Could not access microphone.');
      });
  };

  const stopStreamingRecording = () => {
    // ...existing code...
  };
  // WebRTC audio function removed as requested
  // --- STT mic logic hooks (must be at top level) ---
  // (Removed old recording logic, now only using WebRTC)
  // State to show fetched content box next to chat UI
  const [fetchedContent, setFetchedContentState] = useState<string | null>(null);
  // Style 5 mic icon map
  const MIC_ICON_MAP: Record<string, (color?: string) => React.ReactNode> = {
    default: (color = '#10b981') => (
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={color} strokeWidth="1.5"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/><path d="M15 8a3 3 0 0 1-6 0"/></svg>
    ),
    'circle-bg': () => (
      <span className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#fff" strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span>
    ),
    'square-bg': () => (
      <span className="w-8 h-8 bg-blue-500 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#fff" strokeWidth="2"><rect x="6" y="4" width="12" height="12" rx="3"/><rect x="10" y="7" width="4" height="7" rx="2"/><path d="M12 18v2"/></svg></span>
    ),
    shadow: (color = '#10b981') => (
      <span className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="1.5"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span>
    ),
    bordered: (color = '#10b981') => (
      <span className="w-8 h-8 rounded-full border-2 border-emerald-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="1.5"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/><path d="M8 22h8"/></svg></span>
    ),
    pill: (color = '#10b981') => (
      <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="8" y="6" width="8" height="8" rx="4"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>
    ),
    outline: (color = '#10b981') => (
      <span className="w-8 h-8 border-2 border-blue-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>
    ),
    'double-border': (color = '#10b981') => (
      <span className="w-8 h-8 border-4 border-double border-emerald-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>
    ),
    hex: (color = '#10b981') => (
      <span className="w-8 h-8 flex items-center justify-center" style={{clipPath:'polygon(25% 6%,75% 6%,100% 50%,75% 94%,25% 94%,0% 50%)'}}><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="9" y="4" width="6" height="10" rx="3"/><path d="M12 18v2"/></svg></span>
    ),
    triangle: (color = '#10b981') => (
      <span className="w-8 h-8 flex items-center justify-center" style={{clipPath:'polygon(50% 0%,0% 100%,100% 100%)'}}><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
    diamond: (color = '#10b981') => (
      <span className="w-8 h-8 flex items-center justify-center" style={{clipPath:'polygon(50% 0%,100% 50%,50% 100%,0% 50%)'}}><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
    star: (color = '#10b981') => (
      <span className="w-8 h-8 flex items-center justify-center" style={{clipPath:'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'}}><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
    'rounded-square': (color = '#10b981') => (
      <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>
    ),
    'circle-outline': (color = '#10b981') => (
      <span className="w-8 h-8 rounded-full border-2 border-blue-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
    dashed: (color = '#10b981') => (
      <span className="w-8 h-8 rounded-lg border-2 border-dashed border-emerald-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
    'shadowed-square': (color = '#10b981') => (
      <span className="w-8 h-8 rounded-lg shadow-lg flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>
    ),
    'bordered-square': (color = '#10b981') => (
      <span className="w-8 h-8 rounded-lg border-2 border-emerald-400 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="8" y="6" width="8" height="8" rx="2"/><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>
    ),
    'circle-shadow': (color = '#10b981') => (
      <span className="w-8 h-8 rounded-full shadow-lg flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
    minimal: (color = '#10b981') => (
      <span className="w-8 h-8 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke={color} strokeWidth="2"><rect x="11" y="8" width="2" height="6" rx="1"/></svg></span>
    ),
    filled: (color = '#10b981') => (
      <span className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-8 h-8" fill={color} stroke={color} strokeWidth="2"><rect x="10" y="6" width="4" height="8" rx="2"/><path d="M12 16v2"/></svg></span>
    ),
  };

  // Style 5 bot icon map
  const BOT_ICON_MAP: Record<string, React.ReactNode> = {
    bot1: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="6" y="9" width="12" height="7" rx="3.5" /><circle cx="9" cy="13" r="1" /><circle cx="15" cy="13" r="1" /><rect x="10.5" y="6" width="3" height="3" rx="1.5" /><path d="M12 3v3" /></svg>),
    bot2: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="5" y="8" width="14" height="7" rx="3.5" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><path d="M12 15v2.5l-2 1.5" /></svg>),
    bot3: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /><path d="M12 9V5M12 5l2-2M12 5l-2-2" /></svg>),
    bot4: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="9" width="10" height="7" rx="3" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /><path d="M11 15h2" /></svg>),
    bot5: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="8" y="10" width="8" height="6" rx="2.5" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /><circle cx="8" cy="10" r="0.7" /><circle cx="16" cy="10" r="0.7" /></svg>),
    bot6: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="13" r="5" /><rect x="9" y="11.5" width="6" height="2" rx="1" /><path d="M12 8v-2" /></svg>),
    bot7: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><polygon points="12,5 19,9 19,16 12,20 5,16 5,9" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
    bot8: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="0.7" ry="1.2" /><ellipse cx="14" cy="13" rx="0.7" ry="1.2" /></svg>),
    bot9: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="9" width="10" height="7" rx="1" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
    bot10: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="10" width="10" height="6" rx="2" /><rect x="9" y="7" width="6" height="3" rx="1.5" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
    bot11: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="1" ry="1.5" /><ellipse cx="14" cy="13" rx="1" ry="1.5" /><path d="M12 9v-2" /></svg>),
    bot12: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="10" width="10" height="6" rx="2" /><path d="M9 10l3-3 3 3" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
    bot13: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="8" y="10" width="8" height="6" rx="2.5" /><path d="M8 10l-2-2M16 10l2-2" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /></svg>),
    bot14: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="8" y="10" width="8" height="6" rx="2.5" /><path d="M8 10l-2-1M16 10l2-1" /><circle cx="10" cy="13" r="0.8" /><circle cx="14" cy="13" r="0.8" /></svg>),
    bot15: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><circle cx="12" cy="13" r="6" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /></svg>),
    bot16: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="10" width="10" height="6" rx="2" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /><path d="M17 13h2" /></svg>),
    bot17: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="1.2" ry="1.2" /><ellipse cx="14" cy="13" rx="1.2" ry="1.2" /><path d="M12 9v-3" /></svg>),
    bot18: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="10" width="10" height="6" rx="2" /><circle cx="10" cy="13" r="1" /><circle cx="14" cy="13" r="1" /><path d="M10 15c1 1 3 1 4 0" /></svg>),
    bot19: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><rect x="7" y="12" width="10" height="4" rx="2" /><circle cx="10" cy="14" r="1" /><circle cx="14" cy="14" r="1" /></svg>),
    bot20: (<svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="#3b82f6" strokeWidth="2"><ellipse cx="12" cy="13" rx="6" ry="4" /><ellipse cx="10" cy="13" rx="1" ry="1.5" /><ellipse cx="14" cy="13" rx="1" ry="1.5" /><path d="M10 15c1 1 3 1 4 0" /></svg>),
  };
  const [config, setConfig] = useState<any>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  // Track which view is active: 'widget', 'chat', or 'voice'
  const [activeView, setActiveView] = useState<'widget' | 'chat' | 'voice'>('widget');

  useEffect(() => {
    const fetchConfig = async () => {
      setLoadingConfig(true);
      try {
        const res = await fetch(`/api/get-ui-design?designId=${designId}`);
        const data = await res.json();
        setConfig(data.config || null);
      } catch {
        setConfig(null);
      } finally {
        setLoadingConfig(false);
      }
    };
    fetchConfig();
  }, [designId]);

  // Cleanup effect for microphone
  useEffect(() => {
    // Cleanup function
    return () => {
      // STT mic cleanup removed
    };
  }, []);

  // Additional effect to ensure mic state stays in sync
  useEffect(() => {
  // STT mic cleanup removed
  }, [micActive]);

  // Listen for chatbot fetched content in responses
  const lastFetchedContentRef = useRef<string | null>(null);

  // Microphone control functions
  // Store both MediaRecorder and MediaStream references

  // STT mic logic removed

  // STT mic logic removed

  // STT mic logic removed

  // Accepts content, intent, url
  const setFetchedContent = (content: string, intent?: string, url?: string) => {
    if (content && content !== lastFetchedContentRef.current) {
      lastFetchedContentRef.current = content;
      setFetchedContentState(content);
      if (onFetchedContent) onFetchedContent({ content, intent, url });
      // Also dispatch a custom event for legacy support
      window.dispatchEvent(new CustomEvent('fetched-content', { detail: { content, intent, url } }));
    }
  };

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const callAssistantAPI = async (text: string): Promise<string> => {
    try {
      const res = await fetch('/api/chatbot-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, designId }),
      });
      const data = await res.json();
      if (data.fetchedContent) setFetchedContent(data.fetchedContent, data.debug?.matchedIntent, data.debug?.foundUrl);
      if (data.response) return data.response;
    return 'Sorry, no response.' as string;
    } catch {
      return 'Error contacting AI.';
    }
  };

  // Main Chat UI send handler with TTS
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { role: "user" as "user", content: text, timestamp: new Date() }]);
    setInputText("");
    setIsLoading(true);
    try {
      const response = await callAssistantAPI(text);
      setMessages((prev) => {
  const newMsgs = [...prev, { role: "assistant" as "assistant", content: response, timestamp: new Date() }];
  // TTS playback removed from main chat UI
        return newMsgs;
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingConfig) return <div className="text-white text-xl p-12">Loading...</div>;
  if (!config) return <div className="text-white text-xl p-12">Design not found.</div>;

  // Import VoiceCallContainer directly from the voicecall component
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { VoiceCallContainer } = require("@/app/agent/components/voicecall");
  // If VoiceCallContainer is not exported as named, fallback to default
  const VoiceCall = VoiceCallContainer || require("@/app/agent/components/voicecall").default || (() => null);

  // Widget box UI (bottom right corner) using config.wedgetBox
  const WidgetBox = () => {
    const w = config.wedgetBox || {};
    if (!w.selectedChatbotLogo && !w.selectedVoiceBotLogo && !w.inputBarPlaceholder && !w.style2BtnColor && !w.style5MicIconStyle && !w.style5BotIconStyle && typeof w.inputBarStyle !== 'number') return null;
    // Merge style props to avoid duplicate 'style' key
    let baseStyle = w.customBgColor ? { background: w.customBgColor } : {};
    let borderClass = 'border border-white/10';
    if (w.hideBg === true) {
      baseStyle = { background: 'transparent' };
      borderClass = '';
    }
    const style1Extra = w.selectedStyle === "Style 1" ? { cursor: 'pointer' } : {};
    const mergedStyle = { ...baseStyle, ...style1Extra };
    return (
      <div className="fixed bottom-8 left-8 z-10">
        <div
          className={`flex flex-col items-center justify-center ${w.selectedShape || ''} ${w.wedgetBoxSize || ''} shadow-2xl ${borderClass}`}
          style={mergedStyle}
        >
          <div className="flex items-center w-full gap-2 px-4 py-2 justify-center">
            {/* Style 2: Voice chat button left, bot logo right */}
            {w.selectedStyle === "Style 2" && (
              <>
                {w.style2BtnColor && (
                  <button
                    className={`${w.style2BtnShape || ''} ${w.style2BtnSizeClass || ''} font-semibold flex items-center gap-1 shadow cursor-pointer`}
                    style={{ background: w.style2BtnColor, color: w.style2BtnTextColor || '' }}
                    onClick={() => setActiveView('voice')}
                  >
                    {/* Use saved mic icon style if available, else default */}
                    {MIC_ICON_MAP[w.style5MicIconStyle || 'default'](w.style5BotIconColor || '#10b981')}
                    Voice chat
                  </button>
                )}
                {w.selectedChatbotLogo && (
                  <img
                    src={w.selectedChatbotLogo}
                    alt="Chatbot"
                    className={`${w.logoShape || ''} ${w.style5LogoSize || ''} border-2 cursor-pointer`}
                    onClick={() => setActiveView('chat')}
                    style={w.style5BotIconColor ? { borderColor: w.style5BotIconColor } : {}}
                  />
                )}
              </>
            )}
            {/* Style 3: Bot logo left, voice chat button right */}
            {w.selectedStyle === "Style 3" && (
              <>
                {w.selectedChatbotLogo && (
                  <img
                    src={w.selectedChatbotLogo}
                    alt="Chatbot"
                    className={`${w.logoShape || ''} ${w.style5LogoSize || ''} border-2 cursor-pointer`}
                    onClick={() => setActiveView('chat')}
                    style={w.style5BotIconColor ? { borderColor: w.style5BotIconColor } : {}}
                  />
                )}
                {w.style2BtnColor && (
                  <button
                    className={`${w.style2BtnShape || ''} ${w.style2BtnSizeClass || ''} font-semibold flex items-center gap-1 shadow cursor-pointer`}
                    style={{ background: w.style2BtnColor, color: w.style2BtnTextColor || '' }}
                    onClick={() => setActiveView('voice')}
                  >
                    {/* Use saved mic icon style if available, else default */}
                    {MIC_ICON_MAP[w.style5MicIconStyle || 'default'](w.style5BotIconColor || '#10b981')}
                    Voice chat
                  </button>
                )}
              </>
            )}
            {/* Default: fallback to previous layout for other styles */}
            {w.selectedStyle !== "Style 2" && w.selectedStyle !== "Style 3" && (
              <>
                {/* Style 1: input bar left, voicebot logo right */}
                {w.selectedStyle === "Style 1" ? (
                  <div className="flex w-full items-center gap-2 justify-between">
                    {/* Input bar left */}
                    {typeof w.inputBarStyle === 'number' && (
                      <div
                        style={(() => {
                          // Map wedgetBoxSize to input bar width
                          let width = '180px';
                          if (w.wedgetBoxSize?.includes('w-[300px]')) width = '260px';
                          else if (w.wedgetBoxSize?.includes('w-[320px]')) width = '280px';
                          else if (w.wedgetBoxSize?.includes('w-[250px]')) width = '220px';
                          else if (w.wedgetBoxSize?.includes('w-[230px]')) width = '200px';
                          return { maxWidth: width, width: '100%' };
                        })()}
                      >
                        {(() => {
                          // 20 input bar styles, matching sidebar
                          const inputBarStyles = [
                            { className: "w-full px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 border-b-2 border-emerald-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-3 py-1 rounded-full bg-emerald-900/30 border-none text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-none bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-xl border-4 border-double border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-lg border-2 border-dashed border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-xl border-2 border-emerald-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-none bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg", style: { minWidth: 0 } },
                            { className: "w-full px-3 py-1 rounded-full bg-white/10 border-2 border-emerald-400 text-white placeholder:text-white/40 focus:outline-none text-sm shadow", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-full border-4 border-blue-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/40 focus:outline-none text-sm shadow", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-xl border-2 border-transparent bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0, backgroundImage: 'linear-gradient(white, white), linear-gradient(90deg, #10b981, #3b82f6)', backgroundClip: 'padding-box, border-box', backgroundOrigin: 'padding-box, border-box' } },
                            { className: "w-full px-2 py-1 rounded bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-inner", style: { minWidth: 0 } },
                            { className: "w-full px-4 py-2 rounded-full bg-emerald-900/30 border-2 border-emerald-400 text-white placeholder:text-white/40 focus:outline-none text-base", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 border-b-2 border-blue-400 bg-transparent text-white placeholder:text-white/40 focus:outline-none text-sm shadow", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-none border-4 border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-3 py-1 rounded-full border-2 border-dashed border-blue-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm", style: { minWidth: 0 } },
                            { className: "w-full px-2 py-1 rounded-xl border-2 border-emerald-400 bg-white/10 text-white placeholder:text-white/40 focus:outline-none text-sm shadow-lg", style: { minWidth: 0 } },
                          ];
                          const idx = Math.max(0, Math.min(19, w.inputBarStyle));
                          const styleObj = inputBarStyles[idx];
                          // Use inputBorderLineColor from Firestore config
                          const borderColor = w.inputBorderLineColor || '#10b981';
                          // Determine if style uses border or border-bottom
                          let style: React.CSSProperties = { ...styleObj.style, cursor: 'pointer' };
                          if (styleObj.className.includes('border-b-2')) {
                            (style as React.CSSProperties).borderBottomColor = borderColor;
                          } else if (styleObj.className.includes('border')) {
                            (style as React.CSSProperties).borderColor = borderColor;
                          }
                          if (w.inputBarColor) {
                            (style as React.CSSProperties).background = w.inputBarColor;
                          }
                          return (
                            <input
                              type="text"
                              className={styleObj.className + (w.inputBarColor ? ` ${w.inputBarColor}` : "")}
                              style={style}
                              placeholder={w.inputBarPlaceholder || 'Type here...'}
                              onClick={() => setActiveView('chat')}
                              onFocus={() => setActiveView('chat')}
                              onMouseDown={() => setActiveView('chat')}
                              value={inputText}
                              onChange={e => setInputText(e.target.value)}
                            />
                          );
                        })()}
                      </div>
                    )}
                    {/* Voicebot logo right */}
                    {w.selectedVoiceBotLogo && (
                      <img
                        src={w.selectedVoiceBotLogo}
                        alt="Voicebot"
                        className={`${w.logoShape || ''} ${w.style5LogoSize || ''} border-2 cursor-pointer`}
                        onClick={e => {
                          e.stopPropagation();
                          setActiveView('voice');
                          // Auto-start mic when voice chat logo is clicked
                          setTimeout(() => {
                            // ...existing code...
                          }, 100);
                          console.log('Voicebot logo clicked, activeView set to voice and mic started');
                        }}
                        style={w.style5BotIconColor ? { borderColor: w.style5BotIconColor } : {}}
                      />
                    )}
                  </div>
                ) : (
                  <>
                    {/* Chatbot logo/icon: open chat UI */}
                    {w.selectedChatbotLogo && (
                      <img
                        src={w.selectedChatbotLogo}
                        alt="Chatbot ui"
                        className={`${w.logoShape || ''} ${w.style5LogoSize || ''} border-2 cursor-pointer`}
                        onClick={() => setActiveView('chat')}
                      />
                    )}
                    {/* Voice chat button/icon: open voice bot UI */}
                    {w.style2BtnColor && (
                      <button
                        className={`${w.style2BtnShape || ''} ${w.style2BtnSizeClass || ''} font-semibold flex items-center gap-1 shadow cursor-pointer`}
                        style={{ background: w.style2BtnColor, color: w.style2BtnTextColor || '' }}
                        onClick={() => setActiveView('voice')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18c2.21 0 4-1.79 4-4V7a4 4 0 10-8 0v7c0 2.21 1.79 4 4 4zm0 0v2m-4 0h8" />
                        </svg>
                        Voice chat
                      </button>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Always render all UIs so small chat box is always visible
  const renderVoiceBox = () => {
    if (activeView === 'voice' && config.voiceBotBox) {
      const v = config.voiceBotBox || {};
      return (
        <div className="fixed bottom-8 right-8 z-20">
          {VoiceCall ? (
            <VoiceCall
              sizeClass={v.sizeClass}
              shapeClass={v.shapeClass}
              customBgColor={v.customBgColor}
              videoSrc={v.videoSrc}
              disconnectBtnSize={v.disconnectBtnSize}
              disconnectBtnColor={v.disconnectBtnColor}
              disconnectBtnTextColor={v.disconnectBtnTextColor}
              disconnectBtnIconStyle={v.disconnectBtnIconStyle}
            />
          ) : (
            <div className="bg-black/80 text-white p-8 rounded-xl">Voice Bot UI not available</div>
          )}

        </div>
      );
    }
    return null;
  };

  const renderChatBox = () => {
    if (activeView === 'chat') {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-r from-black via-blue-950 to-gray-900">
          <div className="flex flex-row items-start">
            <div className="flex flex-col h-[500px] w-[450px] rounded-xl overflow-hidden shadow-2xl border border-white/10"
              style={{ background: config.customBgColor || undefined }}>
              {/* Header */}
              <div className={`p-4 border-b border-white/10 flex items-center justify-between ${config.selectedHeaderStyle} ${config.selectedHeaderColor}`}
                style={config.customHeaderColor ? { background: config.customHeaderColor } : {}}>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 p-[1px] bg-black/30 backdrop-blur flex items-center justify-center ${config.selectedHeaderStyle}`}>
                    <span className="text-white">🤖</span>
                  </div>
                  <button className="px-3 py-2 rounded-lg bg-black/30 backdrop-blur text-white hover:bg-black/40 transition-colors" onClick={() => setIsVoiceModalOpen(true)}>
                    Select Voice
                  </button>
                  {isVoiceModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white rounded-lg p-6 w-96 max-w-full">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold">Select WaveNet Voice</h2>
                          <button onClick={() => setIsVoiceModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                        </div>
                        <GoogleTTSSelector onVoiceSelect={(voice) => {
                          setSelectedVoice(voice);
                          setIsVoiceModalOpen(false);
                        }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] ${config.selectedResponseCardStyle?.className || ''} ${config.selectedResponseCardStyle?.shape || ''}`}
                      style={config.selectedTextColor === 'custom' && config.customTextColor ? { color: config.customTextColor } : {}}
                    >
                      <span className={config.selectedResponseCardStyle?.textClass || ''}>{message.content}</span>
                      <div className="text-xs text-white/40 mt-1 text-right">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className={`max-w-[80%] ${config.selectedResponseCardStyle?.className || ''} ${config.selectedResponseCardStyle?.shape || ''}`}>Loading...</div>
                  </div>
                )}
                <div ref={messageEndRef} />
              </div>
              {/* Input Bar */}
              <form
                className={`p-4 flex items-center gap-2 border-t border-white/10 ${config.selectedFooterStyle} ${config.selectedFooterColor}`}
                style={config.customFooterColor ? { background: config.customFooterColor } : {}}
                onSubmit={e => {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }}
                onClick={() => setActiveView('chat')}
              >
                <div style={{position: 'relative', width: '100%'}} className="flex items-center gap-2">
                  <input
                    type="text"
                    className={`flex-1 px-4 py-2 bg-transparent text-white outline-none ${config.selectedInputBarStyle?.class || ''} ${config.selectedInputBarColor}`}
                    style={config.customInputBarColor ? { background: config.customInputBarColor } : {}}
                    placeholder={micActive ? 'Listening...' : (config.inputPlaceholder || 'Type here...')}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    onFocus={() => setActiveView('chat')}
                    onMouseDown={() => setActiveView('chat')}
                  />
                  {/* Mic button removed */}
                </div>
                <button
                  type="submit"
                  className={`${config.selectedSendButtonStyle?.class || ''} ml-2`}
                  style={config.customSendButtonColor ? { background: config.customSendButtonColor, borderColor: config.customSendButtonColor } : {}}
                  disabled={isLoading || !inputText.trim()}
                >
                  <span>➤</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <>
  <WidgetBox />
  {renderVoiceBox()}
  {/* Only render one chat UI at a time to prevent double TTS requests */}
  {activeView === 'chat' ? renderChatBox() : null}
  {activeView === 'widget' ? <SmallChatbotUI /> : null}
    </>
  );
}
