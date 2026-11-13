/**
 * Vyapaar AI Multilingual Speech Synthesis Engine
 * 
 * Intelligently bridges Web Speech API across Windows, Chrome, Edge, and Android:
 * 1. Queries available browser voices (waiting for async voice loading if needed).
 * 2. Checks if a native regional voice (hi-IN, te-IN, ta-IN, kn-IN) is installed.
 * 3. If native voice exists, speaks the native script text.
 * 4. If only an English / system voice is available (common on Windows PCs without Indian regional packs),
 *    it automatically selects the best Indian English (en-IN) voice and speaks a phonetically-tuned
 *    transliteration so the voice speaks fluent Hindi, Telugu, Tamil, Kannada, or English without skipping words!
 */

export const LANG_CODE_MAP: Record<string, string> = {
  Hindi: "hi-IN",
  Telugu: "te-IN",
  Tamil: "ta-IN",
  Kannada: "kn-IN",
  English: "en-IN",
  Hinglish: "hi-IN",
};

/**
 * Strips markdown symbols, asterisks, bullet points, and formats numbers for natural speech.
 */
export function cleanTextForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
    .replace(/\*(.*?)\*/g, "$1")     // Italic
    .replace(/`(.*?)`/g, "$1")       // Code
    .replace(/^•\s*/gm, "")          // Bullet points
    .replace(/#+\s*/g, "")           // Headings
    .replace(/₹(\d+),?(\d*)/g, "$1$2 rupees") // Currency
    .replace(/[\n\r]+/g, ". ")       // Newlines to pause
    .trim();
}

/**
 * Finds the best available voice in the browser for a given language.
 */
export function findBestVoice(lang: string, voices: SpeechSynthesisVoice[]): {
  voice: SpeechSynthesisVoice | null;
  isNative: boolean;
} {
  const langLower = lang.toLowerCase();
  const targetCode = LANG_CODE_MAP[lang] || "hi-IN";
  const prefix = targetCode.split("-")[0]; // "hi", "te", "ta", "kn", "en"

  // 1. Try exact language prefix match (e.g. te-IN, hi-IN)
  const exactMatch = voices.find(
    (v) => v.lang.toLowerCase().startsWith(prefix) || v.name.toLowerCase().includes(langLower)
  );
  if (exactMatch) {
    return { voice: exactMatch, isNative: true };
  }

  // 2. Try Indian English voice (e.g. Google Indian English, Microsoft Neerja, en-IN)
  const indianEnglish = voices.find(
    (v) => v.lang.toLowerCase() === "en-in" || v.name.toLowerCase().includes("india")
  );
  if (indianEnglish) {
    return { voice: indianEnglish, isNative: false };
  }

  // 3. Try any English voice
  const anyEnglish = voices.find((v) => v.lang.toLowerCase().startsWith("en"));
  if (anyEnglish) {
    return { voice: anyEnglish, isNative: false };
  }

  // 4. Fallback to first available or null (browser default)
  return { voice: voices[0] || null, isNative: false };
}

/**
 * Speaks text using the best voice available.
 */
export function speakText(
  nativeText: string,
  phoneticText: string,
  language: string,
  onEnd?: () => void,
  onError?: () => void
): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported in this browser.");
    if (onError) onError();
    return;
  }

  window.speechSynthesis.cancel(); // Stop any currently playing audio

  const doSpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    const { voice, isNative } = findBestVoice(language, voices);

    // If native voice exists, use native script; otherwise use phonetic transliteration so English voice doesn't fail
    const textToSpeak = isNative ? nativeText : (phoneticText || nativeText);
    const cleaned = cleanTextForSpeech(textToSpeak);

    const utterance = new SpeechSynthesisUtterance(cleaned);

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = LANG_CODE_MAP[language] || "hi-IN";
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn("Speech synthesis utterance error:", e);
      if (onError) onError();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Chrome loads voices asynchronously
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    doSpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.onvoiceschanged = null;
      doSpeak();
    };
    // Timeout fallback if onvoiceschanged doesn't fire
    setTimeout(() => {
      if (window.speechSynthesis.speaking) return;
      doSpeak();
    }, 250);
  }
}

/**
 * Stops any active speech.
 */
export function stopSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
