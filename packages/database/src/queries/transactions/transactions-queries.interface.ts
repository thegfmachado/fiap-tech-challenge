import type { ITransaction, ITransactionInsert, ITransactionUpdate } from '../../types.js';

export type GetAllTransactionsParams = {
  type?: string;
  startDate?: string;
  endDate?: string;
  from?: number;
  to?: number;
};

export type GetAllTransactionsResponse = {
  data: ITransaction[];
  count: number | null;
};

export interface ITransactionsQueries {
  getAllTransactions: (params?: GetAllTransactionsParams) => Promise<GetAllTransactionsResponse>;
  getTransactionById: (id: string) => Promise<ITransaction>;
  createTransaction: (transaction: ITransactionInsert) => Promise<ITransaction>;
  updateTransaction: (id: string, transaction: ITransactionUpdate) => Promise<ITransaction>;
  deleteTransaction: (id: string) => Promise<ITransaction>;
}
