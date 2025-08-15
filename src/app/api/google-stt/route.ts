// All supported Google STT languages (as of August 2025)
// Format: { code: 'xx-XX', label: 'Language (Country/Region)' }
export const GOOGLE_STT_LANGUAGES = [
  { code: 'af-ZA', label: 'Afrikaans (South Africa)' },
  { code: 'am-ET', label: 'Amharic (Ethiopia)' },
  { code: 'ar-AE', label: 'Arabic (U.A.E.)' },
  { code: 'ar-BH', label: 'Arabic (Bahrain)' },
  { code: 'ar-DZ', label: 'Arabic (Algeria)' },
  { code: 'ar-EG', label: 'Arabic (Egypt)' },
  { code: 'ar-IL', label: 'Arabic (Israel)' },
  { code: 'ar-IQ', label: 'Arabic (Iraq)' },
  { code: 'ar-JO', label: 'Arabic (Jordan)' },
  { code: 'ar-KW', label: 'Arabic (Kuwait)' },
  { code: 'ar-LB', label: 'Arabic (Lebanon)' },
  { code: 'ar-MA', label: 'Arabic (Morocco)' },
  { code: 'ar-OM', label: 'Arabic (Oman)' },
  { code: 'ar-PS', label: 'Arabic (Palestinian Authority)' },
  { code: 'ar-QA', label: 'Arabic (Qatar)' },
  { code: 'ar-SA', label: 'Arabic (Saudi Arabia)' },
  { code: 'ar-TN', label: 'Arabic (Tunisia)' },
  { code: 'ar-YE', label: 'Arabic (Yemen)' },
  { code: 'az-AZ', label: 'Azerbaijani (Azerbaijan)' },
  { code: 'bg-BG', label: 'Bulgarian (Bulgaria)' },
  { code: 'bn-BD', label: 'Bengali (Bangladesh)' },
  { code: 'bn-IN', label: 'Bengali (India)' },
  { code: 'ca-ES', label: 'Catalan (Spain)' },
  { code: 'cs-CZ', label: 'Czech (Czech Republic)' },
  { code: 'da-DK', label: 'Danish (Denmark)' },
  { code: 'de-DE', label: 'German (Germany)' },
  { code: 'el-GR', label: 'Greek (Greece)' },
  { code: 'en-AU', label: 'English (Australia)' },
  { code: 'en-CA', label: 'English (Canada)' },
  { code: 'en-GB', label: 'English (United Kingdom)' },
  { code: 'en-GH', label: 'English (Ghana)' },
  { code: 'en-HK', label: 'English (Hong Kong)' },
  { code: 'en-IE', label: 'English (Ireland)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'en-KE', label: 'English (Kenya)' },
  { code: 'en-NG', label: 'English (Nigeria)' },
  { code: 'en-NZ', label: 'English (New Zealand)' },
  { code: 'en-PH', label: 'English (Philippines)' },
  { code: 'en-PK', label: 'English (Pakistan)' },
  { code: 'en-SG', label: 'English (Singapore)' },
  { code: 'en-TZ', label: 'English (Tanzania)' },
  { code: 'en-US', label: 'English (United States)' },
  { code: 'en-ZA', label: 'English (South Africa)' },
  { code: 'es-AR', label: 'Spanish (Argentina)' },
  { code: 'es-BO', label: 'Spanish (Bolivia)' },
  { code: 'es-CL', label: 'Spanish (Chile)' },
  { code: 'es-CO', label: 'Spanish (Colombia)' },
  { code: 'es-CR', label: 'Spanish (Costa Rica)' },
  { code: 'es-DO', label: 'Spanish (Dominican Republic)' },
  { code: 'es-EC', label: 'Spanish (Ecuador)' },
  { code: 'es-ES', label: 'Spanish (Spain)' },
  { code: 'es-GT', label: 'Spanish (Guatemala)' },
  { code: 'es-HN', label: 'Spanish (Honduras)' },
  { code: 'es-MX', label: 'Spanish (Mexico)' },
  { code: 'es-NI', label: 'Spanish (Nicaragua)' },
  { code: 'es-PA', label: 'Spanish (Panama)' },
  { code: 'es-PE', label: 'Spanish (Peru)' },
  { code: 'es-PR', label: 'Spanish (Puerto Rico)' },
  { code: 'es-PY', label: 'Spanish (Paraguay)' },
  { code: 'es-SV', label: 'Spanish (El Salvador)' },
  { code: 'es-US', label: 'Spanish (United States)' },
  { code: 'es-UY', label: 'Spanish (Uruguay)' },
  { code: 'es-VE', label: 'Spanish (Venezuela)' },
  { code: 'et-EE', label: 'Estonian (Estonia)' },
  { code: 'eu-ES', label: 'Basque (Spain)' },
  { code: 'fa-IR', label: 'Persian (Iran)' },
  { code: 'fi-FI', label: 'Finnish (Finland)' },
  { code: 'fil-PH', label: 'Filipino (Philippines)' },
  { code: 'fr-BE', label: 'French (Belgium)' },
  { code: 'fr-CA', label: 'French (Canada)' },
  { code: 'fr-CH', label: 'French (Switzerland)' },
  { code: 'fr-FR', label: 'French (France)' },
  { code: 'gl-ES', label: 'Galician (Spain)' },
  { code: 'gu-IN', label: 'Gujarati (India)' },
  { code: 'he-IL', label: 'Hebrew (Israel)' },
  { code: 'hi-IN', label: 'Hindi (India)' },
  { code: 'hr-HR', label: 'Croatian (Croatia)' },
  { code: 'hu-HU', label: 'Hungarian (Hungary)' },
  { code: 'hy-AM', label: 'Armenian (Armenia)' },
  { code: 'id-ID', label: 'Indonesian (Indonesia)' },
  { code: 'is-IS', label: 'Icelandic (Iceland)' },
  { code: 'it-IT', label: 'Italian (Italy)' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'jv-ID', label: 'Javanese (Indonesia)' },
  { code: 'ka-GE', label: 'Georgian (Georgia)' },
  { code: 'kk-KZ', label: 'Kazakh (Kazakhstan)' },
  { code: 'km-KH', label: 'Khmer (Cambodia)' },
  { code: 'kn-IN', label: 'Kannada (India)' },
  { code: 'ko-KR', label: 'Korean (South Korea)' },
  { code: 'lo-LA', label: 'Lao (Laos)' },
  { code: 'lt-LT', label: 'Lithuanian (Lithuania)' },
  { code: 'lv-LV', label: 'Latvian (Latvia)' },
  { code: 'mk-MK', label: 'Macedonian (North Macedonia)' },
  { code: 'ml-IN', label: 'Malayalam (India)' },
  { code: 'mn-MN', label: 'Mongolian (Mongolia)' },
  { code: 'mr-IN', label: 'Marathi (India)' },
  { code: 'ms-MY', label: 'Malay (Malaysia)' },
  { code: 'my-MM', label: 'Burmese (Myanmar)' },
  { code: 'ne-NP', label: 'Nepali (Nepal)' },
  { code: 'nl-BE', label: 'Dutch (Belgium)' },
  { code: 'nl-NL', label: 'Dutch (Netherlands)' },
  { code: 'no-NO', label: 'Norwegian (Norway)' },
  { code: 'or-IN', label: 'Odia (India)' },
  { code: 'pa-Guru-IN', label: 'Punjabi (India)' },
  { code: 'pl-PL', label: 'Polish (Poland)' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)' },
  { code: 'pt-PT', label: 'Portuguese (Portugal)' },
  { code: 'ro-RO', label: 'Romanian (Romania)' },
  { code: 'ru-RU', label: 'Russian (Russia)' },
  { code: 'si-LK', label: 'Sinhala (Sri Lanka)' },
  { code: 'sk-SK', label: 'Slovak (Slovakia)' },
  { code: 'sl-SI', label: 'Slovenian (Slovenia)' },
  { code: 'so-SO', label: 'Somali (Somalia)' },
  { code: 'sq-AL', label: 'Albanian (Albania)' },
  { code: 'sr-RS', label: 'Serbian (Serbia)' },
  { code: 'su-ID', label: 'Sundanese (Indonesia)' },
  { code: 'sv-SE', label: 'Swedish (Sweden)' },
  { code: 'sw-KE', label: 'Swahili (Kenya)' },
  { code: 'ta-IN', label: 'Tamil (India)' },
  { code: 'ta-LK', label: 'Tamil (Sri Lanka)' },
  { code: 'ta-MY', label: 'Tamil (Malaysia)' },
  { code: 'ta-SG', label: 'Tamil (Singapore)' },
  { code: 'te-IN', label: 'Telugu (India)' },
  { code: 'th-TH', label: 'Thai (Thailand)' },
  { code: 'tr-TR', label: 'Turkish (Turkey)' },
  { code: 'uk-UA', label: 'Ukrainian (Ukraine)' },
  { code: 'ur-IN', label: 'Urdu (India)' },
  { code: 'ur-PK', label: 'Urdu (Pakistan)' },
  { code: 'uz-UZ', label: 'Uzbek (Uzbekistan)' },
  { code: 'vi-VN', label: 'Vietnamese (Vietnam)' },
  { code: 'zu-ZA', label: 'Zulu (South Africa)' },
];
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('file') as Blob;
    console.log('Received audio file type:', audioFile?.type);
    const languageCode = formData.get('languageCode') as string || 'en-US';

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Convert the blob to base64
    try {
      const arrayBuffer = await audioFile.arrayBuffer();
      console.log('Audio file size:', arrayBuffer.byteLength, 'bytes');
      const audioBuffer = Buffer.from(arrayBuffer);
      const audioContent = audioBuffer.toString('base64');

    // Log audio details for debugging
    console.log('Audio duration (if available):', audioFile.size / (48000 * 2), 'seconds');
    
    // Always use 'default' model for all languages
    const googlePayload = {
      config: {
        encoding: audioFile.type.includes('webm') ? 'WEBM_OPUS' : 'LINEAR16',
        sampleRateHertz: 48000,
        languageCode: languageCode,
        model: 'default',
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: true,
        useEnhanced: true,
      },
      audio: {
        content: audioContent,
      },
    };
    console.log('Google STT request payload:', JSON.stringify(googlePayload).slice(0, 500));

    const apiKey = process.env.GOOGLE_CLOUD_API_KEY;
    if (!apiKey) {
      console.error('Google STT Error: API key missing');
      return NextResponse.json({ error: 'Google Cloud API key is missing in environment.' }, { status: 500 });
    }

    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(googlePayload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google STT API error response:', errorText);
      return NextResponse.json({ error: `Google STT API error: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    console.log('Google STT API response:', JSON.stringify(data).slice(0, 500));

    if (!data.results || data.results.length === 0) {
      console.log('No transcription results returned from Google STT');
      console.log('Full API response:', JSON.stringify(data));
      return NextResponse.json({ 
        error: 'No transcription results', 
        details: 'The audio file was processed but no speech was detected or transcribed',
        apiResponse: data 
      }, { status: 422 });
    }

    const transcription = data.results
      .map((result: any) => result.alternatives[0].transcript)
      .join(' ');

    return NextResponse.json({ text: transcription });
    } catch (audioError) {
      console.error('Audio processing error:', audioError);
      return NextResponse.json({ error: 'Failed to process audio file' }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Google STT Error:', error);
    return NextResponse.json(
      { error: error.message || 'Speech-to-text failed' },
      { status: 500 }
    );
  }
}
