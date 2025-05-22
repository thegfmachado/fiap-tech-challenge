"use client";

import { useEffect, useMemo, useState } from "react";
import { CreateNewTransaction } from "@bytebank/components/create-new-transaction";

import { TransactionsList } from "components/transactions-list";
import type { ITransaction } from "@bytebank/shared/models/transaction.interface";

import { HTTPService } from "@bytebank/client/services/http-service";
import { TransactionService } from "@bytebank/client/services/transaction-service";

import { TransactionAction } from "@bytebank/components/transaction-action";
import { Header } from "@bytebank/components/template/header";
import { VisibilityToggler } from "@bytebank/components/visibility-toggler";

import { formatCurrency } from "@bytebank/client/formatters";
import { EditTransaction } from "@bytebank/components/edit-transaction";
import { Sidebar } from "@bytebank/components/template/sidebar";
import { Layout } from "@bytebank/components/template/layout";
import { Main } from "@bytebank/components/template/main";

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

export default function Home() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [showBalance, setShowBalance] = useState(false);
  const [editFormTransaction, setEditFormTransaction] = useState<ITransaction | null>(null);

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
      const data = await transactionService.getAll({ _limit: 5, _sort: '-date' });

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
    <Layout>
      <Header />
      <Sidebar />
      <Main>
        <div
          className="flex flex-col items-center w-full p-10 gap-4 bg-radial-[350%_70%_at_50%_100%] from-primary/15 to-white from-0% to-20%">
          <h1 className="text-5xl sm:text-6xl font-bold">Olá, Ana Silva</h1>
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

        <TransactionsList
          transactions={transactions}
          showAllTransactionsButton
          renderActions={(transaction) => (
            <TransactionAction
              type="details"
              onClick={() => setEditFormTransaction(transaction)}
            />
          )}
        />

        {editFormTransaction && (
          <EditTransaction
            readOnly
            onClose={() => setEditFormTransaction(null)}
            transaction={editFormTransaction}
          />
        )}
      </Main>
    </Layout>
  )
}
