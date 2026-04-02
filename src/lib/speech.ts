export const speakConfirmation = (message: string, languageCode: "en" | "hi" | "mr") => {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(message);
  
  if (languageCode === "hi") utterance.lang = "hi-IN";
  else if (languageCode === "mr") utterance.lang = "mr-IN";
  else utterance.lang = "en-IN";

  // Attempt to find a native-sounding voice if available
  const voices = window.speechSynthesis.getVoices();
  const targetVoice = voices.find((v) => v.lang.includes(utterance.lang));
  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  window.speechSynthesis.speak(utterance);
};
