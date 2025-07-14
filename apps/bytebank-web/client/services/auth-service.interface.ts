import type { User } from "@supabase/supabase-js";

export interface IAuthService {
  getCurrentUser(): Promise<User>;
  signOut(): Promise<void>;
}
