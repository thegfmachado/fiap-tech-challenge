import type { User } from "@supabase/supabase-js";
import type { IUser } from "@bytebank/shared/models/user.interface";

export interface IAuthService {
  getCurrentUser(): Promise<User>;
}
