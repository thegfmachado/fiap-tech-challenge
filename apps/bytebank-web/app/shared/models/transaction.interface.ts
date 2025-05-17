export interface ITransaction {
  id: string;
  type: 'credit' | 'debit';
  value: number;
  date: string;
  description: string;
}
