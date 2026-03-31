import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { mockEquipment } from "@/data/mockData";
import { Wrench, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const EquipmentOwnerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  return (
    <MobileLayout title={t.equipment.dashboard}>
      <div className="px-4 py-5 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Welcome, {user?.name || "Owner"} 👋</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{t.app.tagline}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Wrench, label: t.equipment.myEquipment, value: mockEquipment.length },
            { icon: CheckCircle, label: t.equipment.available, value: mockEquipment.filter(e => e.available).length },
            { icon: Clock, label: t.equipment.rented, value: mockEquipment.filter(e => !e.available).length },
          ].map((s) => (
            <Card key={s.label} className="border-0 shadow-none bg-card">
              <CardContent className="p-3 flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                  <s.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-foreground">{s.value}</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight">{s.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">{t.equipment.myEquipment}</h3>
          <div className="space-y-3">
            {mockEquipment.map((eq) => (
              <Card key={eq.id} className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{eq.image}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{eq.name}</p>
                        <Badge variant={eq.available ? "default" : "secondary"} className="text-[10px]">
                          {eq.available ? t.equipment.available : t.equipment.rented}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{eq.type} • {eq.location}</p>
                      <p className="text-sm font-semibold text-primary mt-1">₹{eq.ratePerDay}/day</p>
                    </div>
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

export default EquipmentOwnerDashboard;
