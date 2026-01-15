import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// 1. What auth data exists
// 2. What actions are allowed
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loginContext: (token: string) => void;
  logoutContext: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  // User stays logged in after refresh
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("jwtToken")
  );

  // Whenever auth state changes, persist it
  useEffect(() => {
    if (token) localStorage.setItem("jwtToken", token); // if token is set, save to local storage
    else localStorage.removeItem("jwtToken"); // if token is destroyed, remove from local storage
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        loginContext: setToken, // set jwt
        logoutContext: () => setToken(null), // destryo jwt
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
