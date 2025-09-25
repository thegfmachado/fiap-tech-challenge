import React, { createContext, useContext, useEffect, useState } from "react";
import { dashboardService } from "../services/dasboard-service";
import { useAuth } from "@/contexts/auth-context";
import { IDashboardData } from "@fiap-tech-challenge/models";

interface DashboardContextType {
  dashboard: IDashboardData | null;
  refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<IDashboardData | null>(null);

  const fetchDashboard = async () => {

    if (!user) return;

    try {
      const data = await dashboardService.getMonthlyDashboard(user.id);
      setDashboard(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboard();
    }
  }, [user]);

  return (
    <DashboardContext.Provider value={{ dashboard, refresh: fetchDashboard }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("error");
  }
  return context;
}
