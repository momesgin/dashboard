import { ref } from 'vue';

export function useSpeechRecognition() {
  const isListening = ref(false);
  const transcript = ref('');
  const error = ref<string | null>(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const isSupported = !!SpeechRecognition;

  let recognition: SpeechRecognition | null = null;

  if (isSupported) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isListening.value = true;
      error.value = null;
    };

    recognition.onend = () => {
      isListening.value = false;
    };

    recognition.onerror = (event) => {
      error.value = `Speech recognition error: ${event.error}`;
      isListening.value = false;
    };

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      transcript.value = event.results[last][0].transcript;
      isListening.value = false; // Stop listening after a result is received
    };
  } else {
    error.value = 'Speech recognition is not supported in this browser.';
  }

  const startListening = () => {
    if (!isSupported || !recognition) {
      return;
    }
    if (isListening.value) {
      return;
    }
    transcript.value = '';
    error.value = null;
    recognition.start();
  };

  const stopListening = () => {
    if (!isSupported || !recognition) {
      return;
    }
    if (isListening.value) {
      recognition.stop();
    }
  };

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
  };
}
