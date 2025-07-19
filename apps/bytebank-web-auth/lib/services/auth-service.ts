import { HttpError } from "@fiap-tech-challenge/services";
import type { IUser } from "@fiap-tech-challenge/models";

import type { IAuthService } from "./auth-service.interface";
import { AuthQueriesService } from "@fiap-tech-challenge/database/queries";
import { createServerClient } from "@fiap-tech-challenge/database/server";
import { cookies } from "next/headers";

export class AuthService implements IAuthService {

  private async getQueries() {
    const cookieStore = await cookies();
    const client = await createServerClient(cookieStore);

    return new AuthQueriesService(client);
  }

  async signUp(user: IUser) {
    try {
      const queries = await this.getQueries();
      return await queries.signUp(user);
    } catch (error) {
      console.error('Error signing up user:', error);
      throw new HttpError(500, 'Error signing up user');
    }
  }

  async signInWithPassword(email: string, password: string) {
    try {
      const queries = await this.getQueries();
      const user = await queries.signInWithPassword(email, password);

      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      return user;
    } catch (error) {
      console.error('Error logging in user:', error);
      throw new HttpError(500, 'Error logging in user');
    }
  }

  async getCurrentUser() {
    try {
      const queries = await this.getQueries();
      const user = await queries.getCurrentUser();

      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      return user;
    } catch (error) {
      console.error('Error fetching logged user:', error);
      throw new HttpError(500, 'Error fetching logged user');
    }
  }

  async signOut() {
    try {
      const queries = await this.getQueries();
      await queries.signOut();
    } catch (error) {
      console.error('Error signing out user:', error);
      throw new HttpError(500, 'Error signing out user');
    }
  }

  async forgotPassword(email: string) {
    try {
      const queries = await this.getQueries();
      await queries.forgotPassword(email);
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      throw new HttpError(500, 'Error sending forgot password email');
    }
  }

  async updateUser(user: Partial<IUser>) {
    try {
      const queries = await this.getQueries();
      const updatedUser = await queries.updateUser(user);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new HttpError(500, 'Error updating user');
    }
  }

  async updateUserPassword(password: string) {
    try {
      const queries = await this.getQueries();
      const updatedUser = await queries.updateUser({ password });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user password:', error);
      throw new HttpError(500, 'Error updating user password');
    }
  }
}
