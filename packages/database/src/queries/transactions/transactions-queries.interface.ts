import type { ITransaction } from '../../types.js';

export interface ITransactionsQueries {
  getAllTransactions: () => Promise<ITransaction[]>;
  getTransactionById: (id: string) => Promise<ITransaction>;
  createTransaction: (transaction: ITransaction) => Promise<ITransaction>;
  updateTransaction: (id: string, transaction: ITransaction) => Promise<ITransaction>;
  deleteTransaction: (id: string) => Promise<ITransaction>;
}
