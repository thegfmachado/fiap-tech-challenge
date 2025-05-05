"use client";
import { Button } from "@fiap-tech-challenge/design-system/components";
import { useEffect, useState } from "react";
import { Transaction } from "./shared/models/transaction.interface";
import { TransactionType } from "./shared/enums/transaction-type.enum";

export default function Page() {

  const [transactions, setTransactions] = useState([] as Transaction[]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch("/api/transactions");

        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTransactions();
  }, []);

  async function handleAddTransaction() {
    const newTransaction = {
      "type": TransactionType.DEPOSIT,
      "value": 500,
      "date": "2025-04-25T10:30:00Z",
      "description": "Depósito PPR"
    };

    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTransaction),
      });

      const createdTransaction = await response.json();
      setTransactions((prev) => {
        const updatedTransactions = [...prev, createdTransaction];
        return updatedTransactions;
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleGetTransactionById(id: number | undefined) {
    try {
      const response = await fetch(`/api/transactions/${id}`);

      const data = await response.json();
      setSelectedTransaction(data); 
      
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">This is using design system button</h1>
        <Button variant="secondary" onClick={handleAddTransaction}>Button</Button>
        <Button variant="secondary" onClick={() => handleGetTransactionById(transactions[0]?.id)}>Get transaction</Button>
      </div>
    </div>
  )
}
