import type { GetAllTransactionsResponse } from "@fiap-tech-challenge/database/queries";
import type { ITransaction, ITransactionInsert, ITransactionUpdate } from "@fiap-tech-challenge/database/types";

export interface ITransactionService {
  getAll(params?: Record<string, unknown>): Promise<GetAllTransactionsResponse>;
  getById(id: string): Promise<ITransaction>;
  create(data: ITransactionInsert): Promise<ITransaction>;
  update(id: string, data: ITransactionUpdate): Promise<ITransaction>;
  delete(id: string): Promise<void>;
}
