"use client";

import { CreateNewTransaction } from "@bytebank/components/create-new-transaction";
import { useEffect, useMemo, useState } from "react";

import { TransactionsList } from "components/transactions-list";
import type { ITransaction } from "../shared/models/transaction.interface";

import { HTTPService } from "app/client/services/http-service";
import { TransactionService } from "app/client/services/transaction-service";
import Header from "components/ui/header";
import { VisibilityToggler } from "../../components/visibility-toggler";
import { formatCurrency } from "../client/formatters";

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

export default function Home() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [showBalance, setShowBalance] = useState(false);

  const balance = useMemo(() => {
    return transactions.reduce((acc, curr) => {
      if (curr.type === 'credit') {
        return acc + curr.value;
      }

      return acc - curr.value;
    }, 0);
  }, [transactions]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await transactionService.getAll();

      setTransactions(data);
    }

    void fetchTransactions();
  }, []);

  const handleNewTransaction = (transaction: ITransaction) => {
    setTransactions(prevTransactions => [...prevTransactions, transaction]);
  }

  const handleToggleBalance = () => {
    setShowBalance(prevShowBalance => !prevShowBalance);
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center">
        <div
          className="flex flex-col items-center w-full p-8 gap-4 bg-radial-[350%_70%_at_50%_100%] from-primary/15 to-white from-0% to-20%">
          <h1 className="text-6xl font-bold">Olá, Ana Silva</h1>
          <div>
            <p className="text-primary font-medium">Saldo</p>
            <p className="flex items-center gap-4 text-primary">
              <span className="text-5xl font-boldtext-primary-light">
                {showBalance ? formatCurrency(balance) : `R$ *********`}
              </span>
              <VisibilityToggler show={
                showBalance
              } onClick={handleToggleBalance} />
            </p>
          </div>

          <CreateNewTransaction onSuccess={handleNewTransaction} />
        </div>

        <TransactionsList transactions={transactions} showAllTransactionsButton />
      </div>
    </div>
  )
}
