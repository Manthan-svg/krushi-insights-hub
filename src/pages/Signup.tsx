import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    signup(name, email, phone, password);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      <button onClick={() => navigate("/login")} className="text-muted-foreground text-sm mb-8 self-start min-h-[44px]">← Back</button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <span className="text-5xl">🌾</span>
          <h1 className="text-2xl font-bold mt-3 text-foreground">{t.auth.signup}</h1>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.auth.name}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rajesh Patil" className="h-12 rounded-xl text-base" required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.auth.email}</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="h-12 rounded-xl text-base" required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.auth.phone}</label>
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="h-12 rounded-xl text-base" required />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">{t.auth.password}</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="h-12 rounded-xl text-base" required />
          </div>
          <Button type="submit" className="w-full h-12 rounded-xl text-base font-semibold mt-2">{t.auth.signup}</Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {t.auth.hasAccount}{" "}
          <button onClick={() => navigate("/login")} className="text-primary font-semibold">{t.auth.login}</button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
