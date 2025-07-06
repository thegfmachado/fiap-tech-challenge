import { HttpError } from "../http-error";
import type { IUser } from "../../shared/models/user.interface";
import { IQueries } from "../database/queries";
import type { IAuthService } from "./auth-service.interface";

export class AuthService implements IAuthService {
  private queries: IQueries;

  constructor(queries: IQueries) {
    this.queries = queries;
  }

  async signUp(user: IUser) {
    try {
      return await this.queries.auth.signUp(user);
    } catch (error) {
      console.error('Error signing up user:', error);
      throw new HttpError(500, 'Error signing up user');
    }
  }

  async signInWithPassword(email: string, password: string) {
    try {
      const user = await this.queries.auth.signInWithPassword(email, password);

      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      return user;
    }
    catch (error) {
      console.error('Error logging in user:', error);

      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError(500, 'Error logging in user');
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.queries.auth.getCurrentUser();

      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      return user;
    } catch (error) {
      console.error('Error fetching logged user:', error);

      if (error instanceof HttpError) {
        throw error;
      }

      throw new HttpError(500, 'Error fetching logged user');
    }
  }
}
