"use client";

import { useEffect, useState } from "react";
import { SquarePlus } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { TransactionsList } from "components/transactions-list";
import { DatePicker } from "components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "components/ui/select";

import {
  Button,
  Input,
} from "@fiap-tech-challenge/design-system/components";

import type { ITransaction } from "../shared/models/transaction.interface";

import { TransactionService } from "app/client/services/transaction-service";
import { HTTPService } from "app/client/services/http-service";
import { Header } from "components/header";
import { TransactionAction } from "components/transaction-action";

const INITIAL_DATE_RANGE_VALUE = {
  from: new Date(),
}

const httpService = new HTTPService();
const transactionService = new TransactionService(httpService);

const postTransaction = () => {
  transactionService.create({
    id: String(Date.now()),
    description: "Novo depósito",
    value: 450,
    type: "debit",
    date: new Date().toISOString(),
  });
}

export default function Transaction() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange>(INITIAL_DATE_RANGE_VALUE);

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await transactionService.getAll();

      setTransactions(data);
      setFilteredTransactions(data);
    };

    void fetchTransactions();
  }, []);

  const applyFilters = () => {
    let filtered = [...transactions];

    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((tx) =>
        tx.description.toLowerCase().includes(lowerSearch) ||
        tx.value.toString().includes(lowerSearch)
      );
    }

    if (typeFilter) {
      filtered = filtered.filter((tx) => tx.type === typeFilter);
    }

    if (dateRange.from || dateRange.to) {
      filtered = filtered.filter((tx) => {
        if (!dateRange.from) return true;

        const txDate = new Date(tx.date);

        const from = new Date(dateRange.from);
        from.setHours(0, 0, 0, 0);

        const to = dateRange.to
          ? new Date(dateRange.to)
          : new Date(dateRange.from);
        to.setHours(23, 59, 59, 999);

        return txDate >= from && txDate <= to;
      });
    }

    setFilteredTransactions(filtered);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setDateRange(INITIAL_DATE_RANGE_VALUE);

    setFilteredTransactions(transactions);
  }

  return (
    <div className="grid grid-rows-[auto_1fr] min-h-screen">
      <Header />
      <main className="flex flex-col items-center">
        <div className="flex flex-col items-center w-full p-8 gap-4 bg-radial-[350%_70%_at_50%_100%] from-primary/15 to-white from-0% to-20% grow">
          <div className="w-full flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Transações</h1>

            <div className="flex gap-4 items-center justify-between">
              <div className="grid grid-cols-3 gap-4">
                <Input
                  className="w-full"
                  placeholder="Digite o valor ou nome da transação"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Select
                  value={typeFilter}
                  onValueChange={(value) => setTypeFilter(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tipo de transação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Depósito</SelectItem>
                    <SelectItem value="debit">Transferência</SelectItem>
                  </SelectContent>
                </Select>

              <DatePicker
                className="w-full"
                onChange={(range) => setDateRange(range ?? INITIAL_DATE_RANGE_VALUE)}
                mode="range"
                value={dateRange}
              />
            </div>

              <div className="flex gap-4">
                <Button onClick={applyFilters}>Buscar</Button>
                <Button variant="outline" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              </div>
            </div>
          </div>
        </div>

        <TransactionsList
          transactions={filteredTransactions}
          renderActions={(transaction) => (
            <>
              <TransactionAction type="edit" onClick={() => console.log(transaction.id)} />
              <TransactionAction type="delete" onClick={() => transactionService.delete(transaction.id)} />
            </>
          )}
        />

        <div className="p-8 w-full flex items-center justify-end mt-4">
          <Button size="lg" onClick={postTransaction}>
            <SquarePlus />

            Nova transação
          </Button>
        </div>
      </main>
    </div>
  );
}
