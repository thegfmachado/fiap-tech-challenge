import type { User } from '@supabase/supabase-js';

import type { IUser } from '@fiap-tech-challenge/models';

export interface IAuthQueries {
  signUp: (user: IUser) => Promise<User | null>;
  signInWithPassword: (email: string, password: string) => Promise<User | null>;
  getCurrentUser: () => Promise<User | null>;
  signOut: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateUser: (user: Partial<IUser>) => Promise<User | null>;
}
