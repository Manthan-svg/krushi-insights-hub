import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { Mic, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface FloatingMicButtonProps {
  onResult: (text: string) => void;
}

export const FloatingMicButton = ({ onResult }: FloatingMicButtonProps) => {
  const { isListening, transcript, startListening, stopListening, resetTranscript } = useSpeechRecognition();

  const processedRef = useRef(false);

  useEffect(() => {
    // When listening stops, process the transcript if it exists and hasn't been processed yet
    if (!isListening && transcript && !processedRef.current) {
      processedRef.current = true;
      toast.success(`Heard: "${transcript}"`);
      onResult(transcript);
      // Let React safely process the render cycle before resetting
      setTimeout(() => resetTranscript(), 0);
    } else if (isListening) {
      processedRef.current = false;
    }
  }, [isListening, transcript, onResult, resetTranscript]);

  const toggleListen = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return (
    <button
      onClick={toggleListen}
      className={`fixed bottom-24 right-5 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all z-50 ${
        isListening
          ? "bg-red-500 text-white animate-pulse scale-110"
          : "bg-primary text-primary-foreground hover:scale-105 active:scale-95"
      }`}
      aria-label="Voice Command"
    >
      {isListening ? <Loader2 className="w-6 h-6 animate-spin" /> : <Mic className="w-6 h-6" />}
    </button>
  );
};
