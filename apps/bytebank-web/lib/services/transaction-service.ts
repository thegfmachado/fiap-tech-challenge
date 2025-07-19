import { HttpError } from "@fiap-tech-challenge/services";

import { ITransactionService } from "./transaction-service.interface";

import { ITransactionInsert, ITransactionUpdate } from "@fiap-tech-challenge/database/types";
import { createServerClient } from "@fiap-tech-challenge/database/server";
import { TransactionsQueriesService } from "@fiap-tech-challenge/database/queries";

import { cookies } from "next/headers";

export class TransactionService implements ITransactionService {
  private async getQueries() {
    const cookieStore = await cookies();
    const client = await createServerClient(cookieStore);
    return new TransactionsQueriesService(client);
  }

  async getAll(params?: Record<string, string | number>) {
    try {
      const queries = await this.getQueries();
      const transactions = await queries.getAllTransactions(params);
      return transactions;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new HttpError(500, 'Error fetching transactions');
    }
  }

  async getById(id: string) {
    try {
      const queries = await this.getQueries();
      const transaction = await queries.getTransactionById(id);
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
      const transactionData = {
        id: data.id || Date.now().toString(),
        type: data.type,
        description: data.description || '',
        value: data.value,
        date: data.date || new Date().toISOString(),
      };

      const queries = await this.getQueries();
      const transaction = await queries.createTransaction(transactionData);
      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new HttpError(500, 'Error creating transaction');
    }
  }

  async update(id: string, data: ITransactionUpdate) {
    try {
      const queries = await this.getQueries();
      const transaction = await queries.updateTransaction(id, data);

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
      const queries = await this.getQueries();
      await queries.deleteTransaction(id);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      if (error instanceof Error && error.message.includes('not found')) {
        throw new HttpError(404, 'Transaction not found');
      }
      throw new HttpError(500, 'Error deleting transaction');
    }
  }
}
