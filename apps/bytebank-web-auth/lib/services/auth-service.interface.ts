import type { User } from "@supabase/supabase-js";

import type { IUser } from "../../shared/models/user.interface";

export interface IAuthService {
  signUp(user: IUser): Promise<User | null>;
  signInWithPassword(email: string, password: string): Promise<User>;
  getCurrentUser(): Promise<User>;
}
