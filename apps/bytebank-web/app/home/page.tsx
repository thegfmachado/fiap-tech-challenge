"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader, DialogDescription,
} from "@fiap-tech-challenge/design-system/components";
import { useEffect, useMemo, useState } from "react";

import { TransactionsList } from "components/transactions-list";
import type { ITransaction } from "../shared/models/transaction.interface";

import { HTTPService } from "app/client/services/http-service";
import { TransactionService } from "app/client/services/transaction-service";
import Header from "components/ui/header";
import { VisibilityToggler } from "../../components/visibility-toggler";
import { formatCurrency } from "../client/formatters";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/ui/components/dialog";
import { TransactionsForm } from "../../components/transactions-form";

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

export default function Home() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const handleOpenDialog = () => {
    setOpen(true);
  }

  const handleCreateNewTransaction = async (transaction: ITransaction) => {
    setSubmitting(true);
    try {
      await transactionService.create(transaction);

      setTransactions(prevTransactions => [...prevTransactions, transaction]);
      setSubmitting(false);
      setOpen(false);
    } catch (error) {
      console.error("Error creating transaction", error);
    }
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpenDialog}>Nova transação</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar nova transação</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <DialogDescription className="sr-only">
                  Formulário para criar uma nova transação
                </DialogDescription>
                <TransactionsForm disabled={submitting} onSubmit={handleCreateNewTransaction} />
              </DialogBody>
            </DialogContent>
          </Dialog>
        </div>

        <TransactionsList transactions={transactions} showAllTransactionsButton />
      </div>
    </div>
  )
}
