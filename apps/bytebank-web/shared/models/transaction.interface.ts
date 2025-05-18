import { TransactionType } from "@bytebank/shared/enums/transaction-type.enum";

export interface ITransaction {
  id: string;
  type: TransactionType;
  value: number;
  date: string;
  description: string;
}
