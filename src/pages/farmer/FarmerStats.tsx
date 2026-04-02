import { useQuery } from "@tanstack/react-query";
import { activityApi } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Users, Wrench, TrendingUp, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const FarmerStats = () => {
  const { t } = useLanguage();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["farmer-stats"],
    queryFn: () => activityApi.getStats(),
  });

  if (isLoading) {
    return (
      <MobileLayout title={t.stats?.title || "Stats"}>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  if (!stats) return null;

  const jobProgress = stats.totalJobs > 0 
    ? (stats.completedJobs / stats.totalJobs) * 100 
    : 0;

  return (
    <MobileLayout title={t.stats.title}>
      <div className="px-4 py-6 space-y-6">
        {/* grid 2x2 */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={<Briefcase className="w-5 h-5 text-blue-500" />}
            label={t.stats.jobsPosted}
            value={stats.totalJobs}
            subValue={t.stats.activeCount.replace("{count}", stats.activeJobs.toString())}
          />
          <StatCard
            icon={<Users className="w-5 h-5 text-green-500" />}
            label={t.stats.workersHired}
            value={stats.workersHired}
          />
          <StatCard
            icon={<Wrench className="w-5 h-5 text-orange-500" />}
            label={t.stats.equipmentRentals}
            value={stats.equipmentRentals}
            subValue={t.stats.rentalSpend.replace("{amount}", stats.rentalSpend.toLocaleString())}
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
            label={t.stats.moneySaved}
            value={`₹${stats.moneySaved.toLocaleString()}`}
            isHighlight
          />
        </div>

        {/* Progress bar */}
        <Card className="border border-border rounded-2xl overflow-hidden shadow-sm">
          <CardContent className="p-5 space-y-4">
            <div className="flex justify-between items-end">
              <h4 className="font-bold text-foreground">{t.stats.progress}</h4>
              <span className="text-[10px] text-muted-foreground font-black uppercase">
                {t.stats.completedOf.replace("{completed}", stats.completedJobs.toString()).replace("{total}", stats.totalJobs.toString())}
              </span>
            </div>
            <Progress value={jobProgress} className="h-3 rounded-full bg-muted" />
          </CardContent>
        </Card>

        {/* Highlight box */}
        <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all" />
          <p className="text-primary font-bold text-lg leading-relaxed relative z-10 text-center">
            {t.stats.savingsHighlight.replace("{amount}", stats.moneySaved.toLocaleString())}
          </p>
        </div>
      </div>
    </MobileLayout>
  );
};

const StatCard = ({ icon, label, value, subValue, isHighlight }: any) => (
  <Card className={`border border-border rounded-2xl overflow-hidden shadow-sm transition-all active:scale-95 ${isHighlight ? 'bg-primary/5 border-primary/20' : ''}`}>
    <CardContent className="p-4 space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">{label}</span>
      </div>
      <div>
        <p className={`text-xl font-black ${isHighlight ? 'text-primary' : 'text-foreground'}`}>{value}</p>
        {subValue && <p className="text-[10px] text-muted-foreground font-bold">{subValue}</p>}
      </div>
    </CardContent>
  </Card>
);

export default FarmerStats;
