export interface IDashboardData {
  amount: number;
  expenses: number;
  income: number;
  incomeByRange: IIncomeByRange[];
  amountAndExpensesByRange: IAmountAndExpensesByRange[];
}

export interface IIncomeByRange {
  period: string;
  income: number
}

export interface IAmountAndExpensesByRange {
  period: string;
  amount: number;
  expenses: number;
}