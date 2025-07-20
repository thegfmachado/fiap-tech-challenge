export interface IDashboardData {
  amount: number;
  expenses: number;
  income: number;
  incomeByMonth: IIncomeByMonth[];
  amountAndExpensesByMonth: IAmountAndExpensesByMonth[];
}

export interface IIncomeByMonth {
  month: string;
  income: number
}

export interface IAmountAndExpensesByMonth {
  month: string;
  amount: number;
  expenses: number;
}