import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, Loader2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Badge } from "@/components/ui/badge";

interface ScanResult {
  diseaseName: string;
  severity: "Healthy" | "Low" | "Medium" | "High";
  description: string;
  treatment: string[];
  precautions: string[];
}

const CropScan = () => {
  const { t, language } = useLanguage();
  const [image, setImage] = useState<string | null>(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyseCrop = async () => {
    if (!image) {
      toast.error(t.cropScan.noImage);
      return;
    }

    setIsAnalysing(true);
    try {
      const response = await axios.post("/api/crop-scan", {
        image,
        language
      });
      setResult(response.data);
      toast.success(t.common.success);
    } catch (error) {
      console.error("AI Scan Error:", error);
      toast.error(t.common.error);
    } finally {
      setIsAnalysing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "healthy": return "bg-green-500/10 text-green-600 border-green-200";
      case "low": return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "medium": return "bg-orange-500/10 text-orange-600 border-orange-200";
      case "high": return "bg-red-500/10 text-red-600 border-red-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const resetScan = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <MobileLayout title={t.cropScan.title}>
      <div className="px-4 py-6 space-y-6">
        {!result ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-bold text-foreground">{t.cropScan.title}</h2>
              <p className="text-sm text-muted-foreground">{t.cropScan.uploadPrompt}</p>
            </div>

            <div 
              className={`relative aspect-square rounded-3xl border-2 border-dashed flex flex-col items-center justify-center transition-all ${
                image ? "border-primary/50 bg-muted/30" : "border-muted-foreground/20 bg-muted/10"
              }`}
              onClick={() => !isAnalysing && fileInputRef.current?.click()}
            >
              {image ? (
                <img src={image} alt="Crop to scan" className="w-full h-full object-cover rounded-[22px]" />
              ) : (
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-sm">
                    <Camera className="w-8 h-8 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Capture or Upload</span>
                </div>
              )}
              <input 
                type="file" 
                hidden 
                ref={fileInputRef} 
                onChange={handleImageSelect} 
                accept="image/*" 
                capture="environment"
              />
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 rounded-2xl h-14 gap-2" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalysing}
              >
                <Upload className="w-5 h-5" />
                {image ? "Change Photo" : "Gallery"}
              </Button>
              <Button 
                className="flex-1 rounded-2xl h-14 gap-2 text-base font-semibold" 
                onClick={analyseCrop}
                disabled={!image || isAnalysing}
              >
                {isAnalysing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-5 h-5" />
                )}
                {isAnalysing ? t.cropScan.analysing.split(" ")[0] : t.cropScan.analyse}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="overflow-hidden border-border bg-card shadow-lg">
              <div className="h-48 relative">
                <img src={image!} alt="Scanned crop" className="w-full h-full object-cover" />
                <Badge className={`absolute top-4 right-4 text-xs font-bold py-1 px-3 shadow-md ${getSeverityColor(result.severity)}`}>
                  {result.severity.toUpperCase()}
                </Badge>
              </div>
              <CardContent className="p-5 space-y-6">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground block mb-1">
                    {t.cropScan.disease}
                  </label>
                  <h3 className="text-2xl font-bold text-foreground">
                    {result.diseaseName.toLowerCase() === "healthy" ? t.cropScan.healthy : result.diseaseName}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                       <AlertCircle className="w-4 h-4 text-primary" />
                       {t.cropScan.description}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {result.description}
                    </p>
                  </div>

                  {result.treatment.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {t.cropScan.treatment}
                      </h4>
                      <ul className="space-y-1.5">
                        {result.treatment.map((step, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex gap-2">
                            <span className="text-primary font-bold">•</span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.precautions.length > 0 && (
                    <div className="pt-2 border-t border-border">
                      <h4 className="text-sm font-bold text-foreground mb-2">
                        {t.cropScan.precautions}
                      </h4>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {result.precautions.map((pref, i) => (
                          <span key={i} className="px-2 py-1 bg-muted rounded-lg text-muted-foreground italic">
                            # {pref}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Button 
                  onClick={resetScan} 
                  variant="outline" 
                  className="w-full h-12 rounded-xl gap-2 mt-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  {t.cropScan.scanAnother}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default CropScan;
