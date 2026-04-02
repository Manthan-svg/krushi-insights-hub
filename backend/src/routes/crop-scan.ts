import { Router, Response } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "dummy_key",
});

router.post("/", authMiddleware as any, async (req: AuthRequest, res: Response) => {
  try {
    const { image, language } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided" });
    }

    // Fallback for demo if API key is missing
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "dummy_key") {
      console.log("Mocking AI response (No API key found)");
      const mockResults: Record<string, any> = {
        en: {
          diseaseName: "Late Blight",
          severity: "Medium",
          description: "A serious fungal disease that causes water-soaked spots on leaves, rapidly turning them brown.",
          treatment: ["Remove infected leaves immediately", "Apply copper-based fungicide", "Ensure good air circulation"],
          precautions: ["Avoid overhead watering", "Use certified disease-free seeds", "Space plants properly"],
        },
        mr: {
          diseaseName: "करपा (Late Blight)",
          severity: "Medium",
          description: "हा एक गंभीर बुरशीजन्य रोग आहे ज्यामुळे पानांवर पाणी साचल्यासारखे ठिपके पडतात आणि पाने वेगाने तपकिरी होतात.",
          treatment: ["बाधित पाने त्वरित काढून टाका", "ताम्रयुक्त बुरशीनाशकाची फवारणी करा", "काढणीनंतर शेत स्वच्छ ठेवा"],
          precautions: ["पिकांवर थेट पाणी टाळणे टाळा", "प्रमाणित बियाणे वापरा", "रोपांमध्ये योग्य अंतर ठेवा"],
        },
        hi: {
          diseaseName: "पछैती झुलसा (Late Blight)",
          severity: "Medium",
          description: "यह एक गंभीर कवक रोग है जिससे पत्तियों पर पानी से भीगे हुए धब्बे बन जाते हैं और वे तेजी से भूरी हो जाती हैं।",
          treatment: ["संक्रमित पत्तियों को तुरंत हटा दें", "कॉपर-आधारित कवकनाशक का प्रयोग करें", "खेत में अच्छी जलनिकासी सुनिश्चित करें"],
          precautions: ["ऊपर से सिंचाई करने से बचें", "प्रमाणित रोग-मुक्त बीजों का उपयोग करें", "पौधों के बीच उचित दूरी रखें"],
        }
      };

      return res.json(mockResults[language] || mockResults.en);
    }

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1500,
      temperature: 0,
      system: "You are an expert agricultural scientist specializing in Indian crop diseases. Analyze the provided image and identify any diseases. Return a VALID STICK JSON object ONLY. JSON keys must be: diseaseName, severity (Healthy, Low, Medium, High), description, treatment (array of strings), precautions (array of strings). Do NOT include any markdown formatting or meta-text. Ensure all content is in the requested language.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: "image/jpeg",
                data: image.split(",")[1] || image,
              },
            },
            {
              type: "text",
              text: `Analyze this crop image and provide details in ${language === 'mr' ? 'Marathi' : language === 'hi' ? 'Hindi' : 'English'}. Return JSON ONLY.`,
            },
          ],
        },
      ],
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : "";
    
    try {
      const parsed = JSON.parse(content.replace(/```json|```/g, "").trim());
      res.json(parsed);
    } catch (parseError) {
      console.error("AI Response Parsing Error:", content);
      res.status(500).json({ error: "Failed to parse AI response" });
    }
  } catch (error: any) {
    console.error("Crop Scan Error:", error);
    res.status(500).json({ error: "AI analysis failed", details: error.message });
  }
});

export const cropScanRouter = router;
