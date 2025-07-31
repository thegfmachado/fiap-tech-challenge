import type { User } from '@supabase/supabase-js';
import type { IUser } from '@fiap-tech-challenge/models';

import type { TypedSupabaseClient } from '../../types.js';
import type { IAuthQueries } from './auth-queries.interface.js';

export class AuthQueriesService implements IAuthQueries {
  private client: TypedSupabaseClient;

  constructor(client: TypedSupabaseClient) {
    this.client = client;
  }

  async signUp(user: IUser): Promise<User | null> {
    const { email, password, name } = user;

    const { data, error } = await this.client.auth.signUp({
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
  }

  async signInWithPassword(email: string, password: string): Promise<User | null> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error logging in user: ${error.message}`);
    }

    return data.user;
  }

  async getCurrentUser(): Promise<User | null> {
    const { data } = await this.client.auth.getUser();

    return data.user;
  }

  async signOut(): Promise<void> {
    const { error } = await this.client.auth.signOut();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error signing out user: ${error.message}`);
    }
  }

  async forgotPassword(email: string): Promise<void> {
    const { error } = await this.client.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.BYTEBANK_WEB_DOMAIN}/auth/reset-password`,
    });

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error sending password reset email: ${error.message}`);
    }
  }

  async updateUser(user: Partial<IUser>): Promise<User | null> {
    const { data, error } = await this.client.auth.updateUser({
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
}
