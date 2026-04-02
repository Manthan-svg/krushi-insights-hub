import { useLanguage } from "@/contexts/LanguageContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, Loader2, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { activityApi } from "@/lib/api";

type ActivityType = {
  id: string;
  type: string;
  message: string;
  timeAgo: string;
  createdAt: string;
};

const getActivityIcon = (type: string) => {
  switch (type) {
    case "job_applied":
    case "job_posted":
    case "equipment_listed":
    case "application_accepted":
    case "account_created":
      return CheckCircle;
    case "new_applicant":
      return Bell;
    case "application_rejected":
      return AlertCircle;
    default:
      return Clock;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case "application_accepted":
    case "job_applied":
    case "job_posted":
    case "equipment_listed":
    case "account_created":
      return "bg-primary/10 text-primary";
    case "new_applicant":
      return "bg-secondary/20 text-secondary";
    case "application_rejected":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const formatTimeAgo = (dateStr: string, lang: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (lang === "mr") {
    if (diffMins < 1) return "आत्ताच";
    if (diffHours < 1) return `${diffMins} मिनिटांपूर्वी`;
    if (diffHours < 24) return `${diffHours} तासांपूर्वी`;
    return `${Math.floor(diffHours / 24)} दिवसांपूर्वी`;
  }
  if (lang === "hi") {
    if (diffMins < 1) return "अभी";
    if (diffHours < 1) return `${diffMins} मिनट पहले`;
    if (diffHours < 24) return `${diffHours} घंटे पहले`;
    return `${Math.floor(diffHours / 24)} दिन पहले`;
  }
  if (diffMins < 1) return "just now";
  if (diffHours < 1) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
};

const ActivityPage = () => {
  const { t, language } = useLanguage();

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activity"],
    queryFn: () => activityApi.list(),
  });

  return (
    <MobileLayout title={t.nav.activity}>
      <div className="px-4 py-5 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-sm text-muted-foreground">{t.common.noData}</p>
          </div>
        ) : (
          activities.map((act: ActivityType) => {
            const Icon = getActivityIcon(act.type);
            const colorClass = getActivityColor(act.type);
            return (
              <Card key={act.id} className="border border-border">
                <CardContent className="p-4 flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{act.message}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeAgo(act.createdAt, language)}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </MobileLayout>
  );
};

export default ActivityPage;
