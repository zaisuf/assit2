// Simple language detection using Intl.Segmenter and Unicode ranges
export function detectLanguage(text: string): string {
  if (!text) return "en";
  // Devanagari (Hindi)
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  // Japanese (Hiragana, Katakana, Kanji)
  if (/[\u3040-\u30FF\u4E00-\u9FFF]/.test(text)) return "ja";
  // Chinese (CJK Unified Ideographs)
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";
  // Spanish (basic check for ñ, á, é, í, ó, ú, ü)
  if (/[ñáéíóúü]/i.test(text)) return "es";
  // French (basic check for ç, é, è, ê, ë, à, â, î, ï, ô, û, ù, ü, œ)
  if (/[çéèêëàâîïôûùüœ]/i.test(text)) return "fr";
  // Italian (basic check for à, è, é, ì, ò, ù)
  if (/[àèéìòù]/i.test(text)) return "it";
  // Portuguese (basic check for ã, õ, ç, á, é, í, ó, ú)
  if (/[ãõçáéíóú]/i.test(text)) return "pt";
  // Default to English
  return "en";
}

// Map language code to a default voice
export function getDefaultVoice(language: string): string {
  switch (language) {
    case "hi":
      return "hf_alpha";
    case "ja":
      return "jf_alpha";
    case "zh":
      return "cm_wei";
    case "es":
      return "sf_maria";
    case "fr":
      return "ff_jeanne";
    case "it":
      return "if_sara";
    case "pt":
      return "pf_dora";
    default:
      return "af_bella";
  }
}
