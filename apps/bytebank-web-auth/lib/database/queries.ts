import process from "process";

import type { User } from '@supabase/supabase-js';
import { createClient } from '@bytebank-web-auth/shared/utils/supabase/server';

import type { IUser } from '../../shared/models/user.interface';

export const TABLES = {
  USERS: 'users',
} as const;

export type IQueries = {
  auth: {
    signUp: (user: IUser) => Promise<User | null>;
    signInWithPassword: (email: string, password: string) => Promise<User | null>;
    getCurrentUser: () => Promise<User | null>;
    signOut: () => Promise<void>;
    forgotPassword: (email: string) => Promise<void>;
    updateUser: (user: Partial<IUser>) => Promise<User | null>;
  };
}

export const queries: IQueries = {
  auth: {
    signUp: async (user: IUser): Promise<User | null> => {
      const { email, password, name } = user;

      const supabase = await createClient();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${process.env.BYTEBANK_WEB_DOMAIN}/auth/login`,
        }
      })

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Error creating user: ${error.message}`);
      }

      return data.user;
    },
    signInWithPassword: async (email: string, password: string): Promise<User | null> => {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Error logging in user: ${error.message}`);
      }

      return data.user;
    },
    getCurrentUser: async (): Promise<User | null> => {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Error fetching user: ${error.message}`);
      }

      return data.user;
    },
    signOut: async (): Promise<void> => {
      const supabase = await createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Error signing out user: ${error.message}`);
      }
    },
    forgotPassword: async (email: string): Promise<void> => {
      const supabase = await createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.BYTEBANK_WEB_DOMAIN}/auth/reset-password`,
      });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Error sending password reset email: ${error.message}`);
      }
    },
    updateUser: async (user: Partial<IUser>): Promise<User> => {
      const supabase = await createClient();

      const { data, error } = await supabase.auth.updateUser({
        email: user.email,
        password: user.password,
        data: {
          name: user.name,
        },
      });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Error updating user: ${error.message}`);
      }

      return data.user;
    }
  },
};
