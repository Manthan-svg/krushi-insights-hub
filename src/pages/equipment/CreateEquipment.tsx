import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft } from "lucide-react";
import { equipmentApi } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import MobileLayout from "@/components/layout/MobileLayout";

const CreateEquipment = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [ratePerDay, setRatePerDay] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState("🚜");

  const { mutate: createEquipment, isPending } = useMutation({
    mutationFn: equipmentApi.create,
    onSuccess: () => {
      toast.success("Equipment listed successfully");
      queryClient.invalidateQueries({ queryKey: ["equipment", "mine"] });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || "Failed to list equipment");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type || !description || !ratePerDay || !location) {
      toast.error("Please fill all required fields");
      return;
    }

    createEquipment({
      name,
      type,
      description,
      ratePerDay: parseFloat(ratePerDay),
      location,
      image,
    });
  };

  const equipmentTypes = [
    { value: "tractor", label: t.equipment.tractor, emoji: "🚜" },
    { value: "harvester", label: t.equipment.harvester, emoji: "🌾" },
    { value: "plough", label: t.equipment.plough, emoji: "🚜" },
    { value: "sprayer", label: t.equipment.sprayer, emoji: "💨" },
    { value: "seeder", label: t.equipment.seeder, emoji: "🌱" },
  ];

  return (
    <MobileLayout title={t.equipment.listEquipment}>
      <div className="px-4 py-6 space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground text-sm mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.auth.back}
        </button>

        <form onSubmit={handleSubmit} className="space-y-4 pb-10">
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.equipment.name}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mahindra Arjun 605"
              className="h-12 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.equipment.type}</label>
            <Select onValueChange={(val) => {
              setType(val);
              const emoji = equipmentTypes.find(t => t.value === val)?.emoji || "⚙️";
              setImage(emoji);
            }}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {equipmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <span>{type.emoji}</span>
                      <span>{type.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.farmer.description}</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your equipment details, condition, etc."
              className="rounded-xl min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.equipment.rate}</label>
            <Input
              type="number"
              value={ratePerDay}
              onChange={(e) => setRatePerDay(e.target.value)}
              placeholder="e.g. 1500"
              className="h-12 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">{t.farmer.location}</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Satara, Maharashtra"
              className="h-12 rounded-xl"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-base font-semibold mt-6"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t.common.loading}
              </>
            ) : (
              t.equipment.listEquipment
            )}
          </Button>
        </form>
      </div>
    </MobileLayout>
  );
};

export default CreateEquipment;
