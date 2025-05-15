export interface Transaction {
    id: number;
    type: 'credit' | 'debit';
    value: number;
    date: string;
    description: string;
}
