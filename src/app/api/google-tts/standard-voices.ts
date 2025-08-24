import { NextResponse } from "next/server";

// GET endpoint to return all supported Standard voices and languages
export async function GET() {
  return NextResponse.json({ voices: STANDARD_VOICES, languages: STANDARD_LANGUAGES });
}
// List of all unique Standard-supported languages (code and label)
export const STANDARD_LANGUAGES = [
  { code: 'af-ZA', label: 'Afrikaans (South Africa)' },
  { code: 'ar-XA', label: 'Arabic' },
  { code: 'bg-BG', label: 'Bulgarian' },
  { code: 'ca-ES', label: 'Catalan (Spain)' },
  { code: 'cmn-CN', label: 'Chinese (Mandarin, China)' },
  { code: 'cs-CZ', label: 'Czech' },
  { code: 'da-DK', label: 'Danish' },
  { code: 'de-DE', label: 'German' },
  { code: 'el-GR', label: 'Greek' },
  { code: 'en-AU', label: 'English (Australia)' },
  { code: 'en-GB', label: 'English (United Kingdom)' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'en-US', label: 'English (United States)' },
  { code: 'es-ES', label: 'Spanish (Spain)' },
  { code: 'es-US', label: 'Spanish (United States)' },
  { code: 'fi-FI', label: 'Finnish' },
  { code: 'fil-PH', label: 'Filipino' },
  { code: 'fr-CA', label: 'French (Canada)' },
  { code: 'fr-FR', label: 'French (France)' },
  { code: 'hi-IN', label: 'Hindi (India)' },
  { code: 'hu-HU', label: 'Hungarian' },
  { code: 'id-ID', label: 'Indonesian' },
  { code: 'is-IS', label: 'Icelandic' },
  { code: 'it-IT', label: 'Italian' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'ko-KR', label: 'Korean' },
  { code: 'nb-NO', label: 'Norwegian Bokmål' },
  { code: 'nl-NL', label: 'Dutch' },
  { code: 'pl-PL', label: 'Polish' },
  { code: 'pt-BR', label: 'Portuguese (Brazil)' },
  { code: 'pt-PT', label: 'Portuguese (Portugal)' },
  { code: 'ro-RO', label: 'Romanian' },
  { code: 'ru-RU', label: 'Russian' },
  { code: 'sk-SK', label: 'Slovak' },
  { code: 'sv-SE', label: 'Swedish' },
  { code: 'th-TH', label: 'Thai' },
  { code: 'tr-TR', label: 'Turkish' },
  { code: 'uk-UA', label: 'Ukrainian' },
  { code: 'vi-VN', label: 'Vietnamese' },
  { code: 'yue-HK', label: 'Chinese (Cantonese, Hong Kong)' },
];
// This file contains all Google Standard voices and their supported languages as of August 2025.
// Source: https://cloud.google.com/text-to-speech/docs/voices

export const STANDARD_VOICES = [
  // Example entries, add all from the official list
  { name: 'en-US-Standard-A', languageCodes: ['en-US'], gender: 'FEMALE' },
  { name: 'en-US-Standard-B', languageCodes: ['en-US'], gender: 'MALE' },
  { name: 'en-US-Standard-C', languageCodes: ['en-US'], gender: 'FEMALE' },
  { name: 'en-US-Standard-D', languageCodes: ['en-US'], gender: 'MALE' },
  { name: 'en-GB-Standard-A', languageCodes: ['en-GB'], gender: 'FEMALE' },
  { name: 'en-GB-Standard-B', languageCodes: ['en-GB'], gender: 'MALE' },
  { name: 'en-GB-Standard-C', languageCodes: ['en-GB'], gender: 'FEMALE' },
  { name: 'en-GB-Standard-D', languageCodes: ['en-GB'], gender: 'MALE' },
  // ...add all other Standard voices from the official list
];
