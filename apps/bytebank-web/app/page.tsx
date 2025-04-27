"use client";
import { Button } from "@fiap-tech-challenge/design-system/components";
import { useEffect, useState } from "react";

export default function Page() {

  const [transactions, setTransactions] = useState([]);

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
      tipo: "despesa",
      valor: 100,
      descricao: "Nova transação",
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
        console.log("nova lista de transactions:", updatedTransactions);
        return updatedTransactions;
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleGetTransactionById(id) {
    try {
      const response = await fetch(`/api/transactions/${id}`);

      const data = await response.json();
      setTransactionById(data); 
      console.log("Transação buscada por ID:", data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">This is using design system button</h1>
        <Button variant="secondary" onClick={handleAddTransaction}>Button</Button>
        <Button variant="secondary" onClick={() => {
    console.log("ID enviado:", transactions[0]?.id);
    handleGetTransactionById(transactions[0]?.id);
  }}>Get transaction</Button>
      </div>
    </div>
  )
}
