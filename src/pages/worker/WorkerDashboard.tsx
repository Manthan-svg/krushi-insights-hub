import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { mockJobs } from "@/data/mockData";
import { Briefcase, IndianRupee, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const WorkerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const handleApply = (jobTitle: string) => {
    toast.success(`${t.worker.applied} - ${jobTitle}`);
  };

  return (
    <MobileLayout title={t.worker.dashboard}>
      <div className="px-4 py-5 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Welcome, {user?.name || "Worker"} 👋</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{t.app.tagline}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Briefcase, label: t.worker.browseJobs, value: mockJobs.filter(j => j.status === "open").length },
            { icon: IndianRupee, label: t.worker.earnings, value: "₹12K" },
            { icon: Star, label: "Rating", value: "4.5" },
          ].map((s) => (
            <Card key={s.label} className="border-0 shadow-none bg-card">
              <CardContent className="p-3 flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-foreground">{s.value}</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{s.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">{t.worker.browseJobs}</h3>
          <div className="space-y-3">
            {mockJobs.filter(j => j.status === "open").map((job) => (
              <Card key={job.id} className="border border-border">
                <CardContent className="p-4">
                  <p className="font-semibold text-foreground">{job.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{job.location}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{job.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-3 text-xs text-muted-foreground">
                      <span className="font-semibold text-primary">₹{job.wages}{t.worker.perDay}</span>
                      <span>{job.duration} days</span>
                    </div>
                    <Button size="sm" className="rounded-xl h-9 text-xs" onClick={() => handleApply(job.title)}>
                      {t.worker.apply}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MobileLayout>
  );
};

export default WorkerDashboard;
