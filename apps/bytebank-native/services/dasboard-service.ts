import { FilterType, IDashboardData, IFinancialMovement } from "@fiap-tech-challenge/models";
import { supabase } from "../lib/supabase";
import { ITransaction } from "@fiap-tech-challenge/database/types";
import { Filter } from "react-native-svg";

const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const WEEK_DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export interface IDashboardService {
  getDashboard(userId: string, period: FilterType): Promise<IDashboardData>;
}

export class DashboardService implements IDashboardService {
  async getDashboard(userId: string, period: FilterType): Promise<IDashboardData> {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;

    const transactions = (data as ITransaction[]) || [];

    const currentTransactions = transactions.filter((t) =>
      this.isInCurrentPeriod(t.date, period)
    );

    const previousTransactions = transactions.filter((t) =>
      this.isInPreviousPeriod(t.date, period)
    );

    const currentIncome = this.getTotalByType(currentTransactions, "credit");
    const currentExpenses = this.getTotalByType(currentTransactions, "debit");
    const currentAmount = currentIncome - currentExpenses;

    const previousIncome = this.getTotalByType(previousTransactions, "credit");
    const previousExpenses = this.getTotalByType(previousTransactions, "debit");
    const previousAmount = previousIncome - previousExpenses;

    const amount = this.calculateFinancialMovement(currentAmount, previousAmount);
    const income = this.calculateFinancialMovement(currentIncome, previousIncome);
    const expenses = this.calculateFinancialMovement(currentExpenses, previousExpenses);

    const incomeByRange = this.getIncomeByRange(currentTransactions, period);
    const amountAndExpensesByRange = this.getAmountAndExpensesByRange(currentTransactions, period);

    return { amount, income, expenses, incomeByRange, amountAndExpensesByRange };
  }


  private getTotalByType(transactions: ITransaction[], type: "credit" | "debit"): number {
    return transactions.reduce(
      (sum, t) => (t.type === type ? sum + t.value : sum),
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

  private isInCurrentPeriod(transactionDate: string, period: FilterType) {
    const date = new Date(transactionDate);
    const now = new Date();

    switch (period) {
      case FilterType.YEAR:
        return date.getFullYear() === now.getFullYear();
      case FilterType.MONTH:
        return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
      case FilterType.WEEK: {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        start.setHours(0, 0, 0, 0);

        const end = new Date(start);
        end.setDate(start.getDate() + 7);

        return date >= start && date < end;
      }
    }
  }

  private isInPreviousPeriod(transactionDate: string, period: FilterType) {
    const date = new Date(transactionDate);
    const now = new Date();

    switch (period) {
      case FilterType.YEAR:
        return date.getFullYear() === now.getFullYear() - 1;
      case FilterType.MONTH: {
        const prevMonth = now.getMonth() - 1;
        const prevYear = prevMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
        const adjustedMonth = (prevMonth + 12) % 12;
        return date.getFullYear() === prevYear && date.getMonth() === adjustedMonth;
      }
      case FilterType.WEEK: {
        const startOfThisWeek = new Date(now);
        startOfThisWeek.setDate(now.getDate() - now.getDay());
        startOfThisWeek.setHours(0, 0, 0, 0);

        const startOfLastWeek = new Date(startOfThisWeek);
        startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

        const endOfLastWeek = new Date(startOfThisWeek);

        return date >= startOfLastWeek && date < endOfLastWeek;
      }
    }
  }

  private getIncomeByRange(transactions: ITransaction[], period: FilterType) {
    switch (period) {
      case FilterType.WEEK: {
        const { incomeByPeriod } = this.getValuesByRange(transactions, 7, (date) => date.getDay());
        return WEEK_DAYS.map((day, i) => ({ period: day, income: incomeByPeriod[i] ?? 0 }));
      }
      case FilterType.MONTH: {
        const { incomeByPeriod } = this.getValuesByDay(transactions);
        return incomeByPeriod.map((inc, i) => ({
          period: String(i + 1).padStart(2, "0"),
          income: inc ?? 0,
        }));
      }
      case FilterType.YEAR:
      default: {
        const { incomeByPeriod } = this.getValuesByRange(
          transactions.filter((t) => new Date(t.date).getFullYear() === new Date().getFullYear()),
          12,
          (date) => date.getMonth()
        );
        return MONTHS.map((m, i) => ({ period: m, income: incomeByPeriod[i] ?? 0 }));
      }
    }
  }

  private getAmountAndExpensesByRange(transactions: ITransaction[], period: FilterType) {
    switch (period) {
      case FilterType.WEEK: {
        const { amountByPeriod, expensesByPeriod } = this.getValuesByRange(transactions, 7, (date) => date.getDay());
        return WEEK_DAYS.map((day, i) => ({
          period: day,
          amount: amountByPeriod[i] ?? 0,
          expenses: expensesByPeriod[i] ?? 0,
        }));
      }
      case FilterType.MONTH: {
        const { amountByPeriod, expensesByPeriod } = this.getValuesByDay(transactions);
        return amountByPeriod.map((amt, i) => ({
          period: String(i + 1).padStart(2, "0"),
          amount: amt ?? 0,
          expenses: expensesByPeriod[i] ?? 0,
        }));
      }
      case FilterType.YEAR:
      default: {
        const { amountByPeriod, expensesByPeriod } = this.getValuesByRange(
          transactions.filter((t) => new Date(t.date).getFullYear() === new Date().getFullYear()),
          12,
          (date) => date.getMonth()
        );
        return MONTHS.map((m, i) => ({
          period: m,
          amount: amountByPeriod[i] ?? 0,
          expenses: expensesByPeriod[i] ?? 0,
        }));
      }
    }
  }

  private getValuesByDay(transactions: ITransaction[]) {
    const now = new Date();

    const year = now.getFullYear();

    const month = now.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const isCurrentMonth = (date: Date) =>
      date.getFullYear() === year && date.getMonth() === month;

    const filtered = transactions.filter((t) => isCurrentMonth(new Date(t.date)));

    return this.getValuesByRange(filtered, daysInMonth, (date) => date.getDate() - 1);
  }

  private getValuesByRange(transactions: ITransaction[], size: number, getIndex: (date: Date) => number) {
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
}

export const dashboardService = new DashboardService();
