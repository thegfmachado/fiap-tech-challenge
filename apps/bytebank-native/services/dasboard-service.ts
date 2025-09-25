import { IDashboardData, IFinancialMovement } from "@fiap-tech-challenge/models";
import { supabase } from "../lib/supabase";
import { ITransaction } from "@fiap-tech-challenge/database/types";

export interface IDashboardService {
  getMonthlyDashboard(userId: string): Promise<IDashboardData>;
}

export class DashboardService implements IDashboardService {
  async getMonthlyDashboard(userId: string): Promise<IDashboardData> {

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      throw error;
    }

    const transactions = (data as ITransaction[]) || [];

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    });

    const previousTransactions = transactions.filter((t) => {
      const date = new Date(t.date);
      const prevMonth = currentMonth - 1;
      const prevYear = prevMonth < 0 ? currentYear - 1 : currentYear;
      const adjustedMonth = (prevMonth + 12) % 12;
      return date.getFullYear() === prevYear && date.getMonth() === adjustedMonth;
    });

    const currentIncome = this.getTotalByType(currentTransactions, "credit");
    const currentExpenses = this.getTotalByType(currentTransactions, "debit");
    const currentAmount = currentIncome - currentExpenses;

    const previousIncome = this.getTotalByType(previousTransactions, "credit");
    const previousExpenses = this.getTotalByType(previousTransactions, "debit");
    const previousAmount = previousIncome - previousExpenses;

    const amount = this.calculateFinancialMovement(currentAmount, previousAmount);
    const income = this.calculateFinancialMovement(currentIncome, previousIncome);
    const expenses = this.calculateFinancialMovement(currentExpenses, previousExpenses);

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const { incomeByPeriod, amountByPeriod, expensesByPeriod } = this.getValuesByRange(
      currentTransactions,
      daysInMonth,
      (date) => date.getDate() - 1
    );

    const incomeByRange = incomeByPeriod.map((income, i) => ({
      period: String(i + 1).padStart(2, "0"),
      income: income ?? 0,
    }));

    const amountAndExpensesByRange = amountByPeriod.map((amount, i) => ({
      period: String(i + 1).padStart(2, "0"),
      amount: amount ?? 0,
      expenses: expensesByPeriod[i] ?? 0,
    }));

    return { amount, income, expenses, incomeByRange, amountAndExpensesByRange };
  }

  private getValuesByRange(
    transactions: ITransaction[],
    size: number,
    getIndex: (date: Date) => number
  ) {
    const incomeByPeriod = Array(size).fill(0);
    const amountByPeriod = Array(size).fill(0);
    const expensesByPeriod = Array(size).fill(0);

    for (const t of transactions) {
      const date = new Date(t.date);
      const index = getIndex(date);
      if (index < 0 || index >= size) continue;

      if (t.type === "credit") {
        incomeByPeriod[index] += t.value;
        amountByPeriod[index] += t.value;
      } else if (t.type === "debit") {
        incomeByPeriod[index] -= t.value;
        expensesByPeriod[index] += t.value;
      }
    }

    return { incomeByPeriod, amountByPeriod, expensesByPeriod };
  }

  private getTotalByType(transactions: ITransaction[], type: "credit" | "debit"): number {
    return transactions.reduce(
      (sum, transaction) => (transaction.type === type ? sum + transaction.value : sum),
      0
    );
  }

  private calculateFinancialMovement(current: number, previous: number): IFinancialMovement {
    let percentage: number;
    if (previous === 0) {
      percentage = current === 0 ? 0 : 100;
    } else {
      percentage = ((current - previous) / previous) * 100;
    }
    const rounded = Number(percentage.toFixed(2));
    const formatted = `${rounded >= 0 ? "+" : ""}${rounded}%`;
    return { total: current, increasePercentage: formatted };
  }
}

export const dashboardService = new DashboardService();
