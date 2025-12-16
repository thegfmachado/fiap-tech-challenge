import type { IAuthQueries } from "@fiap-tech-challenge/database/queries";
import type { IUser } from "@fiap-tech-challenge/models";
import { HttpError } from "@fiap-tech-challenge/services";

import type { IAuthService } from "./auth-service.interface";

export class AuthService implements IAuthService {

  private readonly queries: IAuthQueries

  constructor(queries: IAuthQueries) {
    this.queries = queries;
  }

  async signUp(user: IUser) {
    try {
      return await this.queries.signUp(user);
    } catch (error) {
      console.error('Error signing up user:', error);
      throw new HttpError(500, 'Error signing up user');
    }
  }

  async signInWithPassword(email: string, password: string) {
    try {
      const user = await this.queries.signInWithPassword(email, password);

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
      return await this.queries.getCurrentUser();
    } catch (error) {
      console.error('Error fetching logged user:', error);
      throw new HttpError(500, 'Error fetching logged user');
    }
  }

  async signOut() {
    try {
      await this.queries.signOut();
    } catch (error) {
      console.error('Error signing out user:', error);
      throw new HttpError(500, 'Error signing out user');
    }
  }

  async forgotPassword(email: string) {
    try {
      await this.queries.forgotPassword(email);
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      throw new HttpError(500, 'Error sending forgot password email');
    }
  }

  async updateUser(user: Partial<IUser>) {
    try {
      const updatedUser = await this.queries.updateUser(user);
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new HttpError(500, 'Error updating user');
    }
  }

  async updateUserPassword(password: string) {
    try {
      const updatedUser = await this.queries.updateUser({ password });
      return updatedUser;
    } catch (error) {
      console.error('Error updating user password:', error);
      throw new HttpError(500, 'Error updating user password');
    }
  }
}
