import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { jobsApi } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FloatingMicButton } from "@/components/FloatingMicButton";
import { parseJobFromSpeech } from "@/lib/nlp";
import { speakConfirmation } from "@/lib/speech";
import { useLocation } from "@/hooks/use-location";

const PostJob = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wages, setWages] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");

  const { lat, lon } = useLocation();

  const { mutate: postJob, isPending } = useMutation({
    mutationFn: () => jobsApi.create({ title, description, location, wages, duration, lat, lon }),
    onSuccess: async () => {
      toast.success(t.common.success);
      await queryClient.invalidateQueries({ queryKey: ["jobs"] });
      // Speak confirmation
      let msg = t.common.success;
      if (language === "mr") msg = "काम यशस्वीपणे पोस्ट केले";
      if (language === "hi") msg = "काम सफलतापूर्वक पोस्ट किया गया";
      speakConfirmation(msg, language);
      
      navigate("/dashboard");
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Failed to post job";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postJob();
  };

  const handleVoiceInput = (text: string) => {
    const parsed = parseJobFromSpeech(text);
    setTitle(parsed.title);
    setDescription(parsed.description);
    setWages(parsed.wages.toString());
    setDuration(parsed.duration.toString());
    setLocation(parsed.location);
    toast.success(t.common.success);
  };

  return (
    <MobileLayout title={t.farmer.postJob} showNav={false}>
      <div className="px-4 py-5">
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground text-sm mb-4 min-h-[44px]"
        >
          ← {t.common.cancel}
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.farmer.title}</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 rounded-xl text-base"
              placeholder="e.g. Rice Harvesting Help"
              required
              disabled={isPending}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t.farmer.description}
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl text-base min-h-[100px]"
              placeholder="Describe the work required..."
              required
              disabled={isPending}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                {t.farmer.wages} (₹/day)
              </label>
              <Input
                type="number"
                value={wages}
                onChange={(e) => setWages(e.target.value)}
                className="h-12 rounded-xl text-base"
                placeholder="500"
                min="1"
                required
                disabled={isPending}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                {t.farmer.duration} (days)
              </label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="h-12 rounded-xl text-base"
                placeholder="7"
                min="1"
                required
                disabled={isPending}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t.farmer.location}
            </label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="h-12 rounded-xl text-base"
              placeholder="Pune, Maharashtra"
              required
              disabled={isPending}
            />
          </div>
          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-base font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.common.loading}
              </>
            ) : (
              t.farmer.post
            )}
          </Button>
        </form>
      </div>
      <FloatingMicButton onResult={handleVoiceInput} />
    </MobileLayout>
  );
};

export default PostJob;
