import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { ratingsApi } from "@/lib/api";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  workerId: string;
  onSuccess: () => void;
}

const RatingModal = ({ isOpen, onClose, jobId, workerId, onSuccess }: RatingModalProps) => {
  const { t } = useLanguage();
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (stars === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await ratingsApi.create({
        jobId,
        workerId,
        stars,
        comment,
      });
      toast.success(t.common.success);
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t.common.rating}</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setStars(s)}
                className="transition-transform active:scale-95"
              >
                <Star
                  className={`w-10 h-10 ${
                    s <= stars ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
          
          <Textarea
            placeholder="Share your experience (optional)"
            className="rounded-2xl border-muted-foreground/20 focus:border-primary min-h-[100px]"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <Button 
            className="w-full h-14 rounded-2xl text-lg font-bold" 
            onClick={handleSubmit}
            disabled={isSubmitting || stars === 0}
          >
            {isSubmitting ? t.common.loading : t.common.submit}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
