"use client";

import React, { useState, useRef, useEffect } from 'react';
import { VoiceCallContainer } from "@/app/agent/components/voicecall";

export default function RenderVoice({ config }: { config?: any }) {
  // --- WebRTC + VAD recording logic ---
  const vadStreamRef = useRef<MediaStream | null>(null);
  const vadAudioContextRef = useRef<AudioContext | null>(null);
  const vadSourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const vadAnalyserRef = useRef<AnalyserNode | null>(null);
  const vadSilenceStartRef = useRef<number | null>(null);
  const vadChunksRef = useRef<Blob[]>([]);
  const vadMediaRecorderRef = useRef<MediaRecorder | null>(null);
  const vadIsRecordingRef = useRef(false);
  const [micLoading, setMicLoading] = useState(false);
  const [isWSConnected, setIsWSConnected] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const wsRef = useRef<WebSocket | null>(null);

  // WebRTC + VAD recording start function
  const startWebRTCVADRecording = () => {
    if (!window.localStorage.getItem('micPromptShown')) {
      const allow = window.confirm(
        'To use voice features, please allow microphone access in your browser when prompted.\n\nClick OK to continue and grant access.'
      );
      window.localStorage.setItem('micPromptShown', '1');
      if (!allow) return;
    }
    setMicLoading(true);
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        vadStreamRef.current = stream;
        vadIsRecordingRef.current = true;
        setMicLoading(false);
        vadChunksRef.current = [];
        
        const mediaRecorder = new MediaRecorder(stream);
        vadMediaRecorderRef.current = mediaRecorder;
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) vadChunksRef.current.push(e.data);
        };
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(vadChunksRef.current, { type: 'audio/wav' });
          vadChunksRef.current = [];

          if (audioBlob.size > 1000) {
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.onloadedmetadata = async () => {
              if (audio.duration < 1) {
                alert("Please speak a bit longer.");
                return;
              }
              try {
                const text = await transcribeAudioWithElevenLabs(audioBlob);
                const isSoundLabel = /^\s*\([^)]+\)\s*$/i.test(text.trim()) ||
                  text.toLowerCase().includes('beeping sound') ||
                  text.toLowerCase().includes('beep') ||
                  /\.\.\./g.test(text);

                if (
                  text &&
                  !isSoundLabel &&
                  /([a-zA-Z]{2,}\s+){1,}[a-zA-Z]{2,}/.test(text.trim()) &&
                  !/(background noise|notification sound|system sound)/i.test(text)
                ) {
                  // Handle the transcribed text as needed
                  console.log("Transcribed text:", text);
                }
              } catch (err: any) {
                let msg = "Failed to transcribe audio.";
                if (err && err.message && err.message.includes('audio_too_short')) {
                  msg = "Audio is too short. Please speak a bit longer.";
                }
                alert(msg);
              }
            };
            audio.load();
          }
        };
        mediaRecorder.start();

        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        vadAudioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        vadSourceNodeRef.current = source;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        vadAnalyserRef.current = analyser;
        source.connect(analyser);
        vadSilenceStartRef.current = null;

        function vadLoop() {
          const data = new Uint8Array(analyser.fftSize);
          analyser.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const val = (data[i] - 128) / 128;
            sum += val * val;
          }
          const rms = Math.sqrt(sum / data.length);
          const threshold = 0.03;
          if (rms < threshold) {
            if (vadSilenceStartRef.current === null) vadSilenceStartRef.current = Date.now();
            if (Date.now() - vadSilenceStartRef.current > 1000) {
              if (vadMediaRecorderRef.current && vadMediaRecorderRef.current.state !== 'inactive') {
                const currentRecorder = vadMediaRecorderRef.current;
                currentRecorder.stop();

                const newRecorder = new MediaRecorder(vadStreamRef.current!);
                vadMediaRecorderRef.current = newRecorder;
                newRecorder.ondataavailable = currentRecorder.ondataavailable;
                newRecorder.onstop = currentRecorder.onstop;
                newRecorder.start();
              }
            }
          } else {
            vadSilenceStartRef.current = null;
          }
          requestAnimationFrame(vadLoop);
        }
        vadLoop();
      })
      .catch((err) => {
        setMicLoading(false);
        console.error('Microphone access error:', err);
        let msg = 'Could not access microphone.';
        if (err && err.message) {
          msg += '\n' + err.message;
        }
        alert(msg);
      });
  };

  // Stop VAD and clean up
  const stopWebRTCVAD = () => {
    if (vadStreamRef.current) {
      vadStreamRef.current.getTracks().forEach(track => track.stop());
      vadStreamRef.current = null;
    }
    if (vadAudioContextRef.current) {
      vadAudioContextRef.current.close();
      vadAudioContextRef.current = null;
    }
    if (vadSourceNodeRef.current) {
      vadSourceNodeRef.current.disconnect();
      vadSourceNodeRef.current = null;
    }
    if (vadAnalyserRef.current) {
      vadAnalyserRef.current.disconnect();
      vadAnalyserRef.current = null;
    }
    if (vadMediaRecorderRef.current && vadMediaRecorderRef.current.state !== 'inactive') {
      vadMediaRecorderRef.current.stop();
      vadMediaRecorderRef.current = null;
    }
    vadIsRecordingRef.current = false;
  };

  // Connect to WebSocket server
  const connectWebSocket = () => {
    if (wsRef.current && (wsRef.current.readyState === 1 || wsRef.current.readyState === 0)) return;
    const ws = new WebSocket('ws://localhost:8001');
    wsRef.current = ws;
    ws.onopen = () => setIsWSConnected(true);
    ws.onclose = () => setIsWSConnected(false);
    ws.onerror = () => setIsWSConnected(false);
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.text) setLiveTranscript(data.text);
      } catch {}
    };
  };

  // ElevenLabs STT configuration
  const ELEVENLABS_STT_API_URL = "https://api.elevenlabs.io/v1/speech-to-text";
  const ELEVENLABS_API_KEY = "YOUR_API_KEY"; // Replace with your API key
  const sttLanguage = "en";

  const transcribeAudioWithElevenLabs = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");
    formData.append("model_id", "scribe_v1");
    formData.append("language", sttLanguage);
    formData.append("output_format", "text");
    const response = await fetch(ELEVENLABS_STT_API_URL, {
      method: "POST",
      headers: { "xi-api-key": ELEVENLABS_API_KEY },
      body: formData,
    });
    if (!response.ok) throw new Error(await response.text() || "Failed to transcribe audio");
    const result = await response.json();
    return result.text || "";
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebRTCVAD();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  if (!config?.voiceBotBox) return null;

  const v = config.voiceBotBox;
  return (
    <div className="fixed right-8 z-20" style={{ bottom: '2rem', position: 'fixed' }}>
      {VoiceCallContainer ? (
        <VoiceCallContainer
          sizeClass={v.sizeClass}
          shapeClass={v.shapeClass}
          customBgColor={v.customBgColor}
          videoSrc={v.videoSrc}
          disconnectBtnSize={v.disconnectBtnSize}
          disconnectBtnColor={v.disconnectBtnColor}
          disconnectBtnTextColor={v.disconnectBtnTextColor}
          disconnectBtnIconStyle={v.disconnectBtnIconStyle}
          onStartRecording={startWebRTCVADRecording}
          onStopRecording={() => {
            stopWebRTCVAD();
            console.log('Stopping voice recording and sending close message'); // Debug log
            // Send close message to parent window
            window.parent.postMessage({ source: 'assistlore-voice', action: 'closeVoice' }, '*');
            // Force cleanup and close after a short delay if needed
            setTimeout(() => {
              window.parent.postMessage({ source: 'assistlore-voice', action: 'closeVoice', force: true }, '*');
            }, 100);
          }}
          isRecording={vadIsRecordingRef.current}
          isLoading={micLoading}
        />
      ) : (
        <div className="bg-black/80 text-white p-8 rounded-xl">Voice Bot UI not available</div>
      )}
    </div>
  );
}
