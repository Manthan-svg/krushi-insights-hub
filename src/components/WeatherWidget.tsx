import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "./ui/card";
import { Cloud, CloudRain, Sun, CloudLightning, AlertTriangle, ArrowRight, CloudDrizzle, Wind, Snowflake } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const WeatherWidget = ({ lat, lon }: { lat?: number; lon?: number }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const { data: weatherData } = useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: async () => {
      const res = await axios.get(`/api/weather?lat=${lat}&lon=${lon}`);
      return res.data;
    },
    enabled: true,
  });

  if (!weatherData) return null;

  const hasRainSoon = weatherData.forecast.slice(0, 2).some(
    (f: any) => f.main === "Rain" || f.main === "Thunderstorm" || f.main === "Drizzle"
  );

  const getWeatherIcon = (main: string) => {
    switch (main) {
      case "Clear": return <Sun className="w-6 h-6 text-yellow-500" />;
      case "Rain": return <CloudRain className="w-6 h-6 text-blue-500" />;
      case "Clouds": return <Cloud className="w-6 h-6 text-slate-400" />;
      case "Thunderstorm": return <CloudLightning className="w-6 h-6 text-purple-500" />;
      case "Drizzle": return <CloudDrizzle className="w-6 h-6 text-blue-300" />;
      case "Snow": return <Snowflake className="w-6 h-6 text-sky-200" />;
      case "Mist":
      case "Smoke":
      case "Haze":
      case "Fog": return <Wind className="w-6 h-6 text-slate-300" />;
      default: return <Cloud className="w-6 h-6 text-slate-400" />;
    }
  };

  const getConditionLabel = (main: string) => {
    switch (main) {
      case "Clear": return t.weather.clear;
      case "Rain": return t.weather.rain;
      case "Clouds": return t.weather.clouds;
      case "Thunderstorm": return t.weather.thunderstorm;
      case "Drizzle": return t.weather.drizzle;
      case "Mist": return t.weather.mist;
      case "Snow": return t.weather.snow;
      default: return main;
    }
  };

  return (
    <div className="space-y-4">
      {hasRainSoon && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-4 flex gap-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 border border-amber-200/50">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm font-bold text-amber-900 leading-snug">
              {t.weather.rainWarning}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="h-8 rounded-full text-[10px] font-bold bg-white/50 border-amber-200 text-amber-700 gap-1 px-3 hover:bg-amber-100/50"
              onClick={() => navigate("/post-job")}
            >
              {t.weather.postNow} <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hidden -mx-4 px-4">
        {weatherData.forecast.map((f: any, i: number) => (
          <Card key={i} className="min-w-[110px] border-border shadow-none bg-card/50 shrink-0 rounded-2xl">
            <CardContent className="p-3 flex flex-col items-center gap-2">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                {f.date === "Today" ? t.weather.today : f.date === "Tomorrow" ? t.weather.tomorrow : f.date}
              </span>
              <div className="p-2 bg-background rounded-xl">
                {getWeatherIcon(f.main)}
              </div>
              <span className="text-lg font-black text-foreground tabular-nums">{f.temp}°C</span>
              <span className="text-[10px] text-muted-foreground font-bold text-center">
                {getConditionLabel(f.main)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeatherWidget;
