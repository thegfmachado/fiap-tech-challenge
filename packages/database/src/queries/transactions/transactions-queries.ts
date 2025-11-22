import type { ITransaction, ITransactionInsert, ITransactionUpdate, TypedSupabaseClient } from '../../types.js';
import type { GetAllTransactionsParams, GetAllTransactionsResponse, ITransactionsQueries } from './transactions-queries.interface.js';

export class TransactionsQueriesService implements ITransactionsQueries {
  static TABLE_NAME = 'transactions' as const;

  private client: TypedSupabaseClient;

  constructor(client: TypedSupabaseClient) {
    this.client = client;
  }

  async getAllTransactions(params?: GetAllTransactionsParams): Promise<GetAllTransactionsResponse> {
    const { type, term, startDate, endDate, from, to, userId } = params || {};

    let query = this.client
      .from(TransactionsQueriesService.TABLE_NAME)
      .select('*', { count: 'exact' })
      .order('date', { ascending: false });

    if (userId) {
      query = query.eq('user_id', userId);
    }

    query = this.applyFilters(query, { type, term, startDate, endDate });

    if (from !== undefined && to !== undefined) {
      query = query.range(from, to);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error:', error);
      throw new Error(`Error fetching transactions: ${error.message}`);
    }

    return {
      data,
      count: count ?? 0,
    };
  }

  private applyFilters(query: any, filters: { type?: string; term?: string; startDate?: string; endDate?: string }) {
    const { type, term, startDate, endDate } = filters;

    if (type) {
      query = query.eq('type', type as 'credit' | 'debit');
    }

    if (term) {
      query = query.ilike('description', `%${term}%`);
    }

    if (startDate) {
      const adjustedStartDate = new Date(startDate);
      adjustedStartDate.setHours(0, 0, 0, 0);
      query = query.gte('date', adjustedStartDate.toISOString());
    }

    if (endDate) {
      const adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999);
      query = query.lte('date', adjustedEndDate.toISOString());
    }

    return query;
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
