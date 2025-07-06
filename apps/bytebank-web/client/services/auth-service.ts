import type { User } from "@supabase/supabase-js";

import { toast } from "@fiap-tech-challenge/design-system/components";

import { HTTPService } from "./http-service";

import type { IAuthService } from "./auth-service.interface";

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
      toast.error("Erro ao buscar usuário logado")
      throw err;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.httpService.post("/api/auth/signout");
      toast("Saindo... Você será redirecionado para a página inicial em instantes.", {
        duration: 2000,
      });
    } catch (err) {
      toast.error("Erro ao deslogar usuário")
      throw err;
    }
  }
}
