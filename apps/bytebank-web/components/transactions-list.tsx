import { cva } from "class-variance-authority"
import type { Transaction } from "app/shared/models/transaction.interface";
import { Button } from "@fiap-tech-challenge/design-system/components";
import { formatCurrency, formatDate } from "lib/formatters";

export interface TransactionsListProps {
  transactions: Transaction[];
}

const moneyVariants = cva('', {
  variants: {
    type: {
      credit: "text-green-500",
      debit: "text-red-500",
    },
  },
  defaultVariants: {
    type: "credit",
  },
})

export function TransactionsList(props: TransactionsListProps) {
  const { transactions } = props;

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center justify-between border-t py-4 px-7">
        <p className="font-medium">Extrato recente</p>
        <Button variant="link">Ver todas →</Button>
      </div>
      {transactions.map(transaction => (
        <div className="flex items-center justify-between border-t py-4 px-7" key={transaction.id}>
          <div>
            <p>{transaction.description}</p>
            <p className="text-[#241B2896]">{formatDate(new Date(transaction.date), 'short')}</p>
          </div>
          <div>
            <p
              className={moneyVariants({ type: transaction.type })}>{formatCurrency(transaction.value, { signDisplay: "always" })}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
