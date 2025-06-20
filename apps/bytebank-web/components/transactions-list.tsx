import Link from "next/link";
import { cva } from "class-variance-authority";
import type { ITransaction } from "@bytebank/shared/models/transaction.interface";
import { Button } from "@fiap-tech-challenge/design-system/components";
import { formatCurrency, formatDate } from "@bytebank/client/formatters";
import { TransactionType } from "@bytebank/shared/enums/transaction-type.enum";
import { useMemo } from "react";

export type TransactionsListProps = {
  transactions: ITransaction[];
  showAllTransactionsButton?: boolean;
  renderActions?: (transaction: ITransaction) => React.ReactNode;
};

const moneyVariants = cva("", {
  variants: {
    type: {
      Credit: "text-green-500",
      Debit: "text-red-500",
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
  const { showAllTransactionsButton, transactions, renderActions } = props;

  const sortedTransactions = useMemo(() => {
    return sortTransactionsByDate(transactions);
  }, [transactions]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between border-t py-4 px-7">
        <p className="font-medium">Extrato recente</p>
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
                <p className="text-sm sm:text-base">{transaction.from}</p>
                <p className="text-sm sm:text-base text-muted-foreground">{formatDate(new Date(transaction.date))}</p>
              </div>
              <div className="flex justify-between items-center gap-1.5">
                <p className={`whitespace-nowrap text-sm sm:text-base ${moneyVariants({ type: transaction.type })}`}>
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
