import type { ITransactionsQueries } from "@fiap-tech-challenge/database/queries";
import type { ITransactionInsert, ITransactionUpdate } from "@fiap-tech-challenge/database/types";
import { HttpError } from "@fiap-tech-challenge/services";

import type { ITransactionService } from "./transaction-service.interface";


export class TransactionService implements ITransactionService {
  private readonly queries: ITransactionsQueries

  constructor(queries: ITransactionsQueries) {
    this.queries = queries;
  }

  async getAll(params?: Record<string, unknown>) {
    try {
      const transactions = await this.queries.getAllTransactions(params);
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new HttpError(500, 'Error fetching transactions');
    }
  }

  async getById(id: string) {
    try {
      const transaction = await this.queries.getTransactionById(id);
      if (!transaction) {
        throw new HttpError(404, 'Transaction not found');
      }
      return transaction;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      console.error('Error fetching transaction:', error);
      throw new HttpError(500, 'Error fetching transaction');
    }
  }

  async create(data: ITransactionInsert) {
    try {
      const transactionData: ITransactionInsert = {
        ...data,
        id: data.id || Date.now().toString(),
        description: data.description || '',
        date: data.date || new Date().toISOString(),
      };

      const transaction = await this.queries.createTransaction(transactionData);
      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new HttpError(500, 'Error creating transaction');
    }
  }

  async update(id: string, data: ITransactionUpdate) {
    try {
      const transaction = await this.queries.updateTransaction(id, data);

      if (!transaction) {
        throw new HttpError(404, 'Transaction not found');
      }

      return transaction;
    } catch (error) {
      if (error instanceof HttpError) throw error;
      console.error('Error updating transaction:', error);
      throw new HttpError(500, 'Error updating transaction');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.queries.deleteTransaction(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        throw new HttpError(404, 'Transaction not found');
      }
      throw new HttpError(500, 'Error deleting transaction');
    }
  }
}
