import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "@/lib/api";

export type UserRole = "farmer" | "worker" | "equipment_owner";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  selectedRole: UserRole | null;
  loading: boolean;
  setSelectedRole: (role: UserRole | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("krushi_token");
    const cachedUser = localStorage.getItem("krushi_user");

    if (token && cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        localStorage.removeItem("krushi_user");
      }

      // Verify token is still valid against the server
      authApi
        .me()
        .then((serverUser) => {
          setUser(serverUser);
          localStorage.setItem("krushi_user", JSON.stringify(serverUser));
        })
        .catch(() => {
          // Token expired / invalid, clear everything
          localStorage.removeItem("krushi_token");
          localStorage.removeItem("krushi_user");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    localStorage.setItem("krushi_token", data.token);
    localStorage.setItem("krushi_user", JSON.stringify(data.user));
    setUser(data.user);
    setSelectedRole(data.user.role as UserRole);
  }, []);

  const signup = useCallback(
    async (name: string, email: string, phone: string, password: string) => {
      if (!selectedRole) throw new Error("No role selected");
      const data = await authApi.register({ name, email, phone, password, role: selectedRole });
      localStorage.setItem("krushi_token", data.token);
      localStorage.setItem("krushi_user", JSON.stringify(data.user));
      setUser(data.user);
    },
    [selectedRole]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("krushi_token");
    localStorage.removeItem("krushi_user");
    setUser(null);
    setSelectedRole(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        selectedRole,
        loading,
        setSelectedRole,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
