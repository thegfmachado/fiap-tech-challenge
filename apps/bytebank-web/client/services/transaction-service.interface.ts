import { ITransaction } from "@bytebank/shared/models/transaction.interface";

export interface ITransactionService {
  getAll(): Promise<ITransaction[]>;
  create(transaction: ITransaction): Promise<ITransaction>;
  update(id: string, updates: Partial<ITransaction>): Promise<ITransaction>;
  delete(id: string): Promise<void>;
}
