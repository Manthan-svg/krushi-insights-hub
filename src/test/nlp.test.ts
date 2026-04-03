
import { describe, it, expect } from 'vitest';
import { parseJobFromSpeech } from '../lib/nlp';

describe('NLP Parser', () => {
  it('should parse English job description correctly', () => {
    const text = "I need 3 workers for wheat harvesting. Pay is 500 rupees per day for 2 days near Pune.";
    const result = parseJobFromSpeech(text, "en");
    expect(result.title).toBe("Harvesting Job");
    expect(result.wages).toBe(500);
    expect(result.duration).toBe(2);
    expect(result.location).toBe("pune");
  });

  it('should parse Marathi harvesting phrase correctly', () => {
    const text = "मला उद्या कापणीसाठी कामगार हवे आहेत";
    const result = parseJobFromSpeech(text, "mr");
    expect(result.title).toBe("कापणीचे काम");
  });

  it('should parse Marathi wages and duration correctly', () => {
    const text = "५०० रुपये मजुरी आणि ५ दिवस काम";
    const result = parseJobFromSpeech(text, "mr");
    expect(result.wages).toBe(500);
    expect(result.duration).toBe(5);
  });
});
