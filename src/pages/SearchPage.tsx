import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { mockJobs, mockWorkers, mockEquipment } from "@/data/mockData";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const { t } = useLanguage();
  const { user } = useAuth();

  const role = user?.role;

  const filteredJobs = mockJobs.filter(j => j.title.toLowerCase().includes(query.toLowerCase()) || j.location.toLowerCase().includes(query.toLowerCase()));
  const filteredEquipment = mockEquipment.filter(e => e.name.toLowerCase().includes(query.toLowerCase()) || e.type.toLowerCase().includes(query.toLowerCase()));
  const filteredWorkers = mockWorkers.filter(w => w.name.toLowerCase().includes(query.toLowerCase()) || w.skills.some(s => s.toLowerCase().includes(query.toLowerCase())));

  return (
    <MobileLayout title={t.nav.search}>
      <div className="px-4 py-5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`${t.nav.search}...`} className="h-12 rounded-xl text-base pl-10" />
        </div>

        {(role === "worker" || !role) && (
          <div>
            <h3 className="font-semibold text-foreground mb-3">Jobs ({filteredJobs.length})</h3>
            <div className="space-y-3">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="border border-border">
                  <CardContent className="p-4">
                    <p className="font-semibold text-foreground">{job.title}</p>
                    <p className="text-xs text-muted-foreground">{job.location} • ₹{job.wages}/day • {job.duration} days</p>
                    <Button size="sm" className="mt-2 rounded-xl h-9 text-xs" onClick={() => toast.success(t.worker.applied)}>
                      {t.worker.apply}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {(role === "farmer" || !role) && (
          <>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Workers ({filteredWorkers.length})</h3>
              <div className="space-y-3">
                {filteredWorkers.map((w) => (
                  <Card key={w.id} className="border border-border">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">{w.avatar}</div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{w.name}</p>
                        <p className="text-xs text-muted-foreground">{w.location} • {w.experience}yr exp • ⭐ {w.rating}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {w.skills.slice(0, 3).map(s => <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>)}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-primary">₹{w.dailyRate}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-3">Equipment ({filteredEquipment.length})</h3>
              <div className="space-y-3">
                {filteredEquipment.map((eq) => (
                  <Card key={eq.id} className="border border-border">
                    <CardContent className="p-4 flex items-center gap-3">
                      <span className="text-3xl">{eq.image}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{eq.name}</p>
                        <p className="text-xs text-muted-foreground">{eq.type} • {eq.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-primary">₹{eq.ratePerDay}/day</p>
                        <Badge variant={eq.available ? "default" : "secondary"} className="text-[10px] mt-1">{eq.available ? t.equipment.available : t.equipment.rented}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </MobileLayout>
  );
};

export default SearchPage;
