"use client";

import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import { TransactionsList } from "components/transactions-list";
import type { ITransaction } from "../shared/models/transaction.interface";
import { formatCurrency } from "../client/formatters";

import { HTTPService } from "app/client/services/http-service";
import { TransactionService } from "app/client/services/transaction-service";

import { Header } from "components/header";
import { TransactionAction } from "components/transaction-action";

const balance = 15460.75;

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

export default function Home() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await transactionService.getAll();

      setTransactions(data);
    }

    void fetchTransactions();
  }, []);

  const handleToggleBalance = () => {
    setShowBalance(prevShowBalance => !prevShowBalance);
  }

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <Header />
      <main className="flex flex-col items-center">
        <div
          className="flex flex-col items-center w-full p-10 gap-4 bg-radial-[350%_70%_at_50%_100%] from-primary/15 to-white from-0% to-20% grow">
          <h1 className="text-6xl font-bold">Olá, Ana Silva</h1>
          <div>
            <p className="text-primary font-medium">Saldo</p>
            <p className="text-5xl font-bold flex items-center gap-4">
              <span className="text-primary-light">
                {showBalance ? formatCurrency(balance) : `R$ *********`}
              </span>
              <span className="cursor-pointer">
                {
                  showBalance
                    ? <EyeIcon onClick={handleToggleBalance} size={46} />
                    : <EyeOffIcon onClick={handleToggleBalance} size={46} />
                }
              </span>
            </p>
          </div>
        </div>

        <TransactionsList
          transactions={transactions}
          showAllTransactionsButton
          renderActions={(transaction) => (
            <TransactionAction
              type="details"
              onClick={() => {
                console.log("Details clicked:", transaction.id);
              }}
            />
          )}
        />

      </main>
    </div>
  )
}
