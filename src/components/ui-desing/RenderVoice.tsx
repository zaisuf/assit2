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
  // Chat assistant UI state (small chat box)
  const [messages, setMessages] = useState<{ role: 'user'|'assistant'; content: string; timestamp: Date }[]>([]);
  const [inputText, setInputText] = useState('');
  const messageEndRef = useRef<HTMLDivElement | null>(null);
  // TTS audio context refs
  const ttsSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const ttsAnalyserRef = useRef<AnalyserNode | null>(null);
  const ttsAudioContextRef = useRef<AudioContext | null>(null);
  // TTS modal and settings
  const [showTtsModal, setShowTtsModal] = useState(false);
  const [ttsProvider, setTtsProvider] = useState<'google'|'11lab'|'murfi'|'azure'|'kokoro'|'webspeech'>('google');
  const [languageCode, setLanguageCode] = useState('en-US');
  const [ttsVoice, setTtsVoice] = useState('en-US-Wavenet-A');
  const [voiceType, setVoiceType] = useState<'Standard'|'Wavenet'>('Wavenet');
  const [speakingRateState, setSpeakingRateState] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(false);
  const [sttTimer, setSttTimer] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const trackRef = useRef<MediaStreamTrack | null>(null);
  const [isLLMLoading, setIsLLMLoading] = useState(false);
  const [gifScale, setGifScale] = useState(1);

  // Voice options for each language
  const voiceOptions: Record<string, Record<string, Array<{ id: string; name: string }>>> = {
    'google': {
      'ar-XA': [
        { id: 'ar-XA-Wavenet-A', name: 'Female (A)' },
        { id: 'ar-XA-Wavenet-B', name: 'Male (B)' },
        { id: 'ar-XA-Wavenet-C', name: 'Male (C)' },
        { id: 'ar-XA-Wavenet-D', name: 'Female (D)' }
      ],
      'bn-IN': [
        { id: 'bn-IN-Wavenet-A', name: 'Female (A)' },
        { id: 'bn-IN-Wavenet-B', name: 'Male (B)' }
      ],
      'cmn-CN': [
        { id: 'cmn-CN-Wavenet-A', name: 'Female (A)' },
        { id: 'cmn-CN-Wavenet-B', name: 'Male (B)' },
        { id: 'cmn-CN-Wavenet-C', name: 'Male (C)' },
        { id: 'cmn-CN-Wavenet-D', name: 'Female (D)' }
      ],
      'cmn-TW': [
        { id: 'cmn-TW-Wavenet-A', name: 'Female (A)' },
        { id: 'cmn-TW-Wavenet-B', name: 'Male (B)' },
        { id: 'cmn-TW-Wavenet-C', name: 'Male (C)' }
      ],
      'cs-CZ': [
        { id: 'cs-CZ-Wavenet-A', name: 'Female (A)' }
      ],
      'da-DK': [
        { id: 'da-DK-Wavenet-A', name: 'Female (A)' },
        { id: 'da-DK-Wavenet-C', name: 'Male (C)' },
        { id: 'da-DK-Wavenet-D', name: 'Female (D)' },
        { id: 'da-DK-Wavenet-E', name: 'Female (E)' }
      ],
      'nl-NL': [
        { id: 'nl-NL-Wavenet-A', name: 'Female (A)' },
        { id: 'nl-NL-Wavenet-B', name: 'Male (B)' },
        { id: 'nl-NL-Wavenet-C', name: 'Male (C)' },
        { id: 'nl-NL-Wavenet-D', name: 'Female (D)' },
        { id: 'nl-NL-Wavenet-E', name: 'Female (E)' }
      ],
      'en-AU': [
        { id: 'en-AU-Wavenet-A', name: 'Female (A)' },
        { id: 'en-AU-Wavenet-B', name: 'Male (B)' },
        { id: 'en-AU-Wavenet-C', name: 'Female (C)' },
        { id: 'en-AU-Wavenet-D', name: 'Male (D)' }
      ],
      'en-GB': [
        { id: 'en-GB-Wavenet-A', name: 'Female (A)' },
        { id: 'en-GB-Wavenet-B', name: 'Male (B)' },
        { id: 'en-GB-Wavenet-C', name: 'Female (C)' },
        { id: 'en-GB-Wavenet-D', name: 'Male (D)' },
        { id: 'en-GB-Wavenet-F', name: 'Female (F)' }
      ],
      'en-IN': [
        { id: 'en-IN-Wavenet-A', name: 'Female (A)' },
        { id: 'en-IN-Wavenet-B', name: 'Male (B)' },
        { id: 'en-IN-Wavenet-C', name: 'Male (C)' },
        { id: 'en-IN-Wavenet-D', name: 'Female (D)' }
      ],
      'en-US': [
        { id: 'en-US-Wavenet-A', name: 'Male (A)' },
        { id: 'en-US-Wavenet-B', name: 'Male (B)' },
        { id: 'en-US-Wavenet-C', name: 'Female (C)' },
        { id: 'en-US-Wavenet-D', name: 'Male (D)' },
        { id: 'en-US-Wavenet-E', name: 'Female (E)' },
        { id: 'en-US-Wavenet-F', name: 'Female (F)' },
        { id: 'en-US-Wavenet-G', name: 'Female (G)' },
        { id: 'en-US-Wavenet-H', name: 'Female (H)' },
        { id: 'en-US-Wavenet-I', name: 'Male (I)' },
        { id: 'en-US-Wavenet-J', name: 'Male (J)' }
      ],
      'fil-PH': [
        { id: 'fil-PH-Wavenet-A', name: 'Female (A)' },
        { id: 'fil-PH-Wavenet-B', name: 'Female (B)' },
        { id: 'fil-PH-Wavenet-C', name: 'Male (C)' },
        { id: 'fil-PH-Wavenet-D', name: 'Male (D)' }
      ],
      'fi-FI': [
        { id: 'fi-FI-Wavenet-A', name: 'Female (A)' }
      ],
      'fr-CA': [
        { id: 'fr-CA-Wavenet-A', name: 'Female (A)' },
        { id: 'fr-CA-Wavenet-B', name: 'Male (B)' },
        { id: 'fr-CA-Wavenet-C', name: 'Female (C)' },
        { id: 'fr-CA-Wavenet-D', name: 'Male (D)' }
      ],
      'fr-FR': [
        { id: 'fr-FR-Wavenet-A', name: 'Female (A)' },
        { id: 'fr-FR-Wavenet-B', name: 'Male (B)' },
        { id: 'fr-FR-Wavenet-C', name: 'Female (C)' },
        { id: 'fr-FR-Wavenet-D', name: 'Male (D)' },
        { id: 'fr-FR-Wavenet-E', name: 'Female (E)' }
      ],
      'de-DE': [
        { id: 'de-DE-Wavenet-A', name: 'Female (A)' },
        { id: 'de-DE-Wavenet-B', name: 'Male (B)' },
        { id: 'de-DE-Wavenet-C', name: 'Female (C)' },
        { id: 'de-DE-Wavenet-D', name: 'Male (D)' },
        { id: 'de-DE-Wavenet-E', name: 'Male (E)' },
        { id: 'de-DE-Wavenet-F', name: 'Female (F)' }
      ],
      'el-GR': [
        { id: 'el-GR-Wavenet-A', name: 'Female (A)' }
      ],
      'gu-IN': [
        { id: 'gu-IN-Wavenet-A', name: 'Female (A)' },
        { id: 'gu-IN-Wavenet-B', name: 'Male (B)' }
      ],
      'hi-IN': [
        { id: 'hi-IN-Wavenet-A', name: 'Female (A)' },
        { id: 'hi-IN-Wavenet-B', name: 'Male (B)' },
        { id: 'hi-IN-Wavenet-C', name: 'Male (C)' },
        { id: 'hi-IN-Wavenet-D', name: 'Female (D)' }
      ],
      'hu-HU': [
        { id: 'hu-HU-Wavenet-A', name: 'Female (A)' }
      ],
      'id-ID': [
        { id: 'id-ID-Wavenet-A', name: 'Female (A)' },
        { id: 'id-ID-Wavenet-B', name: 'Male (B)' },
        { id: 'id-ID-Wavenet-C', name: 'Male (C)' },
        { id: 'id-ID-Wavenet-D', name: 'Female (D)' }
      ],
      'it-IT': [
        { id: 'it-IT-Wavenet-A', name: 'Female (A)' },
        { id: 'it-IT-Wavenet-B', name: 'Male (B)' },
        { id: 'it-IT-Wavenet-C', name: 'Female (C)' },
        { id: 'it-IT-Wavenet-D', name: 'Male (D)' }
      ],
      'ja-JP': [
        { id: 'ja-JP-Wavenet-A', name: 'Female (A)' },
        { id: 'ja-JP-Wavenet-B', name: 'Female (B)' },
        { id: 'ja-JP-Wavenet-C', name: 'Male (C)' },
        { id: 'ja-JP-Wavenet-D', name: 'Male (D)' }
      ],
      'kn-IN': [
        { id: 'kn-IN-Wavenet-A', name: 'Female (A)' },
        { id: 'kn-IN-Wavenet-B', name: 'Male (B)' }
      ],
      'ko-KR': [
        { id: 'ko-KR-Wavenet-A', name: 'Female (A)' },
        { id: 'ko-KR-Wavenet-B', name: 'Female (B)' },
        { id: 'ko-KR-Wavenet-C', name: 'Male (C)' },
        { id: 'ko-KR-Wavenet-D', name: 'Male (D)' }
      ],
      'ml-IN': [
        { id: 'ml-IN-Wavenet-A', name: 'Female (A)' },
        { id: 'ml-IN-Wavenet-B', name: 'Male (B)' }
      ],
      'nb-NO': [
        { id: 'nb-NO-Wavenet-A', name: 'Female (A)' },
        { id: 'nb-NO-Wavenet-B', name: 'Male (B)' },
        { id: 'nb-NO-Wavenet-C', name: 'Female (C)' },
        { id: 'nb-NO-Wavenet-D', name: 'Male (D)' },
        { id: 'nb-NO-Wavenet-E', name: 'Female (E)' }
      ],
      'pa-IN': [
        { id: 'pa-IN-Wavenet-A', name: 'Female (A)' },
        { id: 'pa-IN-Wavenet-B', name: 'Male (B)' },
        { id: 'pa-IN-Wavenet-C', name: 'Female (C)' },
        { id: 'pa-IN-Wavenet-D', name: 'Male (D)' }
      ],
      'pl-PL': [
        { id: 'pl-PL-Wavenet-A', name: 'Female (A)' },
        { id: 'pl-PL-Wavenet-B', name: 'Male (B)' },
        { id: 'pl-PL-Wavenet-C', name: 'Male (C)' },
        { id: 'pl-PL-Wavenet-D', name: 'Female (D)' },
        { id: 'pl-PL-Wavenet-E', name: 'Female (E)' }
      ],
      'pt-BR': [
        { id: 'pt-BR-Wavenet-A', name: 'Female (A)' },
        { id: 'pt-BR-Wavenet-B', name: 'Male (B)' },
        { id: 'pt-BR-Wavenet-C', name: 'Female (C)' }
      ],
      'pt-PT': [
        { id: 'pt-PT-Wavenet-A', name: 'Female (A)' },
        { id: 'pt-PT-Wavenet-B', name: 'Male (B)' },
        { id: 'pt-PT-Wavenet-C', name: 'Male (C)' },
        { id: 'pt-PT-Wavenet-D', name: 'Female (D)' }
      ],
      'ru-RU': [
        { id: 'ru-RU-Wavenet-A', name: 'Female (A)' },
        { id: 'ru-RU-Wavenet-B', name: 'Male (B)' },
        { id: 'ru-RU-Wavenet-C', name: 'Female (C)' },
        { id: 'ru-RU-Wavenet-D', name: 'Male (D)' },
        { id: 'ru-RU-Wavenet-E', name: 'Female (E)' }
      ],
      'sk-SK': [
        { id: 'sk-SK-Wavenet-A', name: 'Female (A)' }
      ],
      'es-ES': [
        { id: 'es-ES-Wavenet-B', name: 'Male (B)' },
        { id: 'es-ES-Wavenet-C', name: 'Female (C)' },
        { id: 'es-ES-Wavenet-D', name: 'Female (D)' }
      ],
      'es-US': [
        { id: 'es-US-Wavenet-A', name: 'Female (A)' },
        { id: 'es-US-Wavenet-B', name: 'Male (B)' },
        { id: 'es-US-Wavenet-C', name: 'Male (C)' }
      ],
      'sv-SE': [
        { id: 'sv-SE-Wavenet-A', name: 'Female (A)' },
        { id: 'sv-SE-Wavenet-B', name: 'Female (B)' },
        { id: 'sv-SE-Wavenet-C', name: 'Male (C)' },
        { id: 'sv-SE-Wavenet-D', name: 'Female (D)' },
        { id: 'sv-SE-Wavenet-E', name: 'Male (E)' }
      ],
      'ta-IN': [
        { id: 'ta-IN-Wavenet-A', name: 'Female (A)' },
        { id: 'ta-IN-Wavenet-B', name: 'Male (B)' },
        { id: 'ta-IN-Wavenet-C', name: 'Female (C)' },
        { id: 'ta-IN-Wavenet-D', name: 'Male (D)' }
      ],
      'te-IN': [
        { id: 'te-IN-Wavenet-A', name: 'Female (A)' },
        { id: 'te-IN-Wavenet-B', name: 'Male (B)' }
      ],
      'th-TH': [
        { id: 'th-TH-Wavenet-A', name: 'Female (A)' }
      ],
      'tr-TR': [
        { id: 'tr-TR-Wavenet-A', name: 'Female (A)' },
        { id: 'tr-TR-Wavenet-B', name: 'Male (B)' },
        { id: 'tr-TR-Wavenet-C', name: 'Female (C)' },
        { id: 'tr-TR-Wavenet-D', name: 'Female (D)' },
        { id: 'tr-TR-Wavenet-E', name: 'Male (E)' }
      ],
      'uk-UA': [
        { id: 'uk-UA-Wavenet-A', name: 'Female (A)' }
      ],
      'vi-VN': [
        { id: 'vi-VN-Wavenet-A', name: 'Female (A)' },
        { id: 'vi-VN-Wavenet-B', name: 'Male (B)' },
        { id: 'vi-VN-Wavenet-C', name: 'Female (C)' },
        { id: 'vi-VN-Wavenet-D', name: 'Male (D)' }
      ]
    }
  };

  // Handle voice type change
  const handleVoiceTypeChange = (type: 'Standard' | 'Wavenet') => {
    setVoiceType(type);
    // Update current voice to match new type
    if (ttsProvider === 'google') {
      const baseName = ttsVoice.split('-').slice(0, 2).join('-');
      const letter = ttsVoice.slice(-1); // Get the last character (A, B, C, etc.)
      setTtsVoice(`${baseName}-${type}-${letter}`);
    }
  };

  // Handle language change
  const handleLanguageChange = (newLanguageCode: string) => {
    setLanguageCode(newLanguageCode);
    // Set default voice for the selected language
    if (ttsProvider === 'google') {
      setTtsVoice(`${newLanguageCode}-${voiceType}-A`);
    } else {
      setTtsVoice(`${newLanguageCode}-Standard-A`);
    }
  };

  // Handle voice change
  const handleVoiceChange = (letter: string) => {
    if (ttsProvider === 'google') {
      setTtsVoice(`${languageCode}-${voiceType}-${letter}`);
    } else {
      setTtsVoice(letter);
    }
  };

  // Language support for each provider
  const providerLanguages = {
    'google': [
      { code: 'af-ZA', label: 'Afrikaans (South Africa)' },
      { code: 'ar-XA', label: 'Arabic' },
      { code: 'bn-IN', label: 'Bengali (India)' },
      { code: 'bg-BG', label: 'Bulgarian' },
      { code: 'ca-ES', label: 'Catalan' },
      { code: 'yue-HK', label: 'Chinese (Hong Kong)' },
      { code: 'cs-CZ', label: 'Czech' },
      { code: 'da-DK', label: 'Danish' },
      { code: 'nl-BE', label: 'Dutch (Belgium)' },
      { code: 'nl-NL', label: 'Dutch (Netherlands)' },
      { code: 'en-AU', label: 'English (Australia)' },
      { code: 'en-IN', label: 'English (India)' },
      { code: 'en-GB', label: 'English (UK)' },
      { code: 'en-US', label: 'English (US)' },
      { code: 'fil-PH', label: 'Filipino' },
      { code: 'fi-FI', label: 'Finnish' },
      { code: 'fr-CA', label: 'French (Canada)' },
      { code: 'fr-FR', label: 'French (France)' },
      { code: 'de-DE', label: 'German' },
      { code: 'el-GR', label: 'Greek' },
      { code: 'gu-IN', label: 'Gujarati' },
      { code: 'he-IL', label: 'Hebrew' },
      { code: 'hi-IN', label: 'Hindi' },
      { code: 'hu-HU', label: 'Hungarian' },
      { code: 'is-IS', label: 'Icelandic' },
      { code: 'id-ID', label: 'Indonesian' },
      { code: 'it-IT', label: 'Italian' },
      { code: 'ja-JP', label: 'Japanese' },
      { code: 'kn-IN', label: 'Kannada' },
      { code: 'ko-KR', label: 'Korean' },
      { code: 'lv-LV', label: 'Latvian' },
      { code: 'ms-MY', label: 'Malay' },
      { code: 'ml-IN', label: 'Malayalam' },
      { code: 'cmn-CN', label: 'Mandarin Chinese' },
      { code: 'cmn-TW', label: 'Mandarin Chinese (Taiwan)' },
      { code: 'mr-IN', label: 'Marathi' },
      { code: 'nb-NO', label: 'Norwegian' },
      { code: 'pl-PL', label: 'Polish' },
      { code: 'pt-BR', label: 'Portuguese (Brazil)' },
      { code: 'pt-PT', label: 'Portuguese (Portugal)' },
      { code: 'pa-IN', label: 'Punjabi' },
      { code: 'ro-RO', label: 'Romanian' },
      { code: 'ru-RU', label: 'Russian' },
      { code: 'sr-RS', label: 'Serbian' },
      { code: 'sk-SK', label: 'Slovak' },
      { code: 'es-ES', label: 'Spanish (Spain)' },
      { code: 'es-US', label: 'Spanish (US)' },
      { code: 'sv-SE', label: 'Swedish' },
      { code: 'ta-IN', label: 'Tamil' },
      { code: 'te-IN', label: 'Telugu' },
      { code: 'th-TH', label: 'Thai' },
      { code: 'tr-TR', label: 'Turkish' },
      { code: 'uk-UA', label: 'Ukrainian' },
      { code: 'ur-PK', label: 'Urdu' },
      { code: 'vi-VN', label: 'Vietnamese' }
    ],
    '11lab': [
      { code: 'en', label: 'English' },
      { code: 'ar', label: 'Arabic' },
      { code: 'bn', label: 'Bengali' },
      { code: 'bg', label: 'Bulgarian' },
      { code: 'zh', label: 'Chinese (Mandarin)' },
      { code: 'hr', label: 'Croatian' },
      { code: 'cs', label: 'Czech' },
      { code: 'da', label: 'Danish' },
      { code: 'nl', label: 'Dutch' },
      { code: 'fi', label: 'Finnish' },
      { code: 'fr', label: 'French' },
      { code: 'de', label: 'German' },
      { code: 'el', label: 'Greek' },
      { code: 'hi', label: 'Hindi' },
      { code: 'hu', label: 'Hungarian' },
      { code: 'id', label: 'Indonesian' },
      { code: 'it', label: 'Italian' },
      { code: 'ja', label: 'Japanese' },
      { code: 'ko', label: 'Korean' },
      { code: 'ms', label: 'Malay' },
      { code: 'pl', label: 'Polish' },
      { code: 'pt', label: 'Portuguese' },
      { code: 'ro', label: 'Romanian' },
      { code: 'ru', label: 'Russian' },
      { code: 'es', label: 'Spanish' },
      { code: 'sv', label: 'Swedish' },
      { code: 'ta', label: 'Tamil' },
      { code: 'tr', label: 'Turkish' },
      { code: 'uk', label: 'Ukrainian' }
    ],
    'murfi': [
      { code: 'en', label: 'English (US, UK, India)' },
      { code: 'ar', label: 'Arabic' },
      { code: 'bn', label: 'Bengali' },
      { code: 'bg', label: 'Bulgarian' },
      { code: 'ca', label: 'Catalan' },
      { code: 'zh', label: 'Chinese (Mandarin)' },
      { code: 'hr', label: 'Croatian' },
      { code: 'cs', label: 'Czech' },
      { code: 'da', label: 'Danish' },
      { code: 'nl', label: 'Dutch' },
      { code: 'fil', label: 'Filipino' },
      { code: 'fi', label: 'Finnish' },
      { code: 'fr', label: 'French' },
      { code: 'de', label: 'German' },
      { code: 'el', label: 'Greek' },
      { code: 'gu', label: 'Gujarati' },
      { code: 'hi', label: 'Hindi' },
      { code: 'hu', label: 'Hungarian' },
      { code: 'id', label: 'Indonesian' },
      { code: 'it', label: 'Italian' },
      { code: 'ja', label: 'Japanese' },
      { code: 'kn', label: 'Kannada' },
      { code: 'ko', label: 'Korean' },
      { code: 'ml', label: 'Malayalam' },
      { code: 'mr', label: 'Marathi' },
      { code: 'pl', label: 'Polish' },
      { code: 'pt', label: 'Portuguese' },
      { code: 'ro', label: 'Romanian' },
      { code: 'ru', label: 'Russian' },
      { code: 'sr', label: 'Serbian' },
      { code: 'es', label: 'Spanish' },
      { code: 'ta', label: 'Tamil' },
      { code: 'te', label: 'Telugu' }
    ],
    'azure': [
      // African Languages
      { code: 'af-ZA', label: 'Afrikaans (South Africa)' },
      { code: 'am-ET', label: 'Amharic (Ethiopia)' },
      // Arabic Variants
      { code: 'ar-AE', label: 'Arabic (UAE)' },
      { code: 'ar-BH', label: 'Arabic (Bahrain)' },
      { code: 'ar-DZ', label: 'Arabic (Algeria)' },
      { code: 'ar-EG', label: 'Arabic (Egypt)' },
      { code: 'ar-IQ', label: 'Arabic (Iraq)' },
      { code: 'ar-JO', label: 'Arabic (Jordan)' },
      { code: 'ar-KW', label: 'Arabic (Kuwait)' },
      { code: 'ar-LY', label: 'Arabic (Libya)' },
      { code: 'ar-MA', label: 'Arabic (Morocco)' },
      { code: 'ar-QA', label: 'Arabic (Qatar)' },
      { code: 'ar-SA', label: 'Arabic (Saudi Arabia)' },
      { code: 'ar-SY', label: 'Arabic (Syria)' },
      { code: 'ar-TN', label: 'Arabic (Tunisia)' },
      { code: 'ar-YE', label: 'Arabic (Yemen)' },
      // Asian Languages
      { code: 'bn-BD', label: 'Bengali (Bangladesh)' },
      { code: 'bn-IN', label: 'Bengali (India)' },
      { code: 'my-MM', label: 'Burmese (Myanmar)' },
      { code: 'zh-CN', label: 'Chinese (Mainland)' },
      { code: 'zh-HK', label: 'Chinese (Hong Kong)' },
      { code: 'zh-TW', label: 'Chinese (Taiwan)' },
      { code: 'gu-IN', label: 'Gujarati (India)' },
      { code: 'hi-IN', label: 'Hindi (India)' },
      { code: 'ja-JP', label: 'Japanese (Japan)' },
      { code: 'kn-IN', label: 'Kannada (India)' },
      { code: 'km-KH', label: 'Khmer (Cambodia)' },
      { code: 'ko-KR', label: 'Korean (Korea)' },
      { code: 'ml-IN', label: 'Malayalam (India)' },
      { code: 'mr-IN', label: 'Marathi (India)' },
      { code: 'ne-NP', label: 'Nepali (Nepal)' },
      { code: 'si-LK', label: 'Sinhala (Sri Lanka)' },
      { code: 'ta-IN', label: 'Tamil (India)' },
      { code: 'te-IN', label: 'Telugu (India)' },
      { code: 'th-TH', label: 'Thai (Thailand)' },
      { code: 'ur-IN', label: 'Urdu (India)' },
      { code: 'ur-PK', label: 'Urdu (Pakistan)' },
      { code: 'vi-VN', label: 'Vietnamese (Vietnam)' },
      // European Languages
      { code: 'bg-BG', label: 'Bulgarian (Bulgaria)' },
      { code: 'ca-ES', label: 'Catalan (Spain)' },
      { code: 'hr-HR', label: 'Croatian (Croatia)' },
      { code: 'cs-CZ', label: 'Czech (Czech Republic)' },
      { code: 'da-DK', label: 'Danish (Denmark)' },
      { code: 'nl-BE', label: 'Dutch (Belgium)' },
      { code: 'nl-NL', label: 'Dutch (Netherlands)' },
      { code: 'en-AU', label: 'English (Australia)' },
      { code: 'en-CA', label: 'English (Canada)' },
      { code: 'en-GB', label: 'English (UK)' },
      { code: 'en-IE', label: 'English (Ireland)' },
      { code: 'en-IN', label: 'English (India)' },
      { code: 'en-NZ', label: 'English (New Zealand)' },
      { code: 'en-US', label: 'English (US)' },
      { code: 'en-ZA', label: 'English (South Africa)' },
      { code: 'et-EE', label: 'Estonian (Estonia)' },
      { code: 'fi-FI', label: 'Finnish (Finland)' },
      { code: 'fr-BE', label: 'French (Belgium)' },
      { code: 'fr-CA', label: 'French (Canada)' },
      { code: 'fr-CH', label: 'French (Switzerland)' },
      { code: 'fr-FR', label: 'French (France)' },
      { code: 'de-AT', label: 'German (Austria)' },
      { code: 'de-CH', label: 'German (Switzerland)' },
      { code: 'de-DE', label: 'German (Germany)' },
      { code: 'el-GR', label: 'Greek (Greece)' },
      { code: 'he-IL', label: 'Hebrew (Israel)' },
      { code: 'hu-HU', label: 'Hungarian (Hungary)' },
      { code: 'is-IS', label: 'Icelandic (Iceland)' },
      { code: 'ga-IE', label: 'Irish (Ireland)' },
      { code: 'it-IT', label: 'Italian (Italy)' },
      { code: 'lv-LV', label: 'Latvian (Latvia)' },
      { code: 'lt-LT', label: 'Lithuanian (Lithuania)' },
      { code: 'mt-MT', label: 'Maltese (Malta)' },
      { code: 'nb-NO', label: 'Norwegian (Norway)' },
      { code: 'pl-PL', label: 'Polish (Poland)' },
      { code: 'pt-BR', label: 'Portuguese (Brazil)' },
      { code: 'pt-PT', label: 'Portuguese (Portugal)' },
      { code: 'ro-RO', label: 'Romanian (Romania)' },
      { code: 'ru-RU', label: 'Russian (Russia)' },
      { code: 'sr-RS', label: 'Serbian (Serbia)' },
      { code: 'sk-SK', label: 'Slovak (Slovakia)' },
      { code: 'sl-SI', label: 'Slovenian (Slovenia)' },
      { code: 'es-AR', label: 'Spanish (Argentina)' },
      { code: 'es-CO', label: 'Spanish (Colombia)' },
      { code: 'es-ES', label: 'Spanish (Spain)' },
      { code: 'es-MX', label: 'Spanish (Mexico)' },
      { code: 'es-US', label: 'Spanish (US)' },
      { code: 'sv-SE', label: 'Swedish (Sweden)' },
      { code: 'tr-TR', label: 'Turkish (Turkey)' },
      { code: 'uk-UA', label: 'Ukrainian (Ukraine)' },
      { code: 'cy-GB', label: 'Welsh (UK)' }
    ],
    'kokoro': [
      { code: 'en', label: 'English' },
      { code: 'ja', label: 'Japanese' }
    ],
    'webspeech': [
      { code: 'en-US', label: 'English (US)' },
      { code: 'en-GB', label: 'English (UK)' },
      { code: 'es-ES', label: 'Spanish (Spain)' },
      { code: 'fr-FR', label: 'French (France)' },
      { code: 'de-DE', label: 'German (Germany)' },
      { code: 'it-IT', label: 'Italian (Italy)' },
      { code: 'pt-BR', label: 'Portuguese (Brazil)' },
      { code: 'ru-RU', label: 'Russian (Russia)' },
      { code: 'ja-JP', label: 'Japanese (Japan)' },
      { code: 'ko-KR', label: 'Korean (Korea)' },
      { code: 'zh-CN', label: 'Chinese (Mandarin)' },
      { code: 'ar-SA', label: 'Arabic (Saudi Arabia)' },
      { code: 'hi-IN', label: 'Hindi (India)' },
      { code: 'nl-NL', label: 'Dutch (Netherlands)' },
      { code: 'sv-SE', label: 'Swedish (Sweden)' },
      { code: 'da-DK', label: 'Danish (Denmark)' },
      { code: 'no-NO', label: 'Norwegian (Norway)' },
      { code: 'fi-FI', label: 'Finnish (Finland)' },
      { code: 'pl-PL', label: 'Polish (Poland)' },
      { code: 'tr-TR', label: 'Turkish (Turkey)' }
    ]
  };

  // Get current provider's supported languages
  const currentLanguages = providerLanguages[ttsProvider] || providerLanguages['google'];
  
  // STT streaming state
  const sttWsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const isRecordingMicRef = useRef(false);
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [sttError, setSttError] = useState<string | null>(null);
  // Use the existing languageCode state for both TTS and STT

  function floatTo16BitPCM(float32Array: Float32Array) {
    const l = float32Array.length;
    const buffer = new ArrayBuffer(l * 2);
    const view = new DataView(buffer);
    let offset = 0;
    for (let i = 0; i < l; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  }

  const startMicStream = async () => {
    if (isRecordingMicRef.current) return;
    try {
      // close any existing
      await stopMicStream();

      // Use browser's SpeechRecognition API
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported in this browser');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = languageCode;

      recognition.onstart = () => {
        isRecordingMicRef.current = true;
        setIsRecordingMic(true);
        setSttError(null);
      };

      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        // Show interim transcripts in the input box
        setInputText(finalTranscript + interimTranscript);

        // If final, submit it as a user message
        if (finalTranscript) {
          setTimeout(() => {
            handleSendMessage(finalTranscript);
            // clear input after sending
            setInputText('');
          }, 50);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setSttError(event.error);
        isRecordingMicRef.current = false;
        setIsRecordingMic(false);
      };

      recognition.onend = () => {
        isRecordingMicRef.current = false;
        setIsRecordingMic(false);
      };

      recognition.start();
      // Store recognition instance for stopping
      (window as any).speechRecognition = recognition;

      setSttError(null);
    } catch (err: any) {
      console.error('startMicStream error', err);
      setSttError(err?.message || String(err));
      await stopMicStream();
    }
  };

  const stopMicStream = async () => {
    isRecordingMicRef.current = false;
    setIsRecordingMic(false);

    // Stop browser speech recognition
    if ((window as any).speechRecognition) {
      try {
        (window as any).speechRecognition.stop();
      } catch (e) { }
      (window as any).speechRecognition = null;
    }

    if (scriptProcessorRef.current) {
      try { scriptProcessorRef.current.disconnect(); } catch (e) { }
      scriptProcessorRef.current = null;
    }
    if (audioContextRef.current) {
      try { await audioContextRef.current.close(); } catch (e) { }
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      try { mediaStreamRef.current.getTracks().forEach(t => t.stop()); } catch (e) { }
      mediaStreamRef.current = null;
    }
    if (sttWsRef.current) {
      try {
        if (sttWsRef.current.readyState === WebSocket.OPEN) {
          sttWsRef.current.send(JSON.stringify({ type: 'stop' }));
          await new Promise((r) => setTimeout(r, 100));
        }
        sttWsRef.current.close();
      } catch (e) { }
      sttWsRef.current = null;
    }
  };

  const toggleMicMute = () => {
    setIsMicMuted(!isMicMuted);
  };

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
          // VAD chunk processing removed - using Web Speech API for real-time STT
          vadChunksRef.current = [];
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



  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWebRTCVAD();
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // STT timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecordingMic) {
      interval = setInterval(() => {
        setSttTimer(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecordingMic]);

  // Listen for messages from parent
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.action === 'startMic') {
        startMicStream();
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Update STT mic when mute state changes
  useEffect(() => {
    if (isMicMuted) {
      stopMicStream();
    } else if (!isRecordingMic) {
      startMicStream();
    }
  }, [isMicMuted]);

  // Automatically start voice recording and STT mic when voice interface opens
  useEffect(() => {
    startWebRTCVADRecording();
    startMicStream();
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text || !text.trim()) return;
    // Add user message to UI
    setMessages((prev) => [...prev, { role: 'user', content: text, timestamp: new Date() }]);
    setInputText('');
    setIsLLMLoading(true);

    // Call chatbot-response API
    try {
      const body: any = { message: text };
      if (config?.designId) body.designId = config.designId;
      const res = await fetch('/api/chatbot-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error(errText || `Assistant API error: ${res.status}`);
      }
      const data = await res.json();
      const reply = (data && data.response) ? data.response : 'Sorry, no response.';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
      setIsLLMLoading(false);
      
      // Get speech based on selected provider
      try {
        if (ttsProvider === 'kokoro') {
          // Use Kokoro TTS API
          console.log('Sending request to Kokoro TTS:', {
            text: reply.substring(0, 50) + '...', // Log first 50 chars
            voice: ttsVoice,
            language: languageCode
          });

          let kokoroRes;
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 65000); // 65-second timeout

            kokoroRes = await fetch('/api/kokoro-tts', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                text: reply,
                voice: ttsVoice,
                language: languageCode
              }),
              signal: controller.signal
            });
            
            clearTimeout(timeout);
          } catch (fetchError: any) {
            if (fetchError.name === 'AbortError') {
              throw new Error('Request timed out after 65 seconds');
            }
            throw fetchError;
          }
          
          if (!kokoroRes.ok) {
            const errorData = await kokoroRes.json();
            throw new Error(
              errorData.error || errorData.details || 'Failed to get Kokoro TTS audio'
            );
          }
          
          const ttsData = await kokoroRes.json();
          if (!ttsData.audioUrl) {
            throw new Error('No audio URL in response');
          }

          console.log('Kokoro TTS response received:', {
            audioUrl: ttsData.audioUrl.substring(0, 50) + '...' // Log first 50 chars
          });

          // Disconnect previous TTS audio nodes
          if (ttsSourceRef.current) {
            try { ttsSourceRef.current.disconnect(); } catch (e) {}
            ttsSourceRef.current = null;
          }
          if (ttsAnalyserRef.current) {
            try { ttsAnalyserRef.current.disconnect(); } catch (e) {}
            ttsAnalyserRef.current = null;
          }
          if (ttsAudioContextRef.current) {
            try { ttsAudioContextRef.current.close(); } catch (e) {}
            ttsAudioContextRef.current = null;
          }
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          ttsAudioContextRef.current = audioContext;
          const audio = new Audio(ttsData.audioUrl);
          const source = audioContext.createMediaElementSource(audio);
          ttsSourceRef.current = source;
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          ttsAnalyserRef.current = analyser;
          source.connect(analyser);
          analyser.connect(audioContext.destination);
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          const animate = () => {
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            const scale = 1 + (average / 255) * 1;
            setGifScale(scale);
            if (!audio.ended) {
              requestAnimationFrame(animate);
            } else {
              setGifScale(1);
            }
          };
          try {
            await audio.play();
            animate();
          } catch (playError) {
            console.error('Error playing audio:', playError);
            throw new Error('Failed to play audio');
          }
        } else if (ttsProvider === 'webspeech') {
          const utterance = new SpeechSynthesisUtterance(reply);
          utterance.lang = languageCode;
          utterance.rate = speakingRateState;
          window.speechSynthesis.speak(utterance);
        } else {
          // Use voice-tts API for other providers
          const ttsRes = await fetch('/api/voice-tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              text: reply, 
              provider: ttsProvider, 
              voice: ttsVoice, 
              languageCode: languageCode, 
              speakingRate: speakingRateState 
            }),
          });
          
          if (!ttsRes.ok) {
            const errText = await ttsRes.text().catch(() => '');
            throw new Error(errText || 'TTS API error');
          }
          
          const ttsData = await ttsRes.json();
          const audioUrl = ttsData?.audioUrl || ttsData?.url || ttsData?.data?.audioUrl || null;
          if (audioUrl) {
            // Disconnect previous TTS audio nodes
            if (ttsSourceRef.current) {
              try { ttsSourceRef.current.disconnect(); } catch (e) {}
              ttsSourceRef.current = null;
            }
            if (ttsAnalyserRef.current) {
              try { ttsAnalyserRef.current.disconnect(); } catch (e) {}
              ttsAnalyserRef.current = null;
            }
            if (ttsAudioContextRef.current) {
              try { ttsAudioContextRef.current.close(); } catch (e) {}
              ttsAudioContextRef.current = null;
            }
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            ttsAudioContextRef.current = audioContext;
            const audio = new Audio(audioUrl);
            const source = audioContext.createMediaElementSource(audio);
            ttsSourceRef.current = source;
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            ttsAnalyserRef.current = analyser;
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            const animate = () => {
              analyser.getByteFrequencyData(dataArray);
              const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
              const scale = 1 + (average / 255) * 1;
              setGifScale(scale);
              if (!audio.ended) {
                requestAnimationFrame(animate);
              } else {
                setGifScale(1);
              }
            };
            await audio.play();
            animate();
          }
        }
      } catch (ttsError) {
        console.error('Error getting TTS audio:', ttsError);
      }
  // Google TTS removed — using kokoro-tts only
    } catch (err: any) {
      console.error('Error calling assistant:', err);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Error contacting assistant.', timestamp: new Date() }]);
      setIsLLMLoading(false);
    }
  };

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
          languageOptions={currentLanguages}
          onLanguageChange={setLanguageCode}
          currentLanguage={languageCode}
          onStopMic={stopMicStream}
          onToggleMicMute={toggleMicMute}
          isMicMuted={isMicMuted}
          isLLMLoading={isLLMLoading}
          isRecordingMic={isRecordingMic}
          gifScale={gifScale}
        />
      ) : (
        <div className="bg-black/80 text-white p-8 rounded-xl">Voice Bot UI not available</div>
      )}
      {/* Small chat assistant box (same as RenderUiDesign) */}
      <div style={{
        position: 'fixed',
        bottom: 320,
        right: 24,
        zIndex: 1000,
        width: 320,
        maxHeight: 420,
        height: 360,
        background: '#1e1e1e',
        borderRadius: 12,
        boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '12px 16px',
          background: '#2563eb',
          color: '#fff',
          fontWeight: 'bold',
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>Chat Assistant</span>
            {isRecordingMic && (
              <span style={{
                fontSize: 12,
                backgroundColor: 'rgba(255,0,0,0.2)',
                color: '#fff',
                padding: '2px 6px',
                borderRadius: 4,
                fontFamily: 'monospace'
              }}>
                {String(Math.floor(sttTimer / 60)).padStart(2, '0')}:{String(sttTimer % 60).padStart(2, '0')}
              </span>
            )}
            {ttsProvider && (
              <span style={{
                fontSize: 12,
                backgroundColor: 'rgba(255,255,255,0.1)',
                padding: '2px 6px',
                borderRadius: 4,
                textTransform: 'capitalize'
              }}>
                {ttsProvider === '11lab' ? 'ElevenLabs' : ttsProvider}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setShowTtsModal(true)}
              title="TTS Settings"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: 6,
              }}
            >
              <span style={{ transform: 'translateY(1px)', fontSize: 14 }}>▾</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>TTS Settings</span>
            </button>
          </div>
        </div>
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: 16,
          maxHeight: 300,
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          {messages.map((m, i) => (
            <div key={i} style={{ textAlign: m.role === 'user' ? 'right' : 'left' }}>
              <div style={{ display: 'inline-block', background: m.role === 'user' ? '#2563eb' : '#2d2d2d', color: '#fff', padding: '6px 10px', borderRadius: 8, maxWidth: '100%' }}>{m.content}</div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
        <div style={{
          padding: 8,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}>
          <button
            onClick={() => {
              if (isRecordingMicRef.current) stopMicStream(); else startMicStream();
            }}
            title={isRecordingMic ? 'Stop microphone' : 'Start microphone'}
            style={{
              background: isRecordingMic ? '#ef4444' : '#10b981',
              color: '#fff',
              borderRadius: 8,
              padding: '6px 8px',
              border: 'none',
              cursor: 'pointer'
            }}
          >{isRecordingMic ? '⏹️' : '🎤'}</button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
            placeholder="Type your message..."
            style={{
              flex: 1,
              padding: '6px 8px',
              borderRadius: 6,
              border: '1px solid rgba(255,255,255,0.1)',
              background: '#2d2d2d',
              color: '#fff',
              fontSize: 12,
              outline: 'none'
            }}
          />
          {/* Mic mute/unmute icon button */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="9" y="4" width="6" height="12" rx="3" stroke="#fff" strokeWidth="2" fill="none"/>
              <path d="M5 11v2a7 7 0 0014 0v-2" stroke="#fff" strokeWidth="2" fill="none"/>
              <line x1="12" y1="20" x2="12" y2="22" stroke="#fff" strokeWidth="2"/>
              {isMuted && <line x1="2" y1="2" x2="22" y2="22" stroke="#fff" strokeWidth="2"/>}
            </svg>
          </button>
          {/* Unified language dropdown for both TTS and STT */}
          <select
            value={languageCode}
            onChange={(e) => setLanguageCode(e.target.value)}
            style={{ background: '#2d2d2d', color: '#fff', borderRadius: 6, padding: '6px', border: '1px solid rgba(255,255,255,0.06)', marginLeft: '-20px' }}
          >
            {currentLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
          <button onClick={() => handleSendMessage(inputText)} style={{ background: '#2563eb', color: '#fff', borderRadius: 8, padding: '6px 8px', border: 'none', cursor: 'pointer' }}>Send</button>
        </div>
        {/* TTS Settings Modal */}
        {showTtsModal && (
          <div style={{
            position: 'fixed',
            left: '10px',  // Moved left a bit
            bottom: '20px', // Changed value
            zIndex: 2000,
            width: 320,
            background: '#0f1724',
            color: '#fff',
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
            padding: 16
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <strong>TTS Settings</strong>
              <button onClick={() => setShowTtsModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>✖</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ fontSize: 12 }}>Provider</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setTtsProvider('google')}
                  aria-pressed={ttsProvider === 'google'}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    background: ttsProvider === 'google' ? '#2563eb' : '#111827',
                    color: '#fff'
                  }}
                >Google</button>

                <button
                  type="button"
                  onClick={() => setTtsProvider('11lab')}
                  aria-pressed={ttsProvider === '11lab'}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    background: ttsProvider === '11lab' ? '#2563eb' : '#111827',
                    color: '#fff'
                  }}
                >11LAB</button>

                <button
                  type="button"
                  onClick={() => setTtsProvider('murfi')}
                  aria-pressed={ttsProvider === 'murfi'}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    background: ttsProvider === 'murfi' ? '#2563eb' : '#111827',
                    color: '#fff'
                  }}
                >Murfi</button>

                <button
                  type="button"
                  onClick={() => setTtsProvider('azure')}
                  aria-pressed={ttsProvider === 'azure'}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    background: ttsProvider === 'azure' ? '#2563eb' : '#111827',
                    color: '#fff'
                  }}
                >Azure</button>

                <button
                  type="button"
                  onClick={() => setTtsProvider('kokoro')}
                  aria-pressed={ttsProvider === 'kokoro'}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    background: ttsProvider === 'kokoro' ? '#2563eb' : '#111827',
                    color: '#fff'
                  }}
                >Kokoro</button>

                <button
                  type="button"
                  onClick={() => setTtsProvider('webspeech')}
                  aria-pressed={ttsProvider === 'webspeech'}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    border: 'none',
                    cursor: 'pointer',
                    background: ttsProvider === 'webspeech' ? '#2563eb' : '#111827',
                    color: '#fff'
                  }}
                >Web Speech</button>
              </div>


              <label style={{ fontSize: 12 }}>Language & Voice</label>
              <select
                value={languageCode}
                onChange={e => {
                  const newLang = e.target.value;
                  setLanguageCode(newLang);
                  // Set appropriate voice for the new language
                  if (ttsProvider === 'google' && voiceOptions.google[newLang]?.length > 0) {
                    setTtsVoice(voiceOptions.google[newLang][0].id);
                  } else {
                    setTtsVoice(`${newLang}-${voiceType}-A`);
                  }
                }}
                style={{ 
                  padding: 8, 
                  borderRadius: 6, 
                  background: '#111827', 
                  color: '#fff', 
                  width: '100%',
                  fontSize: '13px'
                }}
              >
                {currentLanguages.map(lang => {
                  let voiceInfo = '';
                  if (ttsProvider === 'google') {
                    // Get available voices for this language
                    const voices = voiceOptions.google[lang.code];
                    if (voices && voices.length > 0) {
                      voiceInfo = ` (${voices.length} voices - ${voiceType})`;
                    } else {
                      voiceInfo = ` (${voiceType}-A)`;
                    }
                  } else if (ttsProvider === 'azure') {
                    voiceInfo = ' (Neural)';
                  } else if (ttsProvider === '11lab') {
                    voiceInfo = ' (Premium)';
                  } else if (ttsProvider === 'murfi') {
                    voiceInfo = ' (Natural)';
                  } else if (ttsProvider === 'webspeech') {
                    voiceInfo = ' (Browser)';
                  }
                  
                  return (
                    <option 
                      key={lang.code} 
                      value={lang.code}
                      style={{ padding: '4px 0' }}
                    >
                      {lang.label}{voiceInfo}
                    </option>
                  );
                })}
              </select>
              
              <div style={{ 
                fontSize: 11, 
                color: '#9CA3AF', 
                marginTop: 4, 
                marginBottom: 8 
              }}>
                {ttsProvider === 'google' && voiceOptions.google[languageCode]?.length > 0 ? 
                  `Available voices: ${voiceOptions.google[languageCode].map(v => v.name).join(', ')}` :
                  `Voice: ${languageCode}-${voiceType}-A`
                }
              </div>

              {ttsProvider === 'google' && (
                <>
                  <label style={{ fontSize: 12 }}>Voice Type</label>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleVoiceTypeChange('Standard')}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        background: voiceType === 'Standard' ? '#2563eb' : '#111827',
                        color: '#fff',
                        flex: 1
                      }}
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVoiceTypeChange('Wavenet')}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 6,
                        border: 'none',
                        cursor: 'pointer',
                        background: voiceType === 'Wavenet' ? '#2563eb' : '#111827',
                        color: '#fff',
                        flex: 1
                      }}
                    >
                      Premium (WaveNet)
                    </button>
                  </div>
                </>
              )}

              <label style={{ fontSize: 12 }}>Voice</label>
              <select 
                value={ttsProvider === 'google' ? ttsVoice.slice(-1) : ttsVoice}
                onChange={(e) => handleVoiceChange(e.target.value)}
                style={{ padding: 8, borderRadius: 6, background: '#111827', color: '#fff', width: '100%' }}
              >
                {ttsProvider === 'google' && (
                  <>
                    <option value="A">Female Voice A</option>
                    <option value="B">Male Voice B</option>
                    <option value="C">Female Voice C</option>
                    <option value="D">Male Voice D</option>
                    <option value="E">Female Voice E</option>
                    <option value="F">Female Voice F</option>
                  </>
                )}
                {ttsProvider === 'kokoro' && (
                  <>
                    <option value="af_heart">Heart (Female)</option>
                    <option value="af_alloy">Alloy (Female)</option>
                    <option value="af_bella">Bella (Female)</option>
                    <option value="af_jessica">Jessica (Female)</option>
                    <option value="af_kore">Kore (Female)</option>
                    <option value="af_nicole">Nicole (Female)</option>
                    <option value="af_nova">Nova (Female)</option>
                    <option value="af_river">River (Female)</option>
                    <option value="af_sarah">Sarah (Female)</option>
                    <option value="af_sky">Sky (Female)</option>
                    <option value="am_adam">Adam (Male)</option>
                    <option value="am_echo">Echo (Male)</option>
                    <option value="am_eric">Eric (Male)</option>
                    <option value="am_fenrir">Fenrir (Male)</option>
                    <option value="am_liam">Liam (Male)</option>
                    <option value="am_michael">Michael (Male)</option>
                    <option value="am_onyx">Onyx (Male)</option>
                    <option value="am_puck">Puck (Male)</option>
                  </>
                )}
                {(ttsProvider === '11lab' || ttsProvider === 'azure' || ttsProvider === 'murfi') && (
                  <option value={`${languageCode}-Standard-A`}>Default Voice</option>
                )}
                {ttsProvider === 'webspeech' && (
                  <option value="default">Default Voice</option>
                )}
              </select>

              {ttsProvider === 'google' && (
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>
                  Selected: {ttsVoice}
                </div>
              )}

              <label style={{ fontSize: 12 }}>Speaking rate: {speakingRateState}</label>
              <input type="range" min="0.6" max="1.6" step="0.05" value={speakingRateState} onChange={(e) => setSpeakingRateState(Number(e.target.value))} />

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowTtsModal(false)} style={{ padding: '6px 10px', borderRadius: 6, background: '#374151', color: '#fff', border: 'none' }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
