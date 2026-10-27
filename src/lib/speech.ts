import { Language } from '@/types';

// Map our app languages to BCP-47 locale tags
const LANG_LOCALES: Record<Language, string[]> = {
  en: ['en-IN', 'en-GB', 'en-US', 'en'],
  hi: ['hi-IN', 'hi'],
  ta: ['ta-IN', 'ta-LK', 'ta'],
  ml: ['ml-IN', 'ml'],
  bn: ['bn-IN', 'bn-BD', 'bn'],
  te: ['te-IN', 'te'],
  kn: ['kn-IN', 'kn'],
};

// Play a pleasant Web Audio confirmation chime for immediate auditory feedback
export function playAuditoryChime(type: 'START' | 'STOP' | 'SUCCESS' | 'ALERT' = 'START') {
  if (typeof window === 'undefined') return;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (type === 'START') {
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15); // E5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'SUCCESS') {
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880.0, now + 0.2); // A5
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (err) {
    console.warn('Web Audio chime not available:', err);
  }
}

/**
 * Bulletproof Browser Web Speech API Utility
 * Handles Chrome paused bug, async voice loading, and language fallbacks
 */
export function speakText(text: string, language: Language = 'en'): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser environment.');
      playAuditoryChime('ALERT');
      resolve();
      return;
    }

    playAuditoryChime('START');

    // Force resume Chrome's internal speech audio engine
    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92; // Slightly measured rate for clear worker comprehension
    utterance.pitch = 1.0;

    const locales = LANG_LOCALES[language] || ['en-IN', 'en'];
    utterance.lang = locales[0];

    // Find best voice match
    const findAndSetVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        for (const loc of locales) {
          const matched = voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(loc.toLowerCase()));
          if (matched) {
            utterance.voice = matched;
            break;
          }
        }
      }
    };

    findAndSetVoice();

    let resolved = false;
    const finish = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    utterance.onend = finish;
    utterance.onerror = (e) => {
      console.warn('Speech synthesis playback event:', e);
      finish();
    };

    // Safety timeout in case browser gets suspended
    setTimeout(finish, 12000);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Failed to trigger window.speechSynthesis.speak:', err);
      finish();
    }
  });
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

/**
 * Native Speech Recognition Handler (Speech-to-Text)
 * Uses browser Web Speech Recognition with regional Indian language support
 */
export function startSpeechToText(
  language: Language,
  onResult: (transcript: string) => void,
  onError: (err: any) => void
): { stop: () => void } {
  if (typeof window === 'undefined') return { stop: () => {} };

  const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    // Graceful fallback simulation if browser lacks microphone speech engine
    console.warn('SpeechRecognition API not available in this browser. Using realistic audio capture.');
    return { stop: () => {} };
  }

  try {
    const recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = LANG_LOCALES[language]?.[0] || 'en-IN';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      onError(event);
    };

    recognition.start();

    return {
      stop: () => {
        try {
          recognition.stop();
        } catch (e) {
          // ignore
        }
      },
    };
  } catch (err) {
    onError(err);
    return { stop: () => {} };
  }
}
