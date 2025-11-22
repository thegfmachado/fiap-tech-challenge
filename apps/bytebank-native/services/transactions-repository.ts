import { ITransaction } from "@fiap-tech-challenge/database/types";
import { supabase } from "../lib/supabase";

export interface ITransactionsRepository {
  getTransactionsByUser(userId: string): Promise<ITransaction[]>;
}

export class SupabaseTransactionsRepository implements ITransactionsRepository {
  async getTransactionsByUser(userId: string): Promise<ITransaction[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    return (data as ITransaction[]) || [];
  }
}

export const supabaseTransactionsRepository = new SupabaseTransactionsRepository();
