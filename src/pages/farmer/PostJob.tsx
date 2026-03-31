import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import MobileLayout from "@/components/layout/MobileLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const PostJob = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [wages, setWages] = useState("");
  const [location, setLocation] = useState("");
  const [duration, setDuration] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t.common.success);
    navigate("/dashboard");
  };

  return (
    <MobileLayout title={t.farmer.postJob} showNav={false}>
      <div className="px-4 py-5">
        <button onClick={() => navigate(-1)} className="text-muted-foreground text-sm mb-4 min-h-[44px]">← Back</button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.farmer.title}</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 rounded-xl text-base" required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.farmer.description}</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} className="rounded-xl text-base min-h-[100px]" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t.farmer.wages}</label>
              <Input type="number" value={wages} onChange={(e) => setWages(e.target.value)} className="h-12 rounded-xl text-base" required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">{t.farmer.duration}</label>
              <Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} className="h-12 rounded-xl text-base" required />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.farmer.location}</label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="h-12 rounded-xl text-base" required />
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold">{t.farmer.post}</Button>
        </form>
      </div>
    </MobileLayout>
  );
};

export default PostJob;
