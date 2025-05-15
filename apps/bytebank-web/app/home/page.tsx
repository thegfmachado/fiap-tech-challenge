"use client";

import { Button } from "@fiap-tech-challenge/design-system/components";
import { useEffect, useState } from "react";
import { TransactionsList } from "components/transactions-list";
import type { Transaction } from "../shared/models/transaction.interface";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { formatCurrency } from "../../lib/formatters";

const balance = 15460.75;

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch("/api/transactions");
      const data = await response.json();

      setTransactions(data);
    }

    void fetchTransactions();
  }, []);

  const handleToggleBalance = () => {
    setShowBalance(prevShowBalance => !prevShowBalance);
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex flex-col items-center w-full p-8 gap-4 bg-radial-[350%_70%_at_50%_100%] from-primary/15 to-white from-0% to-20%">
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
                ? <EyeIcon onClick={handleToggleBalance} size={46}/>
                : <EyeOffIcon onClick={handleToggleBalance} size={46}/>
            }
            </span>
          </p>
        </div>
        <Button>Nova transação</Button>
      </div>

      <TransactionsList transactions={transactions}/>
    </div>
  )
}
