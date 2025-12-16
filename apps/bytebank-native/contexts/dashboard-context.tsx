import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dashboardService } from "../services/dashboard-service";
import { useAuth } from "@/contexts/auth-context";
import { FilterType, IDashboardData } from "@fiap-tech-challenge/models";

interface DashboardContextType {
  dashboard: IDashboardData | null;
  refresh: (range: FilterType) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<IDashboardData | null>(null);

  const fetchDashboard = useCallback(async (range: FilterType) => {
    if (!user?.id) return;

    try {
      const data = await dashboardService.getDashboard(user.id, range);
      setDashboard(data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user) {
      fetchDashboard(FilterType.YEAR);
    }
  }, [user, fetchDashboard]);

  const value = useMemo(() => ({ dashboard, refresh: fetchDashboard }), [dashboard, fetchDashboard]);

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("error dashboard context");
  }
  return context;
}
