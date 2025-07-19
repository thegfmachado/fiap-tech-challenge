import type { User } from "@supabase/supabase-js";

import type { IUser } from "@fiap-tech-challenge/models";

export interface IAuthService {
  signUp(user: IUser): Promise<User | null>;
  signInWithPassword(email: string, password: string): Promise<User>;
  getCurrentUser(): Promise<User>;
  signOut(): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  updateUser(user: Partial<IUser>): Promise<User | null>;
  updateUserPassword(password: string): Promise<User | null>;
}
