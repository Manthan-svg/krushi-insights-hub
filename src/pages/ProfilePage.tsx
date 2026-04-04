import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, LogOut, Settings, User, Loader2, Star, Briefcase, MapPin, Award, CheckCircle2, ChevronRight, TrendingUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/lib/api";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const ProfilePage = () => {
  const { t, language, setLanguage, languages, languageNames } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileApi.get(),
  });

  const { mutate: updateAvailability } = useMutation({
    mutationFn: (available: boolean) => profileApi.update({ available }),
    onSuccess: () => {
      toast.success(t.common.success);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cycleLanguage = () => {
    const idx = languages.indexOf(language);
    setLanguage(languages[(idx + 1) % languages.length]);
  };

  // Helper for role-based display names
  const getRoleLabel = () => {
    if (!user?.role) return "";
    return user.role === "farmer" ? t.roles.farmer :
      user.role === "worker" ? t.roles.worker :
        t.roles.equipmentOwner;
  };

  return (
    <MobileLayout title={t.nav.profile}>
      <div className="flex flex-col min-h-screen bg-background relative overflow-hidden">
        {/* Profile Hero Header */}
        <div className="relative h-64 bg-gradient-to-br from-primary via-primary/90 to-primary/80 flex flex-col items-center justify-end pb-8">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white blur-3xl"></div>
            <div className="absolute top-20 -right-10 w-60 h-60 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-xl border-4 border-white/30 flex items-center justify-center text-3xl font-black text-white shadow-2xl mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              {user?.name?.split(" ").map((n) => n[0]).join("") || <User className="w-10 h-10" />}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">
              {profile?.name || user?.name || "Guest"}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-md px-3 font-bold uppercase tracking-wider text-[10px]">
                {getRoleLabel()}
              </Badge>
              {profile?.workerProfile?.rating >= 4.0 && (
                <Badge className="bg-amber-400 text-amber-900 border-none font-black px-2 py-0 h-5 flex items-center gap-0.5 text-[9px]">
                  <Star className="w-2.5 h-2.5 fill-current" /> {t.common.rating}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-4 -mt-6 transform translate-y-0 space-y-6 pb-12">
          {/* Main Info Card */}
          <Card className="border-none shadow-xl bg-card/80 backdrop-blur-md rounded-[32px] overflow-hidden">
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t.auth.email}</p>
                  <p className="text-sm font-bold text-foreground truncate">{profile?.email || user?.email || "—"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t.auth.phone}</p>
                  <p className="text-sm font-bold text-foreground">{profile?.phone || user?.phone || "—"}</p>
                </div>
              </div>

              {user?.role === "worker" && profile?.workerProfile && (
                <div className="pt-4 border-t border-border grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-1">
                      <Star className="w-5 h-5 text-amber-500" />
                    </div>
                    <span className="text-sm font-black text-foreground">{profile.workerProfile.rating || "4.8"}</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">{t.common.rating}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center mb-1">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-black text-foreground">₹{profile.workerProfile.dailyRate}</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">{t.worker.perDay}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-1">
                      <Award className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-sm font-black text-foreground">{profile.workerProfile.experience}</span>
                    <span className="text-[8px] font-bold text-muted-foreground uppercase">{t.common.days}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Activity Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-black text-foreground text-sm uppercase tracking-widest flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                {user?.role === "farmer" ? t.farmer.myJobs : t.worker.myApplications}
              </h3>
            </div>

            <div className="space-y-3">
              {(user?.role === "farmer" ? profile?.recentJobs || [] : profile?.recentApplications || []).length > 0 ? (
                (user?.role === "farmer" ? profile.recentJobs : profile.recentApplications).map((item: any, idx: number) => (
                  <div
                    key={item.id}
                    className="group bg-card border border-border/50 p-4 rounded-3xl flex items-center gap-4 active:scale-[0.98] transition-all"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center shrink-0">
                      <Briefcase className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">{user?.role === "farmer" ? item.title : item.job.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">{user?.role === "farmer" ? item.location : item.job.location}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={`text-[8px] h-4 font-black uppercase tracking-tighter ${(item.status === "completed" || item.status === "accepted") ? "bg-green-500/10 text-green-600" :
                        (item.status === "open" || item.status === "pending") ? "bg-primary/10 text-primary" :
                          "bg-muted text-muted-foreground"
                        }`}>
                        {t.common.status[item.status as keyof typeof t.common.status] || item.status}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/30" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-muted/20 rounded-3xl border border-dashed border-border">
                  <p className="text-xs text-muted-foreground font-bold italic">{t.common.noData}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Menu */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={cycleLanguage}
              className="p-5 rounded-[28px] bg-sky-500/10 border border-sky-500/20 flex flex-col items-start gap-4 active:scale-95 transition-all group"
            >
              <div className="w-10 h-10 rounded-2xl bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/30 group-hover:rotate-12 transition-transform">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-sky-700/60 uppercase tracking-widest">{t.common.language}</p>
                <p className="text-base font-black text-sky-900">{languageNames[language]}</p>
              </div>
            </button>
            <button 
              onClick={() => navigate("/settings")}
              className="p-5 rounded-[28px] bg-indigo-500/10 border border-indigo-500/20 flex flex-col items-start gap-4 active:scale-95 transition-all group text-left w-full"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:rotate-12 transition-transform">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div className="space-y-0.5 text-left items-start">
                <p className="text-[10px] font-black text-indigo-700/60 uppercase tracking-widest">{t.common.settings}</p>
                <p className="text-base font-black text-indigo-900">Account</p>
              </div>
            </button>
          </div>

          {/* Logout Button */}
          <Button
            variant="destructive"
            className="w-full h-16 rounded-[28px] text-lg font-black bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-xl shadow-red-200 border-none transition-all active:scale-[0.98] mt-4"
            onClick={handleLogout}
          >
            <LogOut className="w-6 h-6 mr-3 stroke-[3]" />
            {t.auth.logout.toUpperCase()}
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
