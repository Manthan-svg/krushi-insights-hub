import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, LogOut, Settings, User, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/lib/api";
import { toast } from "sonner";

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
      toast.success("Availability updated!");
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

  return (
    <MobileLayout title={t.nav.profile}>
      <div className="px-4 py-5 space-y-5">
        <Card className="border border-border">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
              {user?.name?.split(" ").map((n) => n[0]).join("") || <User className="w-7 h-7" />}
            </div>
            <div className="flex-1">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <p className="font-bold text-lg text-foreground">{profile?.name || user?.name || "Guest"}</p>
                  <p className="text-sm text-muted-foreground">{profile?.email || user?.email}</p>
                  <p className="text-xs text-muted-foreground">{profile?.phone || user?.phone}</p>
                  <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium capitalize">
                    {user?.role?.replace("_", " ")}
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Worker-specific profile data */}
        {user?.role === "worker" && profile?.workerProfile && (
          <Card className="border border-border">
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-foreground">Worker Profile</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Daily Rate</p>
                  <p className="font-medium">₹{profile.workerProfile.dailyRate}/day</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Experience</p>
                  <p className="font-medium">{profile.workerProfile.experience} years</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Rating</p>
                  <p className="font-medium">⭐ {profile.workerProfile.rating || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Location</p>
                  <p className="font-medium">{profile.workerProfile.location || "—"}</p>
                </div>
              </div>
              {profile.workerProfile.skills?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {profile.workerProfile.skills.map((s: string) => (
                    <span key={s} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              )}
              <Button
                variant={profile.workerProfile.available ? "outline" : "default"}
                size="sm"
                className="w-full rounded-xl"
                onClick={() => updateAvailability(!profile.workerProfile.available)}
              >
                {profile.workerProfile.available ? "Mark as Unavailable" : "Mark as Available"}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Farmer recent jobs */}
        {user?.role === "farmer" && profile?.recentJobs?.length > 0 && (
          <Card className="border border-border">
            <CardContent className="p-4">
              <h3 className="font-semibold text-foreground mb-2">Recent Jobs</h3>
              <div className="space-y-1.5">
                {profile.recentJobs.map((j: { id: string; title: string; status: string }) => (
                  <div key={j.id} className="flex justify-between text-sm">
                    <span className="text-foreground">{j.title}</span>
                    <span className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground capitalize">
                      {j.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-2">
          <button
            onClick={cycleLanguage}
            className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border active:bg-muted transition-colors min-h-[56px]"
          >
            <Globe className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left font-medium text-foreground">{t.common.language}</span>
            <span className="text-sm text-muted-foreground">{languageNames[language]}</span>
          </button>
          <button className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border active:bg-muted transition-colors min-h-[56px]">
            <Settings className="w-5 h-5 text-primary" />
            <span className="flex-1 text-left font-medium text-foreground">{t.common.settings}</span>
          </button>
        </div>

        <Button
          variant="destructive"
          className="w-full h-12 rounded-xl text-base font-semibold"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          {t.auth.logout}
        </Button>
      </div>
    </MobileLayout>
  );
};

export default ProfilePage;
