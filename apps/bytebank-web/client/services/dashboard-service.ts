import { HTTPService } from "@fiap-tech-challenge/services/http";

import { IDashboardService } from "./dashboard-service.interface";
import { IDashboardData } from "@fiap-tech-challenge/models";

export class DashboardService implements IDashboardService {
  constructor(private readonly httpService: HTTPService) { }

  get(params?: Record<string, string | number>): Promise<IDashboardData> {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return this.httpService.get<IDashboardData>(`/api/dashboard${queryString}`);
  }
}
