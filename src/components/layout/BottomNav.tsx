import { Home, Search, Activity, User, ScanLine, TrendingUp } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const tabs = [
    { path: "/dashboard", icon: Home, label: t.nav.home },
    { path: "/search", icon: Search, label: t.nav.search },
    { path: "/crop-scan", icon: ScanLine, label: t.cropScan.title.split(" ")[0] },
  ];

  if (user?.role === "farmer") {
    tabs.push({ path: "/stats", icon: TrendingUp, label: t.stats.title.split(" ")[1] || t.stats.title });
  }

  tabs.push({ path: "/activity", icon: Activity, label: t.nav.activity });
  tabs.push({ path: "/profile", icon: User, label: t.nav.profile });

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path || (tab.path === "/dashboard" && location.pathname.startsWith("/dashboard"));
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
