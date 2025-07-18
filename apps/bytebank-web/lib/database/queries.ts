import { createClient } from '@bytebank/shared/utils/supabase/server';
import type { ITransaction } from '@bytebank/shared/models/transaction.interface';

export const TABLES = {
  TRANSACTIONS: 'transactions',
} as const;

export type IQueries = {
  transaction: {
    getAllTransactions: (params?: Record<string, string | number>) => Promise<ITransaction[]>;
    getTransactionById: (id: string) => Promise<ITransaction>;
    createTransaction: (transactionData: Partial<ITransaction>) => Promise<ITransaction>;
    updateTransaction: (id: string, updateData: Partial<ITransaction>) => Promise<ITransaction>;
    deleteTransaction: (id: string) => Promise<ITransaction>;
  };
}

export const queries: IQueries = {
  transaction: {
    getAllTransactions: async (params?: Record<string, string | number>): Promise<ITransaction[]> => {
      const supabase = await createClient();

      let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

      if (params?.type) {
        query = query.eq('type', params.type);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Error fetching transactions: ${error.message}`);
      }

      return data || [];
    },

    getTransactionById: async (id: string): Promise<ITransaction> => {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Error fetching transaction: ${error.message}`);
      }

      return data;
    },

    createTransaction: async (transactionData: Partial<ITransaction>): Promise<ITransaction> => {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('transactions')
        .insert([transactionData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Error creating transaction: ${error.message}`);
      }

      return data;
    },

    updateTransaction: async (id: string, updateData: Partial<ITransaction>): Promise<ITransaction> => {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('transactions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Error updating transaction: ${error.message}`);
      }

      return data;
    },

    deleteTransaction: async (id: string): Promise<ITransaction> => {
      const supabase = await createClient();

      const { data, error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)
        .select()
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Error deleting transaction: ${error.message}`);
      }

      if (!data) {
        throw new Error(`Transaction with id ${id} not found`);
      }

      return data;
    },
  }
};
