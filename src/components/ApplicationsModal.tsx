import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationsApi } from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X, Star } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ApplicationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

const ApplicationsModal = ({ isOpen, onClose, jobId }: ApplicationsModalProps) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();

  const { data: allApplications = [], isLoading } = useQuery({
    queryKey: ["applications", "farmer"],
    queryFn: () => applicationsApi.myApplications(),
    enabled: isOpen,
  });

  const applications = allApplications.filter((a: any) => a.job.id === jobId);

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "accepted" | "rejected" }) =>
      applicationsApi.updateStatus(id, status),
    onSuccess: () => {
      toast.success(t.common.success);
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => {
      toast.error(t.common.error);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t.farmer.applicants} ({applications.length})</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : applications.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t.common.noData}</p>
          ) : (
            applications.map((app: any) => (
              <div key={app.id} className="p-4 rounded-2xl border border-border space-y-3 bg-card shadow-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-foreground text-base">{app.worker.name}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-amber-600 text-xs font-bold flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-current" /> {app.worker.rating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground text-xs">•</span>
                      <span className="text-muted-foreground text-xs">{app.worker.experience}y exp</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary">₹{app.worker.dailyRate}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase">{t.worker.perDay}</p>
                  </div>
                </div>

                {app.status === "pending" ? (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1 rounded-xl h-10 gap-1.5 font-bold"
                      onClick={() => updateStatus({ id: app.id, status: "accepted" })}
                      disabled={isUpdating}
                    >
                      <Check className="w-4 h-4" /> Accept
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 rounded-xl h-10 gap-1.5 font-bold border-destructive/20 text-destructive hover:bg-destructive/10"
                      onClick={() => updateStatus({ id: app.id, status: "rejected" })}
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4" /> Reject
                    </Button>
                  </div>
                ) : (
                  <div className={`text-center py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                    app.status === "accepted" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                  }`}>
                    {app.status}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationsModal;
