import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, IndianRupee, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi, applicationsApi } from "@/lib/api";
import { useLocation } from "@/hooks/use-location";
import WeatherWidget from "@/components/WeatherWidget";

const WorkerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { lat, lon } = useLocation();

  const { data: openJobs = [], isLoading } = useQuery({
    queryKey: ["jobs", "open", lat, lon],
    queryFn: () => jobsApi.list({ status: "open", lat: lat?.toString(), lon: lon?.toString() }),
  });

  const { data: myApplications = [] } = useQuery({
    queryKey: ["applications", "my"],
    queryFn: () => applicationsApi.myApplications(),
  });

  const { mutate: applyToJob } = useMutation({
    mutationFn: (jobId: string) => applicationsApi.apply(jobId),
    onSuccess: (_data, jobId) => {
      const job = openJobs.find((j: { id: string; title: string }) => j.id === jobId);
      toast.success(`${t.worker.applied} ${job?.title || ""}!`);
      queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Failed to apply";
      toast.error(msg);
    },
  });

  const appliedJobIds = new Set(
    myApplications.map((a: { job: { id: string } }) => a.job.id)
  );

  const stats = [
    { icon: Briefcase, label: t.worker.browseJobs, value: openJobs.length },
    { icon: IndianRupee, label: t.worker.earnings, value: `₹${(myApplications.filter((a: {status:string}) => a.status === "accepted").length * 500) || 0}` },
    { icon: Star, label: t.worker.myApplications, value: myApplications.length },
  ];

  return (
    <MobileLayout title={t.worker.dashboard}>
      <div className="px-4 py-5 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t.farmer.welcome}, {user?.name || t.roles.worker} 👋</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{t.app.tagline}</p>
        </div>

        <WeatherWidget lat={lat || undefined} lon={lon || undefined} />

        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="border-0 shadow-none bg-card">
              <CardContent className="p-3 flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-foreground">{s.value}</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">
                  {s.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">{t.worker.browseJobs}</h3>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : openJobs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">{t.common.noData}</p>
          ) : (
            <div className="space-y-3">
              {openJobs.map((job: any) => {
                const hasApplied = appliedJobIds.has(job.id);
                return (
                  <Card key={job.id} className="border border-border">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-foreground">{job.title}</p>
                        {job.distance !== undefined && (
                          <div className="flex items-center text-[10px] text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-md">
                            {job.distance.toFixed(1)} km
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{job.location}</p>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex gap-3 text-xs text-muted-foreground">
                          <span className="font-semibold text-primary">
                            ₹{job.wages}{t.worker.perDay}
                          </span>
                          <span>{job.duration} {t.common.days}</span>
                        </div>
                        <Button
                          size="sm"
                          className="rounded-xl h-9 text-xs"
                          onClick={() => applyToJob(job.id)}
                          disabled={hasApplied}
                          variant={hasApplied ? "secondary" : "default"}
                        >
                          {hasApplied ? `${t.worker.applied} ✓` : t.worker.apply}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default WorkerDashboard;
