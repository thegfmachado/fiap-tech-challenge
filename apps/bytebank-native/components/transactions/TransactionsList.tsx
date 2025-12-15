import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { type Transaction } from '@/utils/transactionMapper';
import { TransactionType } from '@fiap-tech-challenge/models';
import FloatingActionButton from '../ui/FloatingActionButton';

/**
 * Propriedades do componente TransactionsList
 *
 * @typedef {Object} TransactionsListProps
 */
export type TransactionsListProps = {
  /** Título da seção da lista */
  title: string;

  /** Array de transações a serem exibidas */
  transactions: Transaction[];

  /** Se deve mostrar botão "Ver todas as transações" */
  showAllTransactionsButton?: boolean;

  /** Função render para ações customizadas por transação */
  renderActions?: (transaction: Transaction) => React.ReactNode;

  /** Callback para refresh da lista */
  onRefresh?: () => void;

  /** Se está em estado de refreshing */
  refreshing?: boolean;

  /** Callback para criar nova transação */
  onCreateNew?: () => void;

  /** Callback quando uma transação é pressionada */
  onTransactionPress?: (transaction: Transaction) => void;
};

/**
 * Ordena transações por data (mais recente primeiro)
 *
 * @param {Transaction[]} transactions - Array de transações para ordenar
 * @returns {Transaction[]} Array de transações ordenado por data decrescente
 */
function sortTransactionsByDate(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Formata valor monetário para o padrão brasileiro
 *
 * @param {number} value - Valor numérico a ser formatado
 * @returns {string} Valor formatado em Real brasileiro (R$ XX,XX)
 */
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    signDisplay: 'never'
  }).format(value);
};

/**
 * Formata data para exibição no padrão brasileiro
 *
 * @param {Date} date - Data a ser formatada
 * @returns {string} Data formatada (DD/MM/AAAA)
 */
const formatDate = (date: Date) => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function TransactionsList({
  title,
  transactions,
  showAllTransactionsButton = false,
  renderActions,
  onRefresh,
  refreshing = false,
  onCreateNew,
  onTransactionPress,
}: TransactionsListProps) {

  const sortedTransactions = useMemo(() => {
    return sortTransactionsByDate(transactions);
  }, [transactions]);

  const getMoneyColor = (type: TransactionType) => {
    return type === TransactionType.CREDIT ? 'text-credit-color' : 'text-debit-color';
  };

  return (
    <View className="flex-1 w-full">
      <View className="flex-row items-center justify-between border-t border-gray-200 py-4 px-7">
        <Text className="font-medium text-base text-gray-900">
          {title}
        </Text>
        {onCreateNew && (
          <FloatingActionButton
            onPress={onCreateNew}
            label="Nova transação"
            icon="add"
          />
        )}
      </View>

      <View>
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map((transaction) => (
            <View
              key={transaction.id}
              className="flex-row items-center justify-between border-t border-gray-200 py-4 px-7"
            >
              <TouchableOpacity
                className="flex-1"
                onPress={() => onTransactionPress?.(transaction)}
              >
                <View className="flex-row items-center">
                  <Text className="text-sm text-gray-900 mb-0.5 flex-1">
                    {transaction.description}
                  </Text>
                </View>
                <Text className="text-sm text-gray-500">
                  {formatDate(new Date(transaction.date))}
                </Text>
              </TouchableOpacity>

              <View className="flex-row justify-between items-center gap-1.5">
                <Text
                  className={`text-sm font-semibold text-right ${getMoneyColor(transaction.type)}`}
                >
                  {`${transaction.type === TransactionType.CREDIT ? '+' : '-'}${formatCurrency(transaction.value)}`}
                </Text>

                {renderActions && (
                  <View
                    className="flex-row items-center bg-transparent z-10"
                    style={{
                      elevation: 10
                    }}
                  >
                    {renderActions(transaction)}
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View className="flex-row items-center justify-center py-4 px-7">
            <Text className="text-gray-500 text-sm">
              Nenhuma transação encontrada
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
