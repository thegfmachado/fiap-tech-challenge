import { TransactionType } from "@bytebank/shared/enums/transaction-type.enum";

export interface ITransaction {
  id: string;
  accountId: string;
  type: TransactionType;
  value: number;
  date: string;
  from: string;
  to?: string;
  anexo?: string;
}
