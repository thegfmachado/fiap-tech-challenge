import { HTTPService } from "./http-service";

import type { ITransactionService } from "./transaction-service.interface";
import { ITransaction } from "@bytebank/shared/models/transaction.interface";

export class TransactionService implements ITransactionService {
  constructor(private readonly httpService: HTTPService) { }

  async getAll(params?: Record<string, string | number>): Promise<ITransaction[]> {
    const queryString = params
      ? '?' + new URLSearchParams(params as Record<string, string>).toString()
      : '';

    return this.httpService.get(`/api/transactions${queryString}`);
  }


  async create(transaction: ITransaction): Promise<ITransaction> {
    return this.httpService.post("/api/transactions", transaction);
  }

  async update(id: string, updates: Partial<ITransaction>): Promise<ITransaction> {
    return this.httpService.patch(`/api/transactions/${id}`, updates);
  }

  async delete(id: string): Promise<void> {
    await this.httpService.delete(`/api/transactions/${id}`);
  }
}
