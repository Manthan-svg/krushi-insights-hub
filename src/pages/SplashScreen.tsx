import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const SplashScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/role-selection"), 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-primary-foreground px-8">
      <div className="animate-pulse mb-6">
        <span className="text-8xl">🌾</span>
      </div>
      <h1 className="text-3xl font-bold mb-2">{t.app.name}</h1>
      <p className="text-primary-foreground/70 text-center text-sm">{t.app.tagline}</p>
    </div>
  );
};

export default SplashScreen;
