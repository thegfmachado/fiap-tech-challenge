import Link from "next/link";
import { cva } from "class-variance-authority";
import type { ITransaction } from "app/shared/models/transaction.interface";
import { Button } from "@fiap-tech-challenge/design-system/components";
import { formatCurrency, formatDate } from "app/client/formatters";
import { TransactionType } from "app/shared/enums/transaction-type.enum";

export type TransactionsListProps = {
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

export function TransactionsList(props: TransactionsListProps) {
  const { showAllTransactionsButton, transactions, renderActions } = props;

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
      <div className="overflow-y-auto max-h-[480px]">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div
              className="flex items-center justify-between border-t py-4 px-7"
              key={transaction.id}
            >
              <div>
                <p>{transaction.description}</p>
                <p className="text-muted-foreground">{formatDate(new Date(transaction.date), "short")}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className={moneyVariants({ type: transaction.type })}>
                  {formatCurrency(transaction.value, { signDisplay: "always" })}
                </p>
                {renderActions && (
                  <div className="flex items-center gap-2">
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
