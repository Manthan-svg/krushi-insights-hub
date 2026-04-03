
import { parseJobFromSpeech } from './src/lib/nlp';

const testCases = [
  { text: "I need 3 workers for wheat harvesting. Pay is 500 rupees per day for 2 days near Pune.", lang: "en" },
  { text: "मला उद्या कापणीसाठी कामगार हवे आहेत", lang: "mr" },
  { text: "५०० रुपये मजुरी आणि ५ दिवस काम", lang: "mr" }
];

testCases.forEach(tc => {
  const result = parseJobFromSpeech(tc.text, tc.text.includes("मला") ? "mr" : tc.lang);
  console.log(`Input: ${tc.text}`);
  console.log(`Result:`, JSON.stringify(result, null, 2));
  console.log('---');
});
