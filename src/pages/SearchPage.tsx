import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi, workersApi, equipmentApi, applicationsApi, rentalsApi } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";
import { useLocation } from "@/hooks/use-location";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { lat, lon, isLoading: locLoading } = useLocation();

  const role = user?.role;
  const debouncedQuery = useDebounce(query, 400);

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["search-jobs", debouncedQuery, lat, lon],
    queryFn: () => jobsApi.list({ q: debouncedQuery, lat: lat?.toString(), lon: lon?.toString() }),
    enabled: (role === "worker" || !role) && !locLoading,
  });

  const { data: workers = [], isLoading: workersLoading } = useQuery({
    queryKey: ["search-workers", debouncedQuery, lat, lon],
    queryFn: () => workersApi.list({ q: debouncedQuery, lat: lat?.toString(), lon: lon?.toString() }),
    enabled: (role === "farmer" || !role) && !locLoading,
  });

  const { data: equipment = [], isLoading: eqLoading } = useQuery({
    queryKey: ["search-equipment", debouncedQuery, lat, lon],
    queryFn: () => equipmentApi.list({ q: debouncedQuery, lat: lat?.toString(), lon: lon?.toString() }),
    enabled: (role === "farmer" || role === "equipment_owner" || !role) && !locLoading,
  });

  const { mutate: applyToJob } = useMutation({
    mutationFn: (jobId: string) => applicationsApi.apply(jobId),
    onSuccess: () => {
      toast.success(t.worker.applied);
      queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Failed to apply";
      toast.error(msg);
    },
  });

  const { mutate: rentEquipment } = useMutation({
    mutationFn: (equipmentId: string) => rentalsApi.createRequest(equipmentId),
    onSuccess: () => {
      toast.success(t.equipment.rented || "Rental request sent successfully!");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Failed to send request";
      toast.error(msg);
    },
  });

  const isLoading = jobsLoading || workersLoading || eqLoading || locLoading;

  return (
    <MobileLayout title={t.nav.search}>
      <div className="px-4 py-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`${t.nav.search}...`}
            className="h-12 rounded-xl text-base pl-10"
          />
        </div>

        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {(role === "worker" || !role) && !jobsLoading && (
          <div>
            <h3 className="font-semibold text-foreground mb-3">{t.farmer.myJobs} ({jobs.length})</h3>
            <div className="space-y-3">
              {jobs.map((job: any) => (
                <Card key={job.id} className="border border-border">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-foreground">{job.title}</p>
                      {job.distance !== undefined && (
                        <div className="flex items-center text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                          <MapPin className="w-3 h-3 mr-1" />
                          {job.distance.toFixed(1)} km
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {job.location} • ₹{job.wages}{t.worker.perDay} • {job.duration} {t.farmer.duration.split(" ")[0].toLowerCase()}
                    </p>
                    <Button
                      size="sm"
                      className="mt-3 rounded-xl h-9 text-xs w-full"
                      onClick={() => applyToJob(job.id)}
                    >
                      {t.worker.apply}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {(role === "farmer" || !role) && !workersLoading && (
          <>
            <div>
              <h3 className="font-semibold text-foreground mb-3">{t.farmer.workers} ({workers.length})</h3>
              <div className="space-y-3">
                {workers.map((w: any) => (
                  <Card key={w.id} className="border border-border">
                    <CardContent className="p-4 flex items-center gap-3 relative">
                       {w.distance !== undefined && (
                        <div className="absolute top-2 right-2 flex items-center text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-md">
                          <MapPin className="w-2.5 h-2.5 mr-0.5" />
                          {w.distance.toFixed(1)} km
                        </div>
                      )}
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mt-2">
                        {w.avatar}
                      </div>
                      <div className="flex-1 mt-2">
                        <p className="font-semibold text-foreground">{w.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {w.location} • {w.experience}{t.worker.experience.toLowerCase()} • ⭐ {w.rating}
                        </p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {w.skills.slice(0, 3).map((s: string) => (
                            <Badge key={s} variant="secondary" className="text-[10px]">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-primary mt-2">₹{w.dailyRate}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {(role === "farmer" || role === "equipment_owner" || !role) && !eqLoading && (
          <div>
            <h3 className="font-semibold text-foreground mb-3">{t.farmer.equipment} ({equipment.length})</h3>
            <div className="space-y-3">
              {equipment.map((eq: any) => (
                <Card key={eq.id} className="border border-border">
                  <CardContent className="p-4 flex items-center gap-3 relative">
                     {eq.distance !== undefined && (
                        <div className="absolute top-2 right-2 flex items-center text-[10px] text-primary font-medium bg-primary/10 px-1.5 py-0.5 rounded-md">
                          <MapPin className="w-2.5 h-2.5 mr-0.5" />
                          {eq.distance.toFixed(1)} km
                        </div>
                      )}
                    <span className="text-3xl mt-2">{eq.image}</span>
                    <div className="flex-1 mt-2">
                      <p className="font-semibold text-foreground">{eq.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(t as any).equipmentTypes[eq.type.toLowerCase()] || eq.type} • {eq.location}
                      </p>
                    </div>
                    <div className="text-right mt-2 flex flex-col items-end gap-1">
                      <p className="text-sm font-bold text-primary">₹{eq.ratePerDay}{t.worker.perDay}</p>
                      <Badge
                        variant={eq.available ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {eq.available ? t.equipment.available : t.equipment.rented}
                      </Badge>
                    </div>
                  </CardContent>
                  
                  {role === "farmer" && eq.available && (
                    <div className="px-4 pb-4">
                      <Button
                        size="sm"
                        className="w-full h-9 rounded-xl text-xs"
                        onClick={() => rentEquipment(eq.id)}
                      >
                        {t.equipment.requestRental}
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default SearchPage;
