import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, LogOut, Settings, User } from "lucide-react";

const ProfilePage = () => {
  const { t, language, setLanguage, languages, languageNames } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cycleLanguage = () => {
    const idx = languages.indexOf(language);
    setLanguage(languages[(idx + 1) % languages.length]);
  };

  return (
    <MobileLayout title={t.nav.profile}>
      <div className="px-4 py-5 space-y-5">
        <Card className="border border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
              {user?.name?.split(" ").map(n => n[0]).join("") || <User className="w-7 h-7" />}
            </div>
            <div>
              <p className="font-bold text-lg text-foreground">{user?.name || "Guest"}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground">{user?.phone}</p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <button onClick={cycleLanguage} className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border active:bg-muted transition-colors min-h-[56px]">
            <Globe className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left font-medium text-foreground">{t.common.language}</span>
            <span className="text-sm text-muted-foreground">{languageNames[language]}</span>
          </button>
          <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border active:bg-muted transition-colors min-h-[56px]">
            <Settings className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left font-medium text-foreground">{t.common.settings}</span>
          </button>
        </div>

        <Button variant="destructive" className="w-full h-12 rounded-xl text-base font-semibold" onClick={handleLogout}>
          <LogOut className="w-5 h-5 mr-2" />
          {t.auth.logout}
        </Button>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
