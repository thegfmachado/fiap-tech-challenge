import { NextResponse } from "next/server";

import { TransactionService } from "@bytebank/lib/services/transaction-service";
import { handleResponseError } from "@bytebank/lib/utils/handle-response-error";
import { queries } from "@bytebank/lib/database/queries";
import { TransactionType } from "@bytebank/shared/enums/transaction-type.enum";
import { IAmountAndExpensesByMonth, IDashboardData, IIncomeByMonth } from "@bytebank/shared/models/dashboard-data.interface";
import { ITransaction } from "@bytebank/shared/models/transaction.interface";

const service = new TransactionService(queries);

const MONTHS = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
];

function getIncomeByMonth(transactions: ITransaction[]): IIncomeByMonth[] {
  const incomeByMonth = Array(12).fill(0);
  transactions
    .filter((t) => {
      const date = new Date(t.date);
      return date.getFullYear() === new Date().getFullYear();
    })
    .forEach((t) => {
      const date = new Date(t.date);
      const month = date.getMonth();
      if (t.type === TransactionType.CREDIT) {
        incomeByMonth[month] += t.value;
      } else if (t.type === TransactionType.DEBIT) {
        incomeByMonth[month] -= t.value;
      }
    });

  return MONTHS.map((month, i) => ({
    month,
    income: incomeByMonth[i],
  }));
}

function getAmountAndExpensesByMonth(transactions: ITransaction[]): IAmountAndExpensesByMonth[] {
  const amountByMonth = Array(12).fill(0);
  const expensesByMonth = Array(12).fill(0);

  transactions
    .filter((t) => {
      const date = new Date(t.date);
      return date.getFullYear() === new Date().getFullYear();
    })
    .forEach((t) => {
      const date = new Date(t.date);
      const month = date.getMonth();
      if (t.type === TransactionType.CREDIT) {
        amountByMonth[month] += t.value;
      } else if (t.type === TransactionType.DEBIT) {
        expensesByMonth[month] += t.value;
      }
    });

  return MONTHS.map((month, i) => ({
    month,
    amount: amountByMonth[i],
    expenses: expensesByMonth[i],
  }));
}

function isInCurrentPeriod(transactionDate: string, period: string) {
  const date = new Date(transactionDate);
  const now = new Date();

  switch (period) {
    case "year":
      return date.getFullYear() === now.getFullYear();

    case "month":
      return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth()
      );

    case "week": {
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
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, t) => sum + t.value, 0);
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const period = searchParams.get('period') || "year"

    const allTransactions = await service.getAll(Object.fromEntries(searchParams));

    const transactionsFiltered = allTransactions.filter((t) => isInCurrentPeriod(t.date, period));

    const income = getTotalByType(transactionsFiltered, TransactionType.CREDIT);
    const expenses = getTotalByType(transactionsFiltered, TransactionType.DEBIT);
    const amount = income - expenses;
    const incomeByMonth = getIncomeByMonth(allTransactions);
    const amountAndExpensesByMonth = getAmountAndExpensesByMonth(allTransactions);


    const dashboard: IDashboardData = {
      amount,
      expenses,
      income,
      incomeByMonth,
      amountAndExpensesByMonth
    };

    return NextResponse.json(dashboard);
  } catch (err) {
    return handleResponseError(err);
  }
}