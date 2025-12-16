import { cva } from "class-variance-authority";
import Link from "next/link";
import { useMemo } from "react";

import type { ITransaction } from "@fiap-tech-challenge/database/types";
import { Button } from "@fiap-tech-challenge/design-system/components";
import { TransactionType } from "@fiap-tech-challenge/models";
import { formatCurrency, formatDate } from "@fiap-tech-challenge/utils";

export type TransactionsListProps = {
  title: string;
  transactions: ITransaction[];
  showAllTransactionsButton?: boolean;
  renderActions?: (transaction: ITransaction) => React.ReactNode;
};

const moneyVariants = cva("", {
  variants: {
    type: {
      credit: "text-green-500",
      debit: "text-red-500",
    },
  },
  defaultVariants: {
    type: TransactionType.CREDIT,
  },
});

function sortTransactionsByDate(transactions: ITransaction[]): ITransaction[] {
  return [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function TransactionsList(props: TransactionsListProps) {
  const { showAllTransactionsButton, title, transactions, renderActions } = props;

  const sortedTransactions = useMemo(() => {
    return sortTransactionsByDate(transactions);
  }, [transactions]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between border-t py-4 px-7">
        <p className="font-medium">{title}</p>
        {showAllTransactionsButton && (
          <Button variant="link" asChild>
            <Link href="/transaction">Ver todas →</Link>
          </Button>
        )}
      </div>
      <div>
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map((transaction) => (
            <div
              className="flex items-center justify-between border-t py-4 px-7"
              key={transaction.id}
            >
              <div className="grow">
                <p className="text-sm sm:text-base">{transaction.description}</p>
                <p className="text-sm sm:text-base text-muted-foreground">{formatDate(new Date(transaction.date))}</p>
              </div>
              <div className="flex justify-between items-center gap-1.5">
                <p className={`whitespace-nowrap text-sm sm:text-base ${moneyVariants({ type: transaction.type as "credit" | "debit" })}`}>
                  {`${transaction.type === TransactionType.CREDIT ? "+" : "-"}${formatCurrency(transaction.value, { signDisplay: "never" })}`}
                </p>
                {renderActions && (
                  <div className="flex items-center">
                    {renderActions(transaction)}
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-4 px-7">
            <p className="text-secondary-foreground">
              Nenhuma transação encontrada
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
