import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { mockJobs, mockWorkers, mockEquipment } from "@/data/mockData";
import { Briefcase, Users, Wrench, Plus } from "lucide-react";

const FarmerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { icon: Briefcase, label: t.farmer.activeJobs, value: mockJobs.filter(j => j.status === "open").length, color: "bg-primary/10 text-primary" },
    { icon: Users, label: t.farmer.workers, value: mockWorkers.filter(w => w.available).length, color: "bg-secondary/20 text-secondary" },
    { icon: Wrench, label: t.farmer.equipment, value: mockEquipment.filter(e => e.available).length, color: "bg-accent/20 text-accent-foreground" },
  ];

  return (
    <MobileLayout title={t.farmer.dashboard}>
      <div className="px-4 py-5 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Welcome, {user?.name || "Farmer"} 👋</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{t.app.tagline}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <Card key={s.label} className="border-0 shadow-none bg-card">
              <CardContent className="p-3 flex flex-col items-center gap-1.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-foreground">{s.value}</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{s.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate("/post-job")} className="flex items-center gap-3 p-4 rounded-2xl bg-primary text-primary-foreground active:scale-[0.98] transition-transform min-h-[60px]">
            <Plus className="w-5 h-5" />
            <span className="font-semibold text-sm">{t.farmer.postJob}</span>
          </button>
          <button onClick={() => navigate("/search")} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border active:scale-[0.98] transition-transform min-h-[60px]">
            <Wrench className="w-5 h-5 text-primary" />
            <span className="font-semibold text-sm text-foreground">{t.farmer.browseEquipment}</span>
          </button>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">{t.farmer.myJobs}</h3>
          <div className="space-y-3">
            {mockJobs.slice(0, 3).map((job) => (
              <Card key={job.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-foreground">{job.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{job.location}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${job.status === "open" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                    <span>₹{job.wages}/day</span>
                    <span>{job.duration} days</span>
                    <span>{job.applicants} applicants</span>
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

export default FarmerDashboard;
