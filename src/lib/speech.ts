import { Language } from '@/types';

export function speakText(text: string, language: Language = 'en'): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      resolve();
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95; // Slightly slower for clear comprehension
    utterance.pitch = 1.0;

    const langCodes: Record<Language, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      ml: 'ml-IN',
      bn: 'bn-IN',
      te: 'te-IN',
      kn: 'kn-IN',
    };

    utterance.lang = langCodes[language] || 'en-IN';

    // Attempt to match best regional voice if available
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(utterance.lang) || v.lang.includes('IN'));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      resolve(); // Graceful resolve
    };

    window.speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}
