import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("jwtToken")
  );

  useEffect(() => {
    if (token) localStorage.setItem("jwtToken", token);
    else localStorage.removeItem("jwtToken");
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login: setToken,
        logout: () => setToken(null),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
