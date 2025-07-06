
import { HttpError } from "@bytebank/lib/http-error";
import type { IAuthService } from "./auth-service.interface";
import type { IQueries } from "@bytebank/lib/database/queries";

export class AuthService implements IAuthService {
  private queries: IQueries;

  constructor(queries: IQueries) {
    this.queries = queries;
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
