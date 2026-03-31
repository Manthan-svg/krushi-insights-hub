import React, { createContext, useContext, useState } from "react";

export type UserRole = "farmer" | "worker" | "equipment_owner";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  selectedRole: UserRole | null;
  setSelectedRole: (role: UserRole | null) => void;
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, phone: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const login = (email: string, _password: string) => {
    if (!selectedRole) return;
    setUser({ id: "1", name: "Demo User", email, phone: "+91 9876543210", role: selectedRole });
  };

  const signup = (name: string, email: string, phone: string, _password: string) => {
    if (!selectedRole) return;
    setUser({ id: "1", name, email, phone, role: selectedRole });
  };

  const logout = () => {
    setUser(null);
    setSelectedRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, selectedRole, setSelectedRole, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
