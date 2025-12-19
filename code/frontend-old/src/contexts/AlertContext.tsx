import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type AlertIntent = "error" | "warning" | "info";
type AlertPayload = { title: string; message: string; intent?: AlertIntent };

interface AlertContextValue {
  alert: AlertPayload | null;
  showAlert: (payload: AlertPayload) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used inside AlertProvider");
  return ctx;
};

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<AlertPayload | null>(null);

  return (
    <AlertContext.Provider
      value={{
        alert,
        showAlert: setAlert,
        hideAlert: () => setAlert(null),
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};