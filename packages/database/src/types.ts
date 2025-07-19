import type { SupabaseClient } from "@supabase/supabase-js";

import type { Enums, Database, Tables, TablesInsert, TablesUpdate } from "./generated-types.js";

export type TypedSupabaseClient = SupabaseClient<Database>;

type TransformTransaction<T> = Omit<T, 'created_at' | 'updated_at' | 'user_id'>;

export type ITransaction = TransformTransaction<Tables<'transactions'>>;
export type ITransactionInsert = TransformTransaction<TablesInsert<'transactions'>>;
export type ITransactionUpdate = TransformTransaction<TablesUpdate<'transactions'>>;
export type ITransactionType = Enums<'transaction_type'>;

export type { Database } from './generated-types.js';
