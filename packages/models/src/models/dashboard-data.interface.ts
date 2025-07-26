export interface IDashboardData {
  amount: IFinancialMovement;
  expenses: IFinancialMovement;
  income: IFinancialMovement;
  incomeByRange: IIncomeByRange[];
  amountAndExpensesByRange: IAmountAndExpensesByRange[];
}

export interface IFinancialMovement {
  total: number;
  increasePercentage: string;
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