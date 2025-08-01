import type { GetAllTransactionsResponse } from "@fiap-tech-challenge/database/queries";
import { ITransaction } from "@fiap-tech-challenge/database/types";
import { IAttachment } from "@fiap-tech-challenge/services";

export interface ITransactionService {
  getAll(params?: Record<string, string | number>): Promise<GetAllTransactionsResponse>;
  create(transaction: ITransaction): Promise<ITransaction>;
  update(id: string, updates: Partial<ITransaction>): Promise<ITransaction>;
  delete(id: string): Promise<void>;
  uploadAttachment(transactionId: string, file: File): Promise<IAttachment>;
  downloadAttachment(transactionId: string, fileName: string): Promise<Blob>;
  deleteAttachment(transactionId: string, fileName: string): Promise<void>;
}
