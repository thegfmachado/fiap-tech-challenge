import type { ITransaction, ITransactionInsert, ITransactionUpdate } from '../../types.js';

export interface ITransactionsQueries {
  getAllTransactions: (params?: Record<string, string | number>) => Promise<ITransaction[]>;
  getTransactionById: (id: string) => Promise<ITransaction>;
  createTransaction: (transaction: ITransactionInsert) => Promise<ITransaction>;
  updateTransaction: (id: string, transaction: ITransactionUpdate) => Promise<ITransaction>;
  deleteTransaction: (id: string) => Promise<ITransaction>;
}
