import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Globe } from "lucide-react";

const roles: { key: UserRole; emoji: string; descEn: string }[] = [
  { key: "farmer", emoji: "👨‍🌾", descEn: "Post jobs, rent equipment, hire workers" },
  { key: "worker", emoji: "👷", descEn: "Find farm jobs, earn daily wages" },
  { key: "equipment_owner", emoji: "🚜", descEn: "List & rent out your equipment" },
];

const RoleSelection = () => {
  const navigate = useNavigate();
  const { setSelectedRole } = useAuth();
  const { t, language, setLanguage, languages, languageNames } = useLanguage();

  const cycleLanguage = () => {
    const idx = languages.indexOf(language);
    setLanguage(languages[(idx + 1) % languages.length]);
  };

  const handleSelect = (role: UserRole) => {
    setSelectedRole(role);
    navigate("/login");
  };

  const roleLabels: Record<UserRole, string> = {
    farmer: t.roles.farmer,
    worker: t.roles.worker,
    equipment_owner: t.roles.equipmentOwner,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <div className="flex justify-end mb-8">
        <button onClick={cycleLanguage} className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted active:bg-muted/80 transition-colors min-h-[44px]">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">{languageNames[language]}</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <span className="text-6xl mb-4">🌾</span>
        <h1 className="text-2xl font-bold text-foreground mb-2">{t.app.name}</h1>
        <p className="text-muted-foreground text-sm mb-10">{t.roles.selectRole}</p>

        <div className="w-full space-y-4 max-w-sm">
          {roles.map((role) => (
            <button
              key={role.key}
              onClick={() => handleSelect(role.key)}
              className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card border border-border shadow-sm active:scale-[0.98] transition-transform min-h-[80px]"
            >
              <span className="text-4xl">{role.emoji}</span>
              <div className="text-left">
                <p className="font-semibold text-foreground text-lg">{roleLabels[role.key]}</p>
                <p className="text-muted-foreground text-xs">{role.descEn}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
