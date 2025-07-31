"use client";

import { useEffect, useMemo, useState } from "react";

import { Skeleton } from "@fiap-tech-challenge/design-system/components";
import { HTTPService } from "@fiap-tech-challenge/services";

import { TransactionService } from "@bytebank/client/services/transaction-service";

import { Header } from "@bytebank/components/template/header";
import { Sidebar } from "@bytebank/components/template/sidebar";
import { Layout } from "@bytebank/components/template/layout";
import { Main } from "@bytebank/components/template/main";

import { TransactionsList } from "@bytebank/components/transactions-list";
import { TransactionAction } from "@bytebank/components/transaction-action";
import { VisibilityToggler } from "@bytebank/components/visibility-toggler";
import { CreateNewTransaction } from "@bytebank/components/create-new-transaction";
import { EditTransaction } from "@bytebank/components/edit-transaction";

import { formatCurrency } from "@bytebank/client/formatters";
import type { ITransaction } from "@fiap-tech-challenge/database/types";
import { useCurrentUser } from "@bytebank/hooks/use-current-user";
import { TransactionSkeleton } from "@bytebank/components/transaction-skeleton";

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

export default function Home() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [showBalance, setShowBalance] = useState(false);
  const [editFormTransaction, setEditFormTransaction] = useState<ITransaction | null>(null);
  const { user, loading: userLoading } = useCurrentUser();
  const [loadingTransaction, setLoadingTransaction] = useState(true);

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
      const { data } = await transactionService.getAll();

      setTransactions(data);
      setLoadingTransaction(false);
    }

    void fetchTransactions();
  }, []);

  const handleNewTransaction = (transaction: ITransaction) => {
    setTransactions(prevTransactions => [transaction, ...prevTransactions]);
  }

  const handleUpdateTransaction = (updatedTransaction: ITransaction) => {
    setTransactions(prevTransactions => 
      prevTransactions.map(transaction => 
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
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
          <div className="flex items-center justify-center text-center">
            {
              userLoading
                ? <Skeleton className="h-10 w-80" />
                : <h1 className="text-5xl sm:text-6xl font-bold">Olá, {user?.user_metadata?.name}</h1>
            }
          </div>
          <div>
            <p className="text-primary font-medium">Saldo</p>
            <p className="flex items-center gap-4 text-primary">
              <span className="text-4xl sm:text-5xl font-bold text-primary-light break-words sm:break-normal max-w-full truncate">
                {showBalance ? formatCurrency(balance) : `R$ *********`}
              </span>
              <VisibilityToggler show={
                showBalance
              } onClick={handleToggleBalance} />
            </p>
          </div>

          <CreateNewTransaction onSuccess={handleNewTransaction} />
        </div>

        {loadingTransaction ? (
          <TransactionSkeleton />
        ) : (
          <TransactionsList
            title="Extrato recente"
            transactions={transactions.slice(0, 5)}
            showAllTransactionsButton
            renderActions={(transaction) => (
              <TransactionAction
                type="details"
                onClick={() => setEditFormTransaction(transaction)}
              />
            )}
          />
        )}

        {editFormTransaction && (
          <EditTransaction
            readOnly
            onClose={() => setEditFormTransaction(null)}
            onSuccess={handleUpdateTransaction}
            transaction={editFormTransaction}
          />
        )}
      </Main>
    </Layout>
  )
}
