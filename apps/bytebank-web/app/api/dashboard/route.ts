import { NextResponse } from 'next/server';

import { createTransactionService } from "@bytebank/lib/services/transaction-service.factory";
import { handleResponseError } from "@fiap-tech-challenge/services/http";
import { TransactionType } from "@fiap-tech-challenge/models";
import type { IDashboardData, IIncomeByRange, IAmountAndExpensesByRange, IFinancialMovement } from "@fiap-tech-challenge/models";
import type { ITransaction, ITransactionType } from "@fiap-tech-challenge/database/types";

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getValuesByRange(transactions: ITransaction[], size: number, getIndex: (date: Date) => number): {
  incomeByPeriod: number[];
  amountByPeriod: number[];
  expensesByPeriod: number[];
} {
  const incomeByPeriod = Array(size).fill(0);
  const amountByPeriod = Array(size).fill(0);
  const expensesByPeriod = Array(size).fill(0);

  for (const t of transactions) {
    const date = new Date(t.date);
    const index = getIndex(date);

    if (index < 0 || index >= size) continue;

    if (t.type === TransactionType.CREDIT) {
      incomeByPeriod[index] += t.value;
      amountByPeriod[index] += t.value;
    } else if (t.type === TransactionType.DEBIT) {
      incomeByPeriod[index] -= t.value;
      expensesByPeriod[index] += t.value;
    }
  }

  return { incomeByPeriod, amountByPeriod, expensesByPeriod };
}

function getValuesByDay(transactions: ITransaction[]): {
  incomeByPeriod: number[];
  amountByPeriod: number[];
  expensesByPeriod: number[];
} {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const filtered = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  return getValuesByRange(
    filtered,
    daysInMonth,
    (date) => date.getDate() - 1
  );
}

function getIncomeByRange(transactions: ITransaction[], period: string): IIncomeByRange[] {
  switch (period) {
    case 'week': {
      const { incomeByPeriod } = getValuesByRange(transactions, 7, (date) => date.getDay());

      return WEEK_DAYS.map((day, i) => ({
        period: day,
        income: incomeByPeriod[i] ?? 0,
      }));
    }

    case 'month': {
      const { incomeByPeriod } = getValuesByDay(transactions);

      return incomeByPeriod.map((income, i) => ({
        period: String(i + 1).padStart(2, '0'),
        income: income ?? 0,
      }));
    }

    case 'year':
    default: {
      const currentYear = new Date().getFullYear();
      const filtered = transactions.filter((t) => new Date(t.date).getFullYear() === currentYear);

      const { incomeByPeriod } = getValuesByRange(filtered, 12, (date) => date.getMonth());

      return MONTHS.map((month, i) => ({
        period: month,
        income: incomeByPeriod[i] ?? 0,
      }));
    }
  }
}

function getAmountAndExpensesByRange(transactions: ITransaction[], period: string): IAmountAndExpensesByRange[] {
  switch (period) {
    case 'week': {
      const { amountByPeriod, expensesByPeriod } = getValuesByRange(transactions, 7, (date) => date.getDay());

      return WEEK_DAYS.map((day, i) => ({
        period: day,
        amount: amountByPeriod[i] ?? 0,
        expenses: expensesByPeriod[i] ?? 0,
      }));
    }

    case 'month': {
      const { amountByPeriod, expensesByPeriod } = getValuesByDay(transactions);

      return amountByPeriod.map((amount, i) => ({
        period: String(i + 1).padStart(2, '0'),
        amount: amount ?? 0,
        expenses: expensesByPeriod[i] ?? 0,
      }));
    }

    case 'year':
    default: {
      const currentYear = new Date().getFullYear();
      const filtered = transactions.filter((t) => new Date(t.date).getFullYear() === currentYear);

      const { amountByPeriod, expensesByPeriod } = getValuesByRange(filtered, 12, (date) => date.getMonth());

      return MONTHS.map((month, i) => ({
        period: month,
        amount: amountByPeriod[i] ?? 0,
        expenses: expensesByPeriod[i] ?? 0,
      }));
    }
  }
}

function isInCurrentPeriod(transactionDate: string, period: string) {
  const date = new Date(transactionDate);
  const now = new Date();

  switch (period) {
    case 'year':
      return date.getFullYear() === now.getFullYear();
    case 'month':
      return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
    case 'week': {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      return date >= start && date < end;
    }
    default:
      return false;
  }
}

function isInPreviousPeriod(transactionDate: string, period: string): boolean {
  const date = new Date(transactionDate);
  const now = new Date();

  switch (period) {
    case 'year': {
      const previousYear = now.getFullYear() - 1;
      return date.getFullYear() === previousYear;
    }

    case 'month': {
      const prevMonth = now.getMonth() - 1;
      const prevYear = prevMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const adjustedMonth = (prevMonth + 12) % 12;

      return date.getFullYear() === prevYear && date.getMonth() === adjustedMonth;
    }

    case 'week': {
      const startOfThisWeek = new Date(now);
      startOfThisWeek.setDate(now.getDate() - now.getDay());
      startOfThisWeek.setHours(0, 0, 0, 0);

      const startOfLastWeek = new Date(startOfThisWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

      const endOfLastWeek = new Date(startOfThisWeek);

      return date >= startOfLastWeek && date < endOfLastWeek;
    }

    default:
      return false;
  }
}

function getTotalByType(transactions: ITransaction[], type: ITransactionType): number {
  return transactions.reduce(
    (sum, transaction) => transaction.type === type ? sum + transaction.value : sum,
    0
  );
}

function calculateFinancialMovement(current: number, previous: number): IFinancialMovement {
  let percentage: number;

  if (previous === 0) {
    percentage = current === 0 ? 0 : 100;
  } else {
    percentage = ((current - previous) / previous) * 100;
  }

  const rounded = Number(percentage.toFixed(2));
  const formatted = `${rounded >= 0 ? '+' : ''}${rounded}%`;

  return {
    total: current,
    increasePercentage: formatted,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'year';
    const service = await createTransactionService();

    const allTransactions = await service.getAll(Object.fromEntries(searchParams));

    const currentTransactions = allTransactions.filter((t) => isInCurrentPeriod(t.date, period));
    const previousTransactions = allTransactions.filter((t) => isInPreviousPeriod(t.date, period));

    const currentIncome = getTotalByType(currentTransactions, TransactionType.CREDIT);
    const currentExpenses = getTotalByType(currentTransactions, TransactionType.DEBIT);
    const currentAmount = currentIncome - currentExpenses;

    const previousIncome = getTotalByType(previousTransactions, TransactionType.CREDIT);
    const previousExpenses = getTotalByType(previousTransactions, TransactionType.DEBIT);
    const previousAmount = previousIncome - previousExpenses;

    const amount = calculateFinancialMovement(currentAmount, previousAmount);
    const income = calculateFinancialMovement(currentIncome, previousIncome);
    const expenses = calculateFinancialMovement(currentExpenses, previousExpenses);

    const incomeByRange = getIncomeByRange(currentTransactions, period);
    const amountAndExpensesByRange = getAmountAndExpensesByRange(currentTransactions, period);

    const dashboard: IDashboardData = {
      amount,
      expenses,
      income,
      incomeByRange,
      amountAndExpensesByRange
    };

    return NextResponse.json(dashboard);
  } catch (err) {
    return handleResponseError(err);
  }
}

