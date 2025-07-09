import { IDashboardData } from "@bytebank/shared/models/dashboard-data.interface";

export interface IDashboardService {
  get(params?: Record<string, string | number>): Promise<IDashboardData>;
}
