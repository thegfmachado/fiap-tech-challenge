import { HTTPService } from "./http-service";

import { IDashboardService } from "./dashboard-service.interface";
import { IDashboardData } from "@bytebank/shared/models/dashboard-data.interface";

export class DashboardService implements IDashboardService {
  constructor(private readonly httpService: HTTPService) { }

  get(params?: Record<string, string | number>): Promise<IDashboardData> {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return this.httpService.get<IDashboardData>(`/api/dashboard${queryString}`);
  }
}
