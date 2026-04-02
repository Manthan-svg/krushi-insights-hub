import { useState, useCallback, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// Polyfill for vendor prefixes
const SpeechRecognitionAPI =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { language } = useLanguage();
  const recognitionRef = useRef<any>(null);

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) {
      alert("Speech Recognition API is not supported in this browser. Please use Chrome/Edge.");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    
    // Map internal language codes to BCP 47 tags for Speech API
    if (language === "hi") recognition.lang = "hi-IN";
    else if (language === "mr") recognition.lang = "mr-IN";
    else recognition.lang = "en-IN";

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const resultObj = event.results[current];
      const text = resultObj[0].transcript;
      setTranscript(text);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [language]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript: useCallback(() => setTranscript(""), []),
  };
};
