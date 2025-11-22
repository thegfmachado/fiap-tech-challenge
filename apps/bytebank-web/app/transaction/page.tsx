"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FunnelPlus, Loader2 } from "lucide-react";

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  DatePicker,
} from "@fiap-tech-challenge/design-system/components";
import type { DateRange } from "@fiap-tech-challenge/design-system/components";
import { HTTPService } from "@fiap-tech-challenge/services";

import { TransactionService } from "@bytebank/client/services/transaction-service";
import type { ITransaction } from "@fiap-tech-challenge/database/types";

import { EditTransaction } from "@bytebank/components/edit-transaction";
import { TransactionsList } from "components/transactions-list";
import { CreateNewTransaction } from "components/create-new-transaction";
import { Header } from "@bytebank/components/template/header";
import { TransactionAction } from "components/transaction-action";
import { DeleteTransaction } from "@bytebank/components/delete-transaction";
import { Sidebar } from "@bytebank/components/template/sidebar";
import { Main } from "@bytebank/components/template/main";
import { Layout } from "@bytebank/components/template/layout";
import { TransactionSkeleton } from "@bytebank/components/transaction-skeleton";

function useDebouncedCallback<T extends (...args: unknown[]) => void>(callback: T, delay: number) {
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  return (...args: Parameters<T>) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => callback(...args), delay);
  };
}

type PaginationState = {
  page: number;
  limit: number;
  count: number | null;
};

type FiltersState = {
  searchTerm: string;
  typeFilter: string;
  dateRange?: DateRange;
};

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

const initialPaginationState: PaginationState = {
  page: 1,
  limit: 10,
  count: null,
};

const initialFilters: FiltersState = {
  searchTerm: "",
  typeFilter: "",
  dateRange: undefined,
};

export default function Transaction() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);

  const [filtersVisible, setFiltersVisible] = useState(true);
  const [editFormTransaction, setEditFormTransaction] = useState<ITransaction | null>(null);
  const [deleteFormTransaction, setDeleteFormTransaction] = useState<ITransaction | null>(null);
  const [loadingAllTransactions, setLoadingAllTransactions] = useState(true);
  const [loadingMoreTransactions, setLoadingMoreTransactions] = useState(false);

  const [filters, setFilters] = useState<FiltersState>(initialFilters);
  const [pagination, setPagination] = useState<PaginationState>(initialPaginationState);

  const getQueryParams = useCallback(
    (from: number, to: number) => {
      const { searchTerm, typeFilter, dateRange } = filters;

      const queryParams: Record<string, unknown> = {
        from,
        to,
      };

      if (searchTerm.trim()) queryParams.term = searchTerm.trim().toLowerCase();
      if (typeFilter) queryParams.type = typeFilter;
      if (dateRange?.from) queryParams.startDate = dateRange.from.toISOString();
      if (dateRange?.to) queryParams.endDate = dateRange.to.toISOString();

      return queryParams;
    },
    [filters]
  );

  const fetchAllTransactions = useCallback(async () => {
    const queryParams = getQueryParams(0, pagination.limit - 1);
    const { count, data } = await transactionService.getAll(queryParams);

    setTransactions(data);
    setLoadingAllTransactions(false);

    if (count !== null) {
      setHasMoreTransactions(data.length < count);
      setPagination(prev => ({
        ...prev,
        count,
        page: prev.page + 1,
      }));
    }
  }, [getQueryParams, pagination.limit]);


  const fetchMoreTransactions = useCallback(async () => {
    if (!hasMoreTransactions) return;

    const from = (pagination.page - 1) * pagination.limit;
    const to = from + pagination.limit - 1;

    const queryParams = getQueryParams(from, to);
    const { count, data } = await transactionService.getAll(queryParams);

    const newTransactions = [...transactions, ...data];
    setTransactions(newTransactions);
    setHasMoreTransactions(count !== null && newTransactions.length < count);

    setPagination(prev => ({
      ...prev,
      count,
      page: prev.page + 1,
    }));

    setLoadingAllTransactions(false);
  }, [getQueryParams, hasMoreTransactions, pagination.limit, pagination.page, transactions]);

  const debouncedFetchMoreTransactions = useDebouncedCallback(() => {
    if (hasMoreTransactions && !loadingMoreTransactions) {
      setLoadingMoreTransactions(true);
      void fetchMoreTransactions().finally(() => setLoadingMoreTransactions(false));
    }
  }, 200);

  useEffect(() => {
    if (!transactions.length && !filters.searchTerm && !filters.typeFilter && !filters.dateRange) {
      setLoadingAllTransactions(true);
      void fetchAllTransactions();
    }
  }, [fetchAllTransactions, transactions, filters]);

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

  const applyFilters = () => {
    setTransactions([]);
    setHasMoreTransactions(true);
    setPagination(initialPaginationState);
    setLoadingAllTransactions(true);
    void fetchAllTransactions();
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setPagination(initialPaginationState);
    setTransactions([]);
    setHasMoreTransactions(true);
  };

  return (
    <Layout>
      <Header />
      <Sidebar />

      <Main onBottomReached={debouncedFetchMoreTransactions}>
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
                      value={filters.searchTerm}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    />
                  </div>

                  <div className="relative">
                    <Label className="z-1 absolute text-[0.75rem] -top-[25%] left-2 bg-white px-1 text-muted-foreground">
                      Tipo de transação
                    </Label>
                    <Select value={filters.typeFilter} onValueChange={(value) => setFilters(prev => ({ ...prev, typeFilter: value }))}>
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
                    onChange={(range) => setFilters(prev => ({ ...prev, dateRange: range }))}
                    mode="range"
                    value={filters.dateRange}
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

        {loadingAllTransactions ? (
          <TransactionSkeleton />
        ) : (
          <>
            <TransactionsList
              title="Extrato completo"
              transactions={transactions}
              renderActions={(transaction) => (
                <>
                  <TransactionAction type="edit" onClick={() => setEditFormTransaction(transaction)} />
                  <TransactionAction type="delete" onClick={() => setDeleteFormTransaction(transaction)} />
                </>
              )}
            />
            {loadingMoreTransactions && (
              <div className="flex items-center justify-center w-full p-4 h-20 gap-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Carregando mais...</p>
              </div>
            )}
          </>
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
