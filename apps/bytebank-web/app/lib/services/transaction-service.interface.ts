import { ITransaction } from "../../shared/models/transaction.interface";

export interface ITransactionService {
  getAll(): Promise<ITransaction[]>;
  getById(id: string): Promise<ITransaction>;
  create(data: Partial<ITransaction>): Promise<ITransaction>;
  update(id: string, data: Partial<ITransaction>): Promise<ITransaction>;
  delete(id: string): Promise<void>;
}
