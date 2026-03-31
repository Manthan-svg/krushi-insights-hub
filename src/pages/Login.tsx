import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, selectedRole } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const roleEmoji = selectedRole === "farmer" ? "👨‍🌾" : selectedRole === "worker" ? "👷" : "🚜";
  const roleLabel = selectedRole === "farmer" ? t.roles.farmer : selectedRole === "worker" ? t.roles.worker : t.roles.equipmentOwner;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <button onClick={() => navigate("/role-selection")} className="text-muted-foreground text-sm mb-8 self-start min-h-[44px]">← Back</button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-5xl">{roleEmoji}</span>
          <h1 className="text-2xl font-bold mt-3 text-foreground">{t.auth.login}</h1>
          <p className="text-muted-foreground text-sm mt-1">{roleLabel}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.auth.email}</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="h-12 rounded-xl text-base" required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.auth.password}</label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-12 rounded-xl text-base pr-12" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground p-1">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold mt-2">{t.auth.login}</Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t.auth.noAccount}{" "}
          <button onClick={() => navigate("/signup")} className="text-primary font-semibold">{t.auth.signup}</button>
        </p>
      </div>
    </div>
  );
};

export default Login;
