import type { User } from "@supabase/supabase-js";
import type { IUser } from "@bytebank-web-auth/shared/models/user.interface";

export interface IAuthService {
  signUp(user: IUser): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  getCurrentUser(): Promise<User>;
}
