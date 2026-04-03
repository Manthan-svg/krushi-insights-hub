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

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    const token = sessionStorage.getItem("krushi_token");
    const cachedUser = sessionStorage.getItem("krushi_user");
    const cachedRole = sessionStorage.getItem("krushi_role");

    if (cachedRole) {
      setSelectedRole(cachedRole as UserRole);
    }

    if (token && cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        sessionStorage.removeItem("krushi_user");
      }

      // Verify token is still valid against the server
      authApi
        .me()
        .then((serverUser) => {
          setUser(serverUser);
          sessionStorage.setItem("krushi_user", JSON.stringify(serverUser));
          if (!cachedRole) {
            setSelectedRole(serverUser.role as UserRole);
            sessionStorage.setItem("krushi_role", serverUser.role);
          }
        })
        .catch(() => {
          // Token expired / invalid, clear everything
          sessionStorage.removeItem("krushi_token");
          sessionStorage.removeItem("krushi_user");
          sessionStorage.removeItem("krushi_role");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    sessionStorage.setItem("krushi_token", data.token);
    sessionStorage.setItem("krushi_user", JSON.stringify(data.user));
    sessionStorage.setItem("krushi_role", data.user.role);
    setUser(data.user);
    setSelectedRole(data.user.role as UserRole);
  }, []);

  const signup = useCallback(
    async (name: string, email: string, phone: string, password: string) => {
      if (!selectedRole) throw new Error("No role selected");
      const data = await authApi.register({ name, email, phone, password, role: selectedRole });
      sessionStorage.setItem("krushi_token", data.token);
      sessionStorage.setItem("krushi_user", JSON.stringify(data.user));
      sessionStorage.setItem("krushi_role", data.user.role);
      setUser(data.user);
    },
    [selectedRole]
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem("krushi_token");
    sessionStorage.removeItem("krushi_user");
    sessionStorage.removeItem("krushi_role");
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
