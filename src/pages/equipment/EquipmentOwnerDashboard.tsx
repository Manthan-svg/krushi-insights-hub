import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, CheckCircle, Clock, Loader2, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { equipmentApi, rentalsApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const EquipmentOwnerDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: allEquipment = [], isLoading } = useQuery({
    queryKey: ["equipment", "mine"],
    queryFn: () => equipmentApi.list({ ownerId: user?.id }),
  });

  const { data: rentalRequests = [], isLoading: isLoadingRentals } = useQuery({
    queryKey: ["rentals", "mine"],
    queryFn: () => rentalsApi.list(),
  });

  const { mutate: updateRental } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => rentalsApi.updateStatus(id, status),
    onSuccess: (_, variables) => {
      toast.success(variables.status === "APPROVED" ? "Rental approved" : "Rental rejected");
      queryClient.invalidateQueries({ queryKey: ["rentals", "mine"] });
      queryClient.invalidateQueries({ queryKey: ["equipment", "mine"] });
    },
    onError: () => toast.error("Failed to update status"),
  });

  const available = allEquipment.filter((e: { available: boolean }) => e.available);
  const rented = allEquipment.filter((e: { available: boolean }) => !e.available);

  return (
    <MobileLayout title={t.equipment.dashboard}>
      <div className="px-4 py-5 space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t.farmer.welcome}, {user?.name || t.roles.equipmentOwner} 👋</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{t.app.tagline}</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Wrench, label: t.equipment.myEquipment, value: allEquipment.length },
            { icon: CheckCircle, label: t.equipment.available, value: available.length },
            { icon: Clock, label: t.equipment.rented, value: rented.length },
          ].map((s) => (
            <Card key={s.label} className="border-0 shadow-none bg-card">
              <CardContent className="p-3 flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10 text-primary">
                  <s.icon className="w-5 h-5" />
                </div>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                ) : (
                  <span className="text-2xl font-bold text-foreground">{s.value}</span>
                )}
                <span className="text-[10px] text-muted-foreground text-center leading-tight">
                  {s.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        <button
          onClick={() => navigate("/search")}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-primary text-primary-foreground active:scale-[0.98] transition-transform min-h-[60px]"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold text-sm">{t.equipment.listEquipment}</span>
        </button>

        {rentalRequests.length > 0 && (
          <div>
            <h3 className="font-semibold text-foreground mb-3">{t.equipment.rentals}</h3>
            <div className="space-y-3">
              {rentalRequests.map((req: any) => (
                <Card key={req.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground">{req.equipment.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Requested by: <span className="font-medium text-foreground">{req.farmer.name}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Phone: {req.farmer.phone}
                        </p>
                      </div>
                      <Badge variant={req.status === "PENDING" ? "secondary" : req.status === "APPROVED" ? "default" : "destructive"}>
                        {req.status}
                      </Badge>
                    </div>
                    {req.status === "PENDING" && (
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1 rounded-xl h-9 text-xs"
                          onClick={() => updateRental({ id: req.id, status: "APPROVED" })}
                        >
                          {t.common.save}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-xl h-9 text-xs"
                          onClick={() => updateRental({ id: req.id, status: "REJECTED" })}
                        >
                          {t.common.cancel}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-foreground mb-3">{t.equipment.myEquipment}</h3>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : allEquipment.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              {t.common.noData}
            </p>
          ) : (
            <div className="space-y-3">
              {allEquipment.map((eq: { id: string; name: string; type: string; location: string; ratePerDay: number; available: boolean; image: string }) => (
                <Card key={eq.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{eq.image}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold text-foreground">{eq.name}</p>
                          <Badge
                            variant={eq.available ? "default" : "secondary"}
                            className="text-[10px]"
                          >
                            {eq.available ? t.equipment.available : t.equipment.rented}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {eq.type} • {eq.location}
                        </p>
                        <p className="text-sm font-semibold text-primary mt-1">
                          ₹{eq.ratePerDay}{t.worker.perDay}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default EquipmentOwnerDashboard;
