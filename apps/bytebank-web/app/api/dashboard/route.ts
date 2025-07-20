import { NextResponse } from 'next/server';

import { TransactionService } from '@bytebank/lib/services/transaction-service';
import { handleResponseError } from '@fiap-tech-challenge/services/http';
import { queries } from '@bytebank/lib/database/queries';
import { TransactionType } from '@bytebank/shared/enums/transaction-type.enum';
import { ITransaction } from '@bytebank/shared/models/transaction.interface';
import { IAmountAndExpensesByRange, IDashboardData, IIncomeByRange } from '@bytebank/shared/models/dashboard-data.interface';

const service = new TransactionService(queries);

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getValuesByRange(transactions: ITransaction[], size: number, getIndex: (date: Date) => number): {
  incomeByPeriod: any[];
  amountByPeriod: any[];
  expensesByPeriod: any[];
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
  incomeByPeriod: any[];
  amountByPeriod: any[];
  expensesByPeriod: any[];
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
        income: incomeByPeriod[i]
      }));
    }

    case 'month': {
      const { incomeByPeriod } = getValuesByDay(transactions);

      return incomeByPeriod.map((income, i) => ({
        period: String(i + 1).padStart(2, '0'),
        income
      }));
    }

    case 'year':
    default: {
      const currentYear = new Date().getFullYear();
      const filtered = transactions.filter((t) => new Date(t.date).getFullYear() === currentYear);

      const { incomeByPeriod } = getValuesByRange(filtered, 12, (date) => date.getMonth());

      return MONTHS.map((month, i) => ({
        period: month,
        income: incomeByPeriod[i]
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
        amount: amountByPeriod[i],
        expenses: expensesByPeriod[i]
      }));
    }

    case 'month': {
      const { amountByPeriod, expensesByPeriod } = getValuesByDay(transactions);

      return amountByPeriod.map((amount, i) => ({
        period: String(i + 1).padStart(2, '0'),
        amount,
        expenses: expensesByPeriod[i]
      }));
    }

    case 'year':
    default: {
      const currentYear = new Date().getFullYear();
      const filtered = transactions.filter((t) => new Date(t.date).getFullYear() === currentYear);

      const { amountByPeriod, expensesByPeriod } = getValuesByRange(filtered, 12, (date) => date.getMonth());

      return MONTHS.map((month, i) => ({
        period: month,
        amount: amountByPeriod[i],
        expenses: expensesByPeriod[i]
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

function getTotalByType(transactions: ITransaction[], type: TransactionType): number {
  return transactions.reduce(
    (sum, transaction) => transaction.type === type ? sum + transaction.value : sum,
    0
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'year';

    const allTransactions = await service.getAll(Object.fromEntries(searchParams));
    const transactionsFiltered = allTransactions.filter((t) => isInCurrentPeriod(t.date, period));

    const income = getTotalByType(transactionsFiltered, TransactionType.CREDIT);
    const expenses = getTotalByType(transactionsFiltered, TransactionType.DEBIT);
    const amount = income - expenses;

    const incomeByRange = getIncomeByRange(transactionsFiltered, period);
    const amountAndExpensesByRange = getAmountAndExpensesByRange(transactionsFiltered, period);

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
