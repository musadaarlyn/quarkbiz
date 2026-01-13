import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Navigate to login page and 'replace' the current entry in the history stack 
    // so protected pages are removed from histroy
    return <Navigate to="/login" replace />;
  }

  return children;
}
