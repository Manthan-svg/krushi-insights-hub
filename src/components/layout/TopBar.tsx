import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Globe } from "lucide-react";

interface TopBarProps {
  title?: string;
  showLanguage?: boolean;
}

const TopBar = ({ title, showLanguage = true }: TopBarProps) => {
  const { t, language, setLanguage, languages, languageNames } = useLanguage();
  const { user } = useAuth();

  const cycleLanguage = () => {
    const idx = languages.indexOf(language);
    setLanguage(languages[(idx + 1) % languages.length]);
  };

  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground safe-top">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌾</span>
          <h1 className="text-lg font-bold truncate">{title || t.app.name}</h1>
        </div>
        {showLanguage && (
          <button onClick={cycleLanguage} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary-foreground/10 active:bg-primary-foreground/20 transition-colors min-h-[36px]">
            <Globe className="w-4 h-4" />
            <span className="text-xs font-medium">{languageNames[language]}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;
