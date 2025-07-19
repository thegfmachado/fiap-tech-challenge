import type { User } from "@supabase/supabase-js";
import type { IUser } from "@fiap-tech-challenge/models";

export interface IAuthService {
  signUp(user: IUser): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  getCurrentUser(): Promise<User>;
  forgotPassword(email: string): Promise<void>;
  updateUser(user: Partial<IUser>): Promise<User>;
}
