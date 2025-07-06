import type { User } from "@supabase/supabase-js";

import { toast } from "@fiap-tech-challenge/design-system/components";

import { HTTPService } from "./http-service";

import type { IAuthService } from "./auth-service.interface";
import type { IUser } from "@bytebank/shared/models/user.interface";

export class AuthService implements IAuthService {
  private readonly httpService: HTTPService

  constructor(httpService: HTTPService) {
    this.httpService = httpService;
  }

  async getCurrentUser(): Promise<User> {
    try {
      const data = await this.httpService.get("/api/auth");
      return data as User;
    } catch (err) {
      toast("Erro ao buscar usuário logado")
      throw err;
    }
  }
}
