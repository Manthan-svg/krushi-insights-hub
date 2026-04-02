import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsApi, workersApi, equipmentApi, applicationsApi } from "@/lib/api";
import { useDebounce } from "@/hooks/use-debounce";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const { t } = useLanguage();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const role = user?.role;
  const debouncedQuery = useDebounce(query, 400);

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ["search-jobs", debouncedQuery],
    queryFn: () => jobsApi.list({ q: debouncedQuery }),
    enabled: role === "worker" || !role,
  });

  const { data: workers = [], isLoading: workersLoading } = useQuery({
    queryKey: ["search-workers", debouncedQuery],
    queryFn: () => workersApi.list({ q: debouncedQuery }),
    enabled: role === "farmer" || !role,
  });

  const { data: equipment = [], isLoading: eqLoading } = useQuery({
    queryKey: ["search-equipment", debouncedQuery],
    queryFn: () => equipmentApi.list({ q: debouncedQuery }),
    enabled: role === "farmer" || role === "equipment_owner" || !role,
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

  const isLoading = jobsLoading || workersLoading || eqLoading;

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
            <h3 className="font-semibold text-foreground mb-3">Jobs ({jobs.length})</h3>
            <div className="space-y-3">
              {jobs.map((job: { id: string; title: string; location: string; wages: number; duration: number }) => (
                <Card key={job.id} className="border border-border">
                  <CardContent className="p-4">
                    <p className="font-semibold text-foreground">{job.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {job.location} • ₹{job.wages}/day • {job.duration} days
                    </p>
                    <Button
                      size="sm"
                      className="mt-2 rounded-xl h-9 text-xs"
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
              <h3 className="font-semibold text-foreground mb-3">Workers ({workers.length})</h3>
              <div className="space-y-3">
                {workers.map((w: { id: string; name: string; location: string; experience: number; rating: number; skills: string[]; dailyRate: number; avatar: string }) => (
                  <Card key={w.id} className="border border-border">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {w.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{w.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {w.location} • {w.experience}yr exp • ⭐ {w.rating}
                        </p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {w.skills.slice(0, 3).map((s) => (
                            <Badge key={s} variant="secondary" className="text-[10px]">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-primary">₹{w.dailyRate}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}

        {(role === "farmer" || role === "equipment_owner" || !role) && !eqLoading && (
          <div>
            <h3 className="font-semibold text-foreground mb-3">Equipment ({equipment.length})</h3>
            <div className="space-y-3">
              {equipment.map((eq: { id: string; name: string; type: string; location: string; ratePerDay: number; available: boolean; image: string }) => (
                <Card key={eq.id} className="border border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <span className="text-3xl">{eq.image}</span>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{eq.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {eq.type} • {eq.location}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary">₹{eq.ratePerDay}/day</p>
                      <Badge
                        variant={eq.available ? "default" : "secondary"}
                        className="text-[10px] mt-1"
                      >
                        {eq.available ? t.equipment.available : t.equipment.rented}
                      </Badge>
                    </div>
                  </CardContent>
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
