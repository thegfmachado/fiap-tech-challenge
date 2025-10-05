import { useMemo } from 'react';
import { Transaction } from '@/utils/transactionMapper';
import { TransactionType } from '@fiap-tech-challenge/models';

/**
 * Hook para estado computado/derivado das transações
 * Ajuda a prevenir re-computações e re-renderizações desnecessárias
 */
export function useTransactionSelectors(transactions: Transaction[]) {
  // Estatísticas das transações
  const stats = useMemo(() => {
    const totalCredits = transactions
      .filter(t => t.type === TransactionType.CREDIT)
      .reduce((sum, t) => sum + t.value, 0);

    const totalDebits = transactions
      .filter(t => t.type === TransactionType.DEBIT)
      .reduce((sum, t) => sum + t.value, 0);

    const balance = totalCredits - totalDebits;
    
    const creditCount = transactions.filter(t => t.type === TransactionType.CREDIT).length;
    const debitCount = transactions.filter(t => t.type === TransactionType.DEBIT).length;

    return {
      totalCredits,
      totalDebits,
      balance,
      creditCount,
      debitCount,
      totalCount: transactions.length,
    };
  }, [transactions]);

  // Agrupa transações por data
  const transactionsByDate = useMemo(() => {
    const grouped = new Map<string, Transaction[]>();
    
    transactions.forEach(transaction => {
      const dateKey = new Date(transaction.date).toDateString();
      const existing = grouped.get(dateKey) || [];
      existing.push(transaction);
      grouped.set(dateKey, existing);
    });

    return Array.from(grouped.entries())
      .map(([date, txns]) => ({
        date,
        transactions: txns.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        ),
        dailyBalance: txns.reduce((sum, t) => 
          sum + (t.type === TransactionType.CREDIT ? t.value : -t.value), 0
        ),
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  // Transações recentes (últimas 5)
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);

  // Transações com anexos
  const transactionsWithAttachments = useMemo(() => {
    return transactions.filter(t => t.attachment_url && t.attachment_name);
  }, [transactions]);

  // Resumo mensal
  const monthlySummary = useMemo(() => {
    const monthlyData = new Map<string, { credits: number; debits: number; count: number }>();

    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const existing = monthlyData.get(monthKey) || { credits: 0, debits: 0, count: 0 };
      
      if (transaction.type === TransactionType.CREDIT) {
        existing.credits += transaction.value;
      } else {
        existing.debits += transaction.value;
      }
      existing.count += 1;
      
      monthlyData.set(monthKey, existing);
    });

    return Array.from(monthlyData.entries())
      .map(([month, data]) => ({
        month,
        ...data,
        balance: data.credits - data.debits,
      }))
      .sort((a, b) => b.month.localeCompare(a.month));
  }, [transactions]);

  return {
    stats,
    transactionsByDate,
    recentTransactions,
    transactionsWithAttachments,
    monthlySummary,
  };
}

/**
 * Hook para filtrar e pesquisar transações de forma eficiente
 */
export function useTransactionFilters(transactions: Transaction[]) {
  // Filtrar por tipo de transação
  const filterByType = useMemo(() => ({
    credits: transactions.filter(t => t.type === TransactionType.CREDIT),
    debits: transactions.filter(t => t.type === TransactionType.DEBIT),
  }), [transactions]);

  // Funcionalidade de pesquisa
  const searchTransactions = useMemo(() => (searchTerm: string) => {
    if (!searchTerm.trim()) return transactions;
    
    const term = searchTerm.toLowerCase();
    return transactions.filter(transaction => 
      transaction.description.toLowerCase().includes(term) ||
      transaction.value.toString().includes(term) ||
      (transaction.attachment_name && 
       transaction.attachment_name.toLowerCase().includes(term))
    );
  }, [transactions]);

  // Filtrar por intervalo de datas
  const filterByDateRange = useMemo(() => (from?: Date, to?: Date) => {
    if (!from && !to) return transactions;
    
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      
      if (from && transactionDate < from) return false;
      if (to && transactionDate > to) return false;
      
      return true;
    });
  }, [transactions]);

  // Filtrar por intervalo de valores
  const filterByValueRange = useMemo(() => (minValue?: number, maxValue?: number) => {
    if (minValue === undefined && maxValue === undefined) return transactions;
    
    return transactions.filter(transaction => {
      if (minValue !== undefined && transaction.value < minValue) return false;
      if (maxValue !== undefined && transaction.value > maxValue) return false;
      
      return true;
    });
  }, [transactions]);

  return {
    filterByType,
    searchTransactions,
    filterByDateRange,
    filterByValueRange,
  };
}