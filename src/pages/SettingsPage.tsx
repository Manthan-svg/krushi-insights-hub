import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Save, User, Bell, Globe, Shield, MapPin, Briefcase, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "@/lib/api";
import { toast } from "sonner";

const SettingsPage = () => {
  const { t, language, setLanguage, languages, languageNames } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileApi.get(),
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    notifications: true,
    autoHire: false,
    radius: 15,
    experience: 0,
    dailyRate: 0,
    location: "",
    skills: [] as string[],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        notifications: true,
        autoHire: false,
        radius: 15,
        experience: profile.workerProfile?.experience || 0,
        dailyRate: profile.workerProfile?.dailyRate || 0,
        location: profile.workerProfile?.location || profile.location || "",
        skills: profile.workerProfile?.skills || [],
      });
    }
  }, [profile]);

  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: (data: any) => profileApi.update(data),
    onSuccess: () => {
      toast.success(t.common.success);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["workers"] });
    },
    onError: () => {
      toast.error(t.common.error);
    },
  });

  const handleSave = () => {
    updateProfile(formData);
  };

  return (
    <MobileLayout title={t.common.settings}>
      <div className="px-4 py-6 space-y-8 pb-20">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-muted/50"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h2 className="text-xl font-black text-foreground">{t.common.settings}</h2>
        </div>

        {/* Account Section */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-2">
            <User className="w-3 h-3 text-primary" />
            Account Details
          </h3>
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-md rounded-3xl">
            <CardContent className="p-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold">{t.auth.name}</Label>
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl border-border bg-background/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-xs font-bold">{t.auth.phone}</Label>
                <Input 
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="rounded-xl border-border bg-background/50 h-12"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs font-bold">Home Base / Village</Label>
                <div className="relative">
                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                   <Input 
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="rounded-xl border-border bg-background/50 h-12 pl-10"
                    placeholder="Enter your village or area"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role-Specific Settings */}
        {user?.role === "farmer" && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-2">
              <Star className="w-3 h-3 text-orange-500" />
              Farmer Preferences
            </h3>
            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-md rounded-3xl">
              <CardContent className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Search Radius</p>
                    <p className="text-[10px] text-muted-foreground">Nearby matching distance</p>
                  </div>
                  <div className="flex items-center gap-2 bg-orange-500/10 text-orange-600 px-3 py-1 rounded-full text-xs font-black">
                    {formData.radius} KM
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">Auto-Hire Trusted</p>
                    <p className="text-[10px] text-muted-foreground">Instantly accept top workers</p>
                  </div>
                  <Switch 
                    checked={formData.autoHire}
                    onCheckedChange={(checked) => setFormData({ ...formData, autoHire: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {user?.role === "worker" && (
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-2">
              <Briefcase className="w-3 h-3 text-primary" />
              Professional Profile
            </h3>
            <Card className="border-none shadow-xl bg-card/50 backdrop-blur-md rounded-3xl">
              <CardContent className="p-5 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Experience (Years)</Label>
                    <Input 
                      type="number"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) })}
                      className="rounded-xl bg-background/50 h-10 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold">Daily Wage (₹)</Label>
                    <Input 
                      type="number"
                      value={formData.dailyRate}
                      onChange={(e) => setFormData({ ...formData, dailyRate: parseFloat(e.target.value) })}
                      className="rounded-xl bg-background/50 h-10 font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                   <Label className="text-xs font-bold">Skills (Comma separated)</Label>
                   <Input 
                    value={formData.skills.join(", ")}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value.split(",").map(s => s.trim()).filter(s => s !== "") })}
                    className="rounded-xl bg-background/50 h-10 font-medium text-sm"
                    placeholder="e.g. Harvesting, Plowing"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Global Settings */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2 px-2">
            <Bell className="w-3 h-3 text-blue-500" />
            System & Privacy
          </h3>
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur-md rounded-3xl">
            <CardContent className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-sm font-bold">Push Notifications</p>
                </div>
                <Switch 
                  checked={formData.notifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, notifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-4 cursor-pointer" onClick={() => navigate("/profile")}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm font-bold">{t.common.language}</p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase">
                   {languageNames[language]}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-4 cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-sm font-bold">Privacy Policy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full h-14 rounded-2xl text-base font-black shadow-lg shadow-primary/20 gap-2 active:scale-95 transition-all"
          onClick={handleSave}
          disabled={isPending}
        >
          {isPending ? <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full" /> : <Save className="w-5 h-5" />}
          SAVE CHANGES
        </Button>
      </div>
    </MobileLayout>
  );
};

export default SettingsPage;
