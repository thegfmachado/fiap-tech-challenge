import { ITransaction } from "@fiap-tech-challenge/database/types";

export interface ITransactionService {
  getAll(params?: Record<string, string | number>): Promise<ITransaction[]>;
  create(transaction: ITransaction): Promise<ITransaction>;
  update(id: string, updates: Partial<ITransaction>): Promise<ITransaction>;
  delete(id: string): Promise<void>;
}
