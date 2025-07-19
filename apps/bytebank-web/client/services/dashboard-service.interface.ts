import { IDashboardData } from "@fiap-tech-challenge/models";

export interface IDashboardService {
  get(params?: Record<string, string | number>): Promise<IDashboardData>;
}
