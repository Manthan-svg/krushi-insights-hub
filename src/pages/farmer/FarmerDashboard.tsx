import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Wrench, Plus, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi, workersApi, equipmentApi } from "@/lib/api";
import { FloatingMicButton } from "@/components/FloatingMicButton";
import { parseJobFromSpeech } from "@/lib/nlp";
import { speakConfirmation } from "@/lib/speech";
import { toast } from "sonner";
import { useLocation } from "@/hooks/use-location";

const FarmerDashboard = () => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { lat, lon } = useLocation();

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["jobs", lat, lon],
    queryFn: () => jobsApi.list({ lat: lat?.toString(), lon: lon?.toString() }),
  });

  const { data: workers = [] } = useQuery({
    queryKey: ["workers", lat, lon],
    queryFn: () => workersApi.list({ lat: lat?.toString(), lon: lon?.toString() }),
  });

  const { data: equipment = [] } = useQuery({
    queryKey: ["equipment", lat, lon],
    queryFn: () => equipmentApi.list({ lat: lat?.toString(), lon: lon?.toString() }),
  });

  const { mutate: quickPostJob } = useMutation({
    mutationFn: (data: ReturnType<typeof parseJobFromSpeech>) => 
      jobsApi.create({ ...data, wages: data.wages.toString(), duration: data.duration.toString(), lat: lat, lon: lon }),
    onSuccess: async () => {
      toast.success(t.common.success);
      await queryClient.invalidateQueries({ queryKey: ["jobs"] });
      let msg = t.common.success;
      if (language === "mr") msg = "काम यशस्वीपणे पोस्ट केले";
      if (language === "hi") msg = "काम सफलतापूर्वक पोस्ट किया गया";
      speakConfirmation(msg, language);
    },
    onError: (err: unknown) => {
      toast.error("Failed to post job via voice");
    }
  });

  const handleVoiceInput = (text: string) => {
    const parsed = parseJobFromSpeech(text);
    quickPostJob(parsed);
  };

  const openJobs = jobs.filter((j: { status: string }) => j.status === "open");
  const availableWorkers = workers.filter((w: { available: boolean }) => w.available);
  const availableEquipment = equipment.filter((e: { available: boolean }) => e.available);

  const myJobs = jobs.filter((j: { postedById: string; applicants?: number }) => j.postedById === user?.id);
  const totalApplicants = myJobs.reduce((acc: number, job: { applicants?: number }) => acc + (job.applicants || 0), 0);

  const stats = [
    { icon: Briefcase, label: t.farmer.activeJobs, value: openJobs.length, color: "bg-primary/10 text-primary" },
    { icon: Users, label: t.farmer.totalApplicants, value: totalApplicants, color: "bg-secondary/20 text-secondary" },
    { icon: Wrench, label: t.farmer.equipment, value: availableEquipment.length, color: "bg-accent/20 text-accent-foreground" },
  ];

  return (
    <MobileLayout title={t.farmer.dashboard}>
      <div className="px-4 py-5 space-y-6 flex flex-col relative">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t.farmer.welcome}, {user?.name || t.roles.farmer} 👋</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{t.app.tagline}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="border-0 shadow-none bg-card">
              <CardContent className="p-3 flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                {jobsLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <span className="text-2xl font-bold text-foreground">{s.value}</span>
                )}
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{s.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/post-job")}
            className="flex items-center gap-3 p-4 rounded-2xl bg-primary text-primary-foreground active:scale-[0.98] transition-transform min-h-[60px]"
          >
            <Plus className="w-5 h-5" />
            <span className="font-semibold text-sm">{t.farmer.postJob}</span>
          </button>
          <button
            onClick={() => navigate("/search")}
            className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border active:scale-[0.98] transition-transform min-h-[60px]"
          >
            <Wrench className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm text-foreground">{t.farmer.browseEquipment}</span>
          </button>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">{t.farmer.myJobs}</h3>
          {jobsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : myJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">{t.farmer.noJobs}</p>
          ) : (
            <div className="space-y-3">
              {myJobs.slice(0, 5).map((job: { id: string; title: string; location: string; status: string; wages: number; duration: number; applicants: number }) => (
                <Card key={job.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground">{job.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{job.location}</p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          job.status === "open"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {t.common.status[job.status as keyof typeof t.common.status] || job.status}
                      </span>
                    </div>
                    <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                      <span>₹{job.wages}{t.worker.perDay}</span>
                      <span>{job.duration} {t.farmer.duration?.split(" ")[0]?.toLowerCase() || "days"}</span>
                      <span>{job.applicants} {t.farmer.applicants}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <FloatingMicButton onResult={handleVoiceInput} />
    </MobileLayout>
  );
};

export default FarmerDashboard;
