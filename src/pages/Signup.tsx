import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      await signup(name, email, phone, password);
      navigate("/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <button
        onClick={() => navigate("/login")}
        className="text-muted-foreground text-sm mb-8 self-start min-h-[44px]"
      >
        ← Back
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-5xl">🌾</span>
          <h1 className="text-2xl font-bold mt-3 text-foreground">{t.auth.signup}</h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.auth.name}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Rajesh Patil"
              className="h-12 rounded-xl text-base"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.auth.email}</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="h-12 rounded-xl text-base"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.auth.phone}</label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 9876543210"
              className="h-12 rounded-xl text-base"
              required
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">
              {t.auth.password}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 rounded-xl text-base pr-12"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
          </div>
          <Button
            type="submit"
            className="w-full h-12 rounded-xl text-base font-semibold mt-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating account...
              </>
            ) : (
              t.auth.signup
            )}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t.auth.hasAccount}{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-primary font-semibold"
            disabled={isLoading}
          >
            {t.auth.login}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
