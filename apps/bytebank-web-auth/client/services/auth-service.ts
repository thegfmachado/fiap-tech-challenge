import type { User } from "@supabase/supabase-js";

import { toast } from "@fiap-tech-challenge/design-system/components";
import type { IUser } from "@fiap-tech-challenge/models";

import { HTTPService } from "@fiap-tech-challenge/services";

import type { IAuthService } from "./auth-service.interface";

export class AuthService implements IAuthService {
  private readonly httpService: HTTPService

  constructor(httpService: HTTPService) {
    this.httpService = httpService;
  }

  async signUp(user: IUser): Promise<User> {
    try {
      const createdUser = await this.httpService.post("/api/auth/signup", user);

      toast.success("Usuário criado com sucesso! Um e-mail de confirmação foi enviado para o e-mail informado, confirme sua conta e faça login para continuar.", {
        duration: 6000,
      })

      return createdUser as User;
    } catch (err) {
      toast.error("Erro ao criar usuário")
      throw err;
    }
  }

  async signIn(email: string, password: string): Promise<User> {
    const data = await this.httpService.post("/api/auth", { email, password });
    return data as User;
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

  async forgotPassword(email: string): Promise<void> {
    try {
      await this.httpService.post("/api/auth/forgot-password", { email });
    } catch (err) {
      toast.error("Erro ao enviar email de recuperação. Verifique o email informado e tente novamente.");
      throw err;
    }
  }

  async updateUser(user: Partial<IUser>): Promise<User> {
    try {
      const updatedUser = await this.httpService.put("/api/auth", user);
      return updatedUser as User;
    } catch (err) {
      toast.error("Erro ao atualizar usuário");
      throw err;
    }
  }

  async updateUserPassword(password: string): Promise<User> {
    try {
      const updatedUser = await this.httpService.patch("/api/auth/reset-password", { password });
      return updatedUser as User;
    } catch (err) {
      toast.error("Erro ao atualizar senha do usuário.");
      throw err;
    }
  }
}
