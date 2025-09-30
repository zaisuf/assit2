import React, { useState } from 'react';

interface Voice {
  language: string;
  code: string;
  name: string;
}

const wavenetVoices: Voice[] = [
    { language: 'Arabic', code: 'ar-XA', name: 'ar-XA-Wavenet-A' },
    { language: 'Arabic', code: 'ar-XA', name: 'ar-XA-Wavenet-B' },
    { language: 'Arabic', code: 'ar-XA', name: 'ar-XA-Wavenet-C' },
    { language: 'Arabic', code: 'ar-XA', name: 'ar-XA-Wavenet-D' },
    { language: 'Czech (Czech Republic)', code: 'cs-CZ', name: 'cs-CZ-Wavenet-B' },
    { language: 'Danish (Denmark)', code: 'da-DK', name: 'da-DK-Wavenet-F' },
    { language: 'Danish (Denmark)', code: 'da-DK', name: 'da-DK-Wavenet-G' },
    { language: 'Dutch (Belgium)', code: 'nl-BE', name: 'nl-BE-Wavenet-C' },
    { language: 'Dutch (Belgium)', code: 'nl-BE', name: 'nl-BE-Wavenet-D' },
    { language: 'Dutch (Netherlands)', code: 'nl-NL', name: 'nl-NL-Wavenet-F' },
    { language: 'Dutch (Netherlands)', code: 'nl-NL', name: 'nl-NL-Wavenet-G' },
    { language: 'English (Australia)', code: 'en-AU', name: 'en-AU-Wavenet-A' },
    { language: 'English (Australia)', code: 'en-AU', name: 'en-AU-Wavenet-B' },
    { language: 'English (Australia)', code: 'en-AU', name: 'en-AU-Wavenet-C' },
    { language: 'English (Australia)', code: 'en-AU', name: 'en-AU-Wavenet-D' },
    { language: 'English (India)', code: 'en-IN', name: 'en-IN-Wavenet-A' },
    { language: 'English (India)', code: 'en-IN', name: 'en-IN-Wavenet-B' },
    { language: 'English (India)', code: 'en-IN', name: 'en-IN-Wavenet-C' },
    { language: 'English (India)', code: 'en-IN', name: 'en-IN-Wavenet-D' },
    { language: 'English (India)', code: 'en-IN', name: 'en-IN-Wavenet-E' },
    { language: 'English (India)', code: 'en-IN', name: 'en-IN-Wavenet-F' },
    { language: 'English (UK)', code: 'en-GB', name: 'en-GB-Wavenet-A' },
    { language: 'English (UK)', code: 'en-GB', name: 'en-GB-Wavenet-B' },
    { language: 'English (UK)', code: 'en-GB', name: 'en-GB-Wavenet-C' },
    { language: 'English (UK)', code: 'en-GB', name: 'en-GB-Wavenet-D' },
    { language: 'English (UK)', code: 'en-GB', name: 'en-GB-Wavenet-F' },
    { language: 'English (UK)', code: 'en-GB', name: 'en-GB-Wavenet-N' },
    { language: 'English (UK)', code: 'en-GB', name: 'en-GB-Wavenet-O' },
    { language: 'English (US)', code: 'en-US', name: 'en-US-Wavenet-A' },
    { language: 'English (US)', code: 'en-US', name: 'en-US-Wavenet-B' },
    { language: 'English (US)', code: 'en-US', name: 'en-US-Wavenet-C' },
    { language: 'English (US)', code: 'en-US', name: 'en-US-Wavenet-D' },
    { language: 'English (US)', code: 'en-US', name: 'en-US-Wavenet-E' },
    { language: 'English (US)', code: 'en-US', name: 'en-US-Wavenet-F' },
    { language: 'English (US)', code: 'en-US', name: 'en-US-Wavenet-G' },
    { language: 'English (US)', code: 'en-US', name: 'en-US-Wavenet-H' },
    { language: 'English (US)', code: 'en-US', name: 'en-US-Wavenet-I' },
    { language: 'English (US)', code: 'en-US', name: 'en-US-Wavenet-J' },
    { language: 'Filipino (Philippines)', code: 'fil-PH', name: 'fil-PH-Wavenet-A' },
    { language: 'Filipino (Philippines)', code: 'fil-PH', name: 'fil-PH-Wavenet-B' },
    { language: 'Filipino (Philippines)', code: 'fil-PH', name: 'fil-PH-Wavenet-C' },
    { language: 'Filipino (Philippines)', code: 'fil-PH', name: 'fil-PH-Wavenet-D' },
    { language: 'Finnish (Finland)', code: 'fi-FI', name: 'fi-FI-Wavenet-B' },
    { language: 'French (Canada)', code: 'fr-CA', name: 'fr-CA-Wavenet-A' },
    { language: 'French (Canada)', code: 'fr-CA', name: 'fr-CA-Wavenet-B' },
    { language: 'French (Canada)', code: 'fr-CA', name: 'fr-CA-Wavenet-C' },
    { language: 'French (Canada)', code: 'fr-CA', name: 'fr-CA-Wavenet-D' },
    { language: 'French (France)', code: 'fr-FR', name: 'fr-FR-Wavenet-F' },
    { language: 'French (France)', code: 'fr-FR', name: 'fr-FR-Wavenet-G' },
    { language: 'German (Germany)', code: 'de-DE', name: 'de-DE-Wavenet-G' },
    { language: 'German (Germany)', code: 'de-DE', name: 'de-DE-Wavenet-H' },
    { language: 'Greek (Greece)', code: 'el-GR', name: 'el-GR-Wavenet-B' },
    { language: 'Gujarati (India)', code: 'gu-IN', name: 'gu-IN-Wavenet-A' },
    { language: 'Gujarati (India)', code: 'gu-IN', name: 'gu-IN-Wavenet-B' },
    { language: 'Gujarati (India)', code: 'gu-IN', name: 'gu-IN-Wavenet-C' },
    { language: 'Gujarati (India)', code: 'gu-IN', name: 'gu-IN-Wavenet-D' },
    { language: 'Hebrew (Israel)', code: 'he-IL', name: 'he-IL-Wavenet-A' },
    { language: 'Hebrew (Israel)', code: 'he-IL', name: 'he-IL-Wavenet-B' },
    { language: 'Hebrew (Israel)', code: 'he-IL', name: 'he-IL-Wavenet-C' },
    { language: 'Hebrew (Israel)', code: 'he-IL', name: 'he-IL-Wavenet-D' },
    { language: 'Hindi (India)', code: 'hi-IN', name: 'hi-IN-Wavenet-A' },
    { language: 'Hindi (India)', code: 'hi-IN', name: 'hi-IN-Wavenet-B' },
    { language: 'Hindi (India)', code: 'hi-IN', name: 'hi-IN-Wavenet-C' },
    { language: 'Hindi (India)', code: 'hi-IN', name: 'hi-IN-Wavenet-D' },
    { language: 'Hindi (India)', code: 'hi-IN', name: 'hi-IN-Wavenet-E' },
    { language: 'Hindi (India)', code: 'hi-IN', name: 'hi-IN-Wavenet-F' },
    { language: 'Hungarian (Hungary)', code: 'hu-HU', name: 'hu-HU-Wavenet-B' },
    { language: 'Indonesian (Indonesia)', code: 'id-ID', name: 'id-ID-Wavenet-A' },
    { language: 'Indonesian (Indonesia)', code: 'id-ID', name: 'id-ID-Wavenet-B' },
    { language: 'Indonesian (Indonesia)', code: 'id-ID', name: 'id-ID-Wavenet-C' },
    { language: 'Indonesian (Indonesia)', code: 'id-ID', name: 'id-ID-Wavenet-D' },
    { language: 'Italian (Italy)', code: 'it-IT', name: 'it-IT-Wavenet-E' },
    { language: 'Italian (Italy)', code: 'it-IT', name: 'it-IT-Wavenet-F' },
    { language: 'Japanese (Japan)', code: 'ja-JP', name: 'ja-JP-Wavenet-A' },
    { language: 'Japanese (Japan)', code: 'ja-JP', name: 'ja-JP-Wavenet-B' },
    { language: 'Japanese (Japan)', code: 'ja-JP', name: 'ja-JP-Wavenet-C' },
    { language: 'Japanese (Japan)', code: 'ja-JP', name: 'ja-JP-Wavenet-D' },
    { language: 'Kannada (India)', code: 'kn-IN', name: 'kn-IN-Wavenet-A' },
    { language: 'Kannada (India)', code: 'kn-IN', name: 'kn-IN-Wavenet-B' },
    { language: 'Kannada (India)', code: 'kn-IN', name: 'kn-IN-Wavenet-C' },
    { language: 'Kannada (India)', code: 'kn-IN', name: 'kn-IN-Wavenet-D' },
    { language: 'Korean (South Korea)', code: 'ko-KR', name: 'ko-KR-Wavenet-A' },
    { language: 'Korean (South Korea)', code: 'ko-KR', name: 'ko-KR-Wavenet-B' },
    { language: 'Korean (South Korea)', code: 'ko-KR', name: 'ko-KR-Wavenet-C' },
    { language: 'Korean (South Korea)', code: 'ko-KR', name: 'ko-KR-Wavenet-D' },
    { language: 'Malay (Malaysia)', code: 'ms-MY', name: 'ms-MY-Wavenet-A' },
    { language: 'Malay (Malaysia)', code: 'ms-MY', name: 'ms-MY-Wavenet-B' },
    { language: 'Malay (Malaysia)', code: 'ms-MY', name: 'ms-MY-Wavenet-C' },
    { language: 'Malay (Malaysia)', code: 'ms-MY', name: 'ms-MY-Wavenet-D' },
    { language: 'Malayalam (India)', code: 'ml-IN', name: 'ml-IN-Wavenet-A' },
    { language: 'Malayalam (India)', code: 'ml-IN', name: 'ml-IN-Wavenet-B' },
    { language: 'Malayalam (India)', code: 'ml-IN', name: 'ml-IN-Wavenet-C' },
    { language: 'Malayalam (India)', code: 'ml-IN', name: 'ml-IN-Wavenet-D' },
    { language: 'Mandarin Chinese', code: 'cmn-CN', name: 'cmn-CN-Wavenet-A' },
    { language: 'Mandarin Chinese', code: 'cmn-CN', name: 'cmn-CN-Wavenet-B' },
    { language: 'Mandarin Chinese', code: 'cmn-CN', name: 'cmn-CN-Wavenet-C' },
    { language: 'Mandarin Chinese', code: 'cmn-CN', name: 'cmn-CN-Wavenet-D' },
    { language: 'Mandarin Chinese', code: 'cmn-TW', name: 'cmn-TW-Wavenet-A' },
    { language: 'Mandarin Chinese', code: 'cmn-TW', name: 'cmn-TW-Wavenet-B' },
    { language: 'Mandarin Chinese', code: 'cmn-TW', name: 'cmn-TW-Wavenet-C' },
    { language: 'Marathi (India)', code: 'mr-IN', name: 'mr-IN-Wavenet-A' },
    { language: 'Marathi (India)', code: 'mr-IN', name: 'mr-IN-Wavenet-B' },
    { language: 'Marathi (India)', code: 'mr-IN', name: 'mr-IN-Wavenet-C' },
    { language: 'Norwegian (Norway)', code: 'nb-NO', name: 'nb-NO-Wavenet-F' },
    { language: 'Norwegian (Norway)', code: 'nb-NO', name: 'nb-NO-Wavenet-G' },
    { language: 'Polish (Poland)', code: 'pl-PL', name: 'pl-PL-Wavenet-F' },
    { language: 'Polish (Poland)', code: 'pl-PL', name: 'pl-PL-Wavenet-G' },
    { language: 'Portuguese (Brazil)', code: 'pt-BR', name: 'pt-BR-Wavenet-A' },
    { language: 'Portuguese (Brazil)', code: 'pt-BR', name: 'pt-BR-Wavenet-B' },
    { language: 'Portuguese (Brazil)', code: 'pt-BR', name: 'pt-BR-Wavenet-C' },
    { language: 'Portuguese (Brazil)', code: 'pt-BR', name: 'pt-BR-Wavenet-D' },
    { language: 'Portuguese (Brazil)', code: 'pt-BR', name: 'pt-BR-Wavenet-E' },
    { language: 'Portuguese (Portugal)', code: 'pt-PT', name: 'pt-PT-Wavenet-E' },
    { language: 'Portuguese (Portugal)', code: 'pt-PT', name: 'pt-PT-Wavenet-F' },
    { language: 'Punjabi (India)', code: 'pa-IN', name: 'pa-IN-Wavenet-A' },
    { language: 'Punjabi (India)', code: 'pa-IN', name: 'pa-IN-Wavenet-B' },
    { language: 'Punjabi (India)', code: 'pa-IN', name: 'pa-IN-Wavenet-C' },
    { language: 'Punjabi (India)', code: 'pa-IN', name: 'pa-IN-Wavenet-D' },
    { language: 'Romanian (Romania)', code: 'ro-RO', name: 'ro-RO-Wavenet-B' },
    { language: 'Russian (Russia)', code: 'ru-RU', name: 'ru-RU-Wavenet-A' },
    { language: 'Russian (Russia)', code: 'ru-RU', name: 'ru-RU-Wavenet-B' },
    { language: 'Russian (Russia)', code: 'ru-RU', name: 'ru-RU-Wavenet-C' },
    { language: 'Russian (Russia)', code: 'ru-RU', name: 'ru-RU-Wavenet-D' },
    { language: 'Russian (Russia)', code: 'ru-RU', name: 'ru-RU-Wavenet-E' },
    { language: 'Slovak (Slovakia)', code: 'sk-SK', name: 'sk-SK-Wavenet-B' },
    { language: 'Spanish (Spain)', code: 'es-ES', name: 'es-ES-Wavenet-E' },
    { language: 'Spanish (Spain)', code: 'es-ES', name: 'es-ES-Wavenet-F' },
    { language: 'Spanish (Spain)', code: 'es-ES', name: 'es-ES-Wavenet-G' },
    { language: 'Spanish (Spain)', code: 'es-ES', name: 'es-ES-Wavenet-H' },
    { language: 'Spanish (US)', code: 'es-US', name: 'es-US-Wavenet-A' },
    { language: 'Spanish (US)', code: 'es-US', name: 'es-US-Wavenet-B' },
    { language: 'Spanish (US)', code: 'es-US', name: 'es-US-Wavenet-C' },
    { language: 'Swedish (Sweden)', code: 'sv-SE', name: 'sv-SE-Wavenet-A' },
    { language: 'Swedish (Sweden)', code: 'sv-SE', name: 'sv-SE-Wavenet-B' },
    { language: 'Swedish (Sweden)', code: 'sv-SE', name: 'sv-SE-Wavenet-C' },
    { language: 'Swedish (Sweden)', code: 'sv-SE', name: 'sv-SE-Wavenet-D' },
    { language: 'Swedish (Sweden)', code: 'sv-SE', name: 'sv-SE-Wavenet-E' },
    { language: 'Swedish (Sweden)', code: 'sv-SE', name: 'sv-SE-Wavenet-F' },
    { language: 'Swedish (Sweden)', code: 'sv-SE', name: 'sv-SE-Wavenet-G' },
    { language: 'Tamil (India)', code: 'ta-IN', name: 'ta-IN-Wavenet-A' },
    { language: 'Tamil (India)', code: 'ta-IN', name: 'ta-IN-Wavenet-B' },
    { language: 'Tamil (India)', code: 'ta-IN', name: 'ta-IN-Wavenet-C' },
    { language: 'Tamil (India)', code: 'ta-IN', name: 'ta-IN-Wavenet-D' },
    { language: 'Turkish (Turkey)', code: 'tr-TR', name: 'tr-TR-Wavenet-A' },
    { language: 'Turkish (Turkey)', code: 'tr-TR', name: 'tr-TR-Wavenet-B' },
    { language: 'Turkish (Turkey)', code: 'tr-TR', name: 'tr-TR-Wavenet-C' },
    { language: 'Turkish (Turkey)', code: 'tr-TR', name: 'tr-TR-Wavenet-D' },
    { language: 'Turkish (Turkey)', code: 'tr-TR', name: 'tr-TR-Wavenet-E' },
    { language: 'Ukrainian (Ukraine)', code: 'uk-UA', name: 'uk-UA-Wavenet-B' },
    { language: 'Vietnamese (Vietnam)', code: 'vi-VN', name: 'vi-VN-Wavenet-A' },
    { language: 'Vietnamese (Vietnam)', code: 'vi-VN', name: 'vi-VN-Wavenet-B' },
    { language: 'Vietnamese (Vietnam)', code: 'vi-VN', name: 'vi-VN-Wavenet-C' },
    { language: 'Vietnamese (Vietnam)', code: 'vi-VN', name: 'vi-VN-Wavenet-D' },
];

