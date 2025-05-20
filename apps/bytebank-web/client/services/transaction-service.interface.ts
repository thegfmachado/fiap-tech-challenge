import { ITransaction } from "@bytebank/shared/models/transaction.interface";

export interface ITransactionService {
  getAll(params?: Record<string, string | number>): Promise<ITransaction[]>;
  create(transaction: ITransaction): Promise<ITransaction>;
  update(id: string, updates: Partial<ITransaction>): Promise<ITransaction>;
  delete(id: string): Promise<void>;
}
