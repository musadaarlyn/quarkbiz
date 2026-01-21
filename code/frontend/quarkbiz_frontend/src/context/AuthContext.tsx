import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { refresh } from "../services/auth/AuthService";

// 1. What auth data exists
// 2. What actions are allowed
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loginContext: (token: string) => void;
  logoutContext: () => void;
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  // User stays logged in after refresh
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const newToken = await refresh();
        setToken(newToken);
        console.log("refreshed");
      } catch {
        setToken(null);
      } finally {
        setLoading(false); // mark auth as initialized
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loginContext: setToken, // set jwt
        logoutContext: () => setToken(null), // destryo jwt
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// give me the authentication state, and crash loudly if 
// auth is not set up correctly (if provider doesn't exist)
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
