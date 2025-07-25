"use client";

import { useCallback, useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import { FunnelPlus } from "lucide-react";

import { Button, Input, Label } from "@fiap-tech-challenge/design-system/components";
import { HTTPService } from "@fiap-tech-challenge/services";

import { TransactionService } from "@bytebank/client/services/transaction-service";
import type { ITransaction } from "@fiap-tech-challenge/database/types";

import { EditTransaction } from "@bytebank/components/edit-transaction";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "components/ui/select";
import { DatePicker } from "components/date-picker";
import { TransactionsList } from "components/transactions-list";
import { CreateNewTransaction } from "components/create-new-transaction";
import { Header } from "@bytebank/components/template/header";
import { TransactionAction } from "components/transaction-action";
import { DeleteTransaction } from "@bytebank/components/delete-transaction";
import { Sidebar } from "@bytebank/components/template/sidebar";
import { Main } from "@bytebank/components/template/main";
import { Layout } from "@bytebank/components/template/layout";
import { TransactionSkeleton } from "@bytebank/components/transaction-skeleton";

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

export default function Transaction() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [editFormTransaction, setEditFormTransaction] = useState<ITransaction | null>(null);
  const [deleteFormTransaction, setDeleteFormTransaction] = useState<ITransaction | null>(null);
  const [loadingTransaction, setLoadingTransaction] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await transactionService.getAll({ _sort: '-date' });

      setTransactions(data);
      setFilteredTransactions(data);
      setLoadingTransaction(false);
    };

    void fetchTransactions();
  }, []);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  const handleSyncTransactions = (
    transaction: ITransaction,
    action: "create" | "edit" | "delete",
  ) => {
    setTransactions(prevTransactions => {
      if (action === "create") {
        return [...prevTransactions, transaction];
      }

      const index = prevTransactions.findIndex(t => t.id === transaction.id);

      if (index === -1) {
        return prevTransactions;
      }

      if (action === "edit") {
        const updated = [...prevTransactions];
        updated[index] = transaction;
        return updated;
      }

      if (action === "delete") {
        return prevTransactions.filter(t => t.id !== transaction.id);
      }

      return prevTransactions;
    });

    setEditFormTransaction(null);
  };

  const filterTransaction = useCallback(
    (transaction: ITransaction) => {
      if (searchTerm.trim()) {
        const lowerSearch = searchTerm.toLowerCase();
        if (
          !transaction.description.toLowerCase().includes(lowerSearch) &&
          !transaction.value.toString().includes(lowerSearch)
        ) {
          return false;
        }
      }

      if (typeFilter && transaction.type !== typeFilter) {
        return false;
      }

      if (dateRange && (dateRange.from || dateRange.to)) {
        const txDate = new Date(transaction.date);
        const from = new Date(dateRange.from ?? new Date());
        from.setHours(0, 0, 0, 0);

        const to = dateRange.to
          ? new Date(dateRange.to)
          : new Date(dateRange.from ?? new Date());
        to.setHours(23, 59, 59, 999);

        if (txDate < from || txDate > to) {
          return false;
        }
      }

      return true;
    },
    [searchTerm, typeFilter, dateRange],
  );

  const applyFilters = () => {
    setFilteredTransactions(transactions.filter(filterTransaction));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setDateRange(undefined);

    setFilteredTransactions(transactions);
  }

  return (
    <Layout>
      <Header />
      <Sidebar />

      <Main>
        <div
          className="flex flex-col items-center w-full p-8 gap-4 bg-radial-[350%_70%_at_50%_100%] from-primary/15 to-white from-0% to-20%">
          <div className="w-full flex flex-col gap-4">

            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Transações</h1>
              <Button
                asChild
                size="icon"
                variant="ghost"
                onClick={() => setFiltersVisible((prev) => !prev)}
                aria-label="Alternar filtros"
                className={`p-2 md:p-1 ${filtersVisible ? "text-primary" : "text-muted-foreground"}`}
              >
                <FunnelPlus />
              </Button>
            </div>


            {filtersVisible && (
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">
                  <div className="relative">
                    <Label className="z-1 absolute text-[0.75rem] -top-[25%] left-2 bg-white px-1 text-muted-foreground">
                      Buscar transações
                    </Label>
                    <Input
                      className="w-full"
                      placeholder="Digite o valor ou nome da transação"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <Label className="z-1 absolute text-[0.75rem] -top-[25%] left-2 bg-white px-1 text-muted-foreground">
                      Tipo de transação
                    </Label>
                    <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo da transação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Depósito</SelectItem>
                        <SelectItem value="debit">Transferência</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <DatePicker
                    fitParent
                    className="w-full"
                    onChange={(range) => setDateRange(range)}
                    mode="range"
                    value={dateRange}
                  />
                </div>

                <div className="flex flex-col gap-2 lg:flex-row lg:gap-4">
                  <Button onClick={applyFilters}>Buscar</Button>
                  <Button variant="outline" onClick={clearFilters}>
                    Limpar filtros
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {loadingTransaction ? (
          <TransactionSkeleton />
        ) : (
          <TransactionsList
            transactions={filteredTransactions}
            renderActions={(transaction) => (
              <>
                <TransactionAction type="edit" onClick={() => setEditFormTransaction(transaction)} />
                <TransactionAction type="delete" onClick={() => setDeleteFormTransaction(transaction)} />
              </>
            )}
          />
        )}

        <div className="p-4 w-full flex items-center justify-end sticky bottom-0 bg-white border-t z-10">
          <CreateNewTransaction onSuccess={(transaction) => handleSyncTransactions(transaction, "create")} />
        </div>

        {editFormTransaction && (
          <EditTransaction
            onClose={() => setEditFormTransaction(null)}
            onSuccess={(transaction) => handleSyncTransactions(transaction, "edit")}
            transaction={editFormTransaction}
          />
        )}

        {deleteFormTransaction && (
          <DeleteTransaction
            transaction={deleteFormTransaction}
            onClose={() => setDeleteFormTransaction(null)}
            onSuccess={(transaction) => handleSyncTransactions(transaction, "delete")}
          />
        )}
      </Main>
    </Layout>
  );
}