interface GoogleTTSSelectorProps {
  onVoiceSelect?: (voice: string) => void;
}

const GoogleTTSSelector: React.FC<GoogleTTSSelectorProps> = ({ onVoiceSelect }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedVoice, setSelectedVoice] = useState<string>('');

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(event.target.value);
    setSelectedVoice('');
    if (onVoiceSelect) onVoiceSelect('');
  };

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVoice(event.target.value);
    if (onVoiceSelect) onVoiceSelect(event.target.value);
  };

  const filteredVoices = selectedLanguage
    ? wavenetVoices.filter((voice) => voice.language === selectedLanguage)
    : [];

  return (
    <div>
      <h2>Google Cloud Text-to-Speech</h2>
      <div>
        <label htmlFor="language-select">Language:</label>
        <select id="language-select" value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="">Select a language</option>
          {Array.from(new Set(wavenetVoices.map((voice) => voice.language))).map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
      {selectedLanguage && (
        <div>
          <label htmlFor="voice-select">Voice:</label>
          <select id="voice-select" value={selectedVoice} onChange={handleVoiceChange}>
            <option value="">Select a voice</option>
            {filteredVoices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {selectedVoice && (
        <div>
          <h3>Selected Voice:</h3>
          <p>
            <strong>Language:</strong> {selectedLanguage}
          </p>
          <p>
            <strong>Voice Name:</strong> {selectedVoice}
          </p>
        </div>
      )}
    </div>
  );
};

export default GoogleTTSSelector;
