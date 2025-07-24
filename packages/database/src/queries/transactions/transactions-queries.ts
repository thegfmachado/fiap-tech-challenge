import type { ITransaction, ITransactionInsert, ITransactionType, ITransactionUpdate, TypedSupabaseClient } from '../../types.js';
import type { GetAllTransactionsParams, GetAllTransactionsResponse, ITransactionsQueries } from './transactions-queries.interface.js';

export class TransactionsQueriesService implements ITransactionsQueries {
  static TABLE_NAME = 'transactions' as const;

  private client: TypedSupabaseClient;

  constructor(client: TypedSupabaseClient) {
    this.client = client;
  }

  async getAllTransactions(params?: GetAllTransactionsParams): Promise<GetAllTransactionsResponse> {
    const { type, startDate, endDate, from, to } = params || {};

    let query = this.client
      .from(TransactionsQueriesService.TABLE_NAME)
      .select('*', { count: 'exact' })
      .order('date', { ascending: false })

    if (from !== undefined && to !== undefined) {
      query = query.range(from, to);
    }

    if (type) {
      query = query.eq('type', type as ITransactionType);
    }
    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data, count, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error fetching transactions: ${error.message}`);
    }

    return {
      data,
      count,
    };
  }


  async getTransactionById(id: string): Promise<ITransaction> {
    const { data, error } = await this.client
      .from(TransactionsQueriesService.TABLE_NAME)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error fetching transaction: ${error.message}`);
    }

    return data;
  }

  async createTransaction(transaction: ITransactionInsert): Promise<ITransaction> {
    const { data, error } = await this.client
      .from(TransactionsQueriesService.TABLE_NAME)
      .insert(transaction)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error creating transaction: ${error.message}`);
    }

    return data;
  }

  async updateTransaction(id: string, transaction: ITransactionUpdate): Promise<ITransaction> {
    const { data, error } = await this.client
      .from(TransactionsQueriesService.TABLE_NAME)
      .update(transaction)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error updating transaction: ${error.message}`);
    }

    return data;
  }

  async deleteTransaction(id: string): Promise<ITransaction> {
    const { data, error } = await this.client
      .from(TransactionsQueriesService.TABLE_NAME)
      .delete()
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error deleting transaction: ${error.message}`);
    }

    return data;
  }
}
