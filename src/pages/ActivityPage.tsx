import { useLanguage } from "@/contexts/LanguageContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";

const activities = [
  { id: 1, title: "Applied to Rice Harvesting Help", time: "2 hours ago", icon: CheckCircle, status: "success" },
  { id: 2, title: "Equipment rental request sent", time: "5 hours ago", icon: Clock, status: "pending" },
  { id: 3, title: "New job posted: Sugarcane Cutting", time: "1 day ago", icon: AlertCircle, status: "info" },
  { id: 4, title: "Worker Ganesh Shinde hired", time: "2 days ago", icon: CheckCircle, status: "success" },
  { id: 5, title: "Payment received ₹3,500", time: "3 days ago", icon: CheckCircle, status: "success" },
];

const ActivityPage = () => {
  const { t } = useLanguage();

  return (
    <MobileLayout title={t.nav.activity}>
      <div className="px-4 py-5 space-y-3">
        {activities.map((act) => (
          <Card key={act.id} className="border border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                act.status === "success" ? "bg-primary/10 text-primary" :
                act.status === "pending" ? "bg-secondary/20 text-secondary" :
                "bg-muted text-muted-foreground"
              }`}>
                <act.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{act.title}</p>
                <p className="text-xs text-muted-foreground">{act.time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </MobileLayout>
  );
};

export default ActivityPage;
