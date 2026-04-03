// A super lightweight local NLP for extracting job data from voice inputs
export const parseJobFromSpeech = (text: string, lang: string = "en") => {
  const lower = text.toLowerCase();
  
  // Convert devanagari numbers to english numbers for easier parsing
  const normalizedText = lower.replace(/[०-९]/g, (d) => String(d.charCodeAt(0) - 2406));
  
  // Defaults
  let title = "Farm Labor Required";
  let wages = 300;
  let duration = 1;
  let location = "Local Area"; 
  
  // Extract Wages
  const wageMatch = normalizedText.match(/(wage|wages|savage|pay|salary|rupees|rs|मजुरी|रुपये|पगार|₹)\s*(of\s*|चे\s*)?(\d+)/i);
  if (wageMatch) {
    wages = parseInt(wageMatch[3], 10);
  } else {
    // try reversed like "500 rupees", "५०० रुपये"
    const backupMatch = normalizedText.match(/(\d+)\s*(rupees|rs|bucks|rupaiye|रुपये|मजुरी|₹)/i);
    if (backupMatch) wages = parseInt(backupMatch[1], 10);
    else {
      const numMatch = normalizedText.match(/\b([2-9]\d{2,}|1\d{3,})\b/);
      if (numMatch) wages = parseInt(numMatch[1], 10);
    }
  }

  // Extract Duration
  const durationMatch = normalizedText.match(/(\d+)\s*(days|weeks|din|mahina|दिवस|आठवडे|महिना)/i);
  if (durationMatch) {
     duration = parseInt(durationMatch[1], 10);
     const word = durationMatch[2];
     if (word.includes("week") || word.includes("आठवडे")) duration *= 7;
     if (word.includes("mahina") || word.includes("महिना")) duration *= 30;
  }

  // Extract Location
  const locMatch = normalizedText.match(/\b(near|in|at)\b\s+([A-Za-z]+)|(pas|जवळ|मध्ये|येथे)\s+([अ-ज्ञ]+)/i);
  if (locMatch) location = locMatch[2] || locMatch[4];

  // Keyword-based Title deduction
  if (normalizedText.match(/harvest|katni|kapni|कापणी|कटाई|कामगार हवे आहेत/)) {
    if (lang === "mr" || normalizedText.includes("कामगार हवे आहेत")) title = "कापणीचे काम";
    else if (lang === "hi") title = "कटाई का काम";
    else title = "Harvesting Job";
  } else if (normalizedText.match(/plant|bovni|perni|पेरणी|बुवाई/)) {
    if (lang === "mr") title = "पेरणीचे काम";
    else if (lang === "hi") title = "बुवाई का काम";
    else title = "Planting Job";
  } else if (normalizedText.match(/clean|saaf|स्वच्छता|सफाई/)) {
    if (lang === "mr") title = "शेतीची स्वच्छता";
    else if (lang === "hi") title = "खेत की सफाई";
    else title = "Field Cleaning";
  } else if (normalizedText.match(/spray|फवारणी|छिड़काव/)) {
    if (lang === "mr") title = "फवारणीचे काम";
    else if (lang === "hi") title = "छिड़काव का काम";
    else title = "Pesticide Spraying";
  } else if (normalizedText.match(/plough|nangarni|naangar|नांगरणी|हलमार्ग/)) {
    if (lang === "mr") title = "नांगरणीचे काम";
    else if (lang === "hi") title = "जुताई का काम";
    else title = "Ploughing Job";
  }

  const descPrefix = lang === "mr" ? "आवाज द्वारे स्वयंचलित:" : lang === "hi" ? "आवाज द्वारा स्वचालित:" : "Auto-generated from voice:";

  return { title, description: `${descPrefix} "${text}"`, wages, duration, location };
};
