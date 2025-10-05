import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Transaction } from '@/utils/transactionMapper';
import { TransactionType } from '@fiap-tech-challenge/models';

export interface RecentTransactionsProps {
  title: string;
  transactions: Transaction[];
  loading?: boolean;
  showAllTransactionsButton?: boolean;
  onTransactionPress?: (transaction: Transaction) => void;
  onViewAllPress?: () => void;
}

const formatCurrency = (value: number, options?: { signDisplay?: 'never' | 'auto' }): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    signDisplay: options?.signDisplay || 'auto',
  }).format(value);
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

function sortTransactionsByDate(transactions: Transaction[]): Transaction[] {
  return [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function TransactionItem({ 
  transaction, 
  onPress 
}: { 
  transaction: Transaction; 
  onPress?: (transaction: Transaction) => void; 
}) {
  const isCredit = transaction.type === TransactionType.CREDIT;
  const textColor = isCredit ? Colors.light.success : Colors.light.danger;

  return (
    <TouchableOpacity
      onPress={() => onPress?.(transaction)}
      className="flex-row items-center justify-between border-t border-gray-200 py-4 px-7"
    >
      <View className="flex-1">
        <Text 
          className="text-sm text-gray-900 mb-0.5"
          numberOfLines={1}
        >
          {transaction.description}
        </Text>
        <Text 
          className="text-sm text-gray-500"
        >
          {formatDate(new Date(transaction.date))}
        </Text>
      </View>
      
      <View className="flex-row justify-between items-center gap-1.5">
        <Text 
          className="text-sm font-semibold text-right"
          style={{ color: textColor }}
        >
          {`${transaction.type === TransactionType.CREDIT ? "+" : "-"}${formatCurrency(transaction.value, { signDisplay: "never" })}`}
        </Text>
        
        <TouchableOpacity
          onPress={() => onPress?.(transaction)}
          className="p-2"
          accessibilityLabel="Ver detalhes"
        >
          <Ionicons 
            name="clipboard-outline" 
            size={20} 
            color={Colors.light.grayMedium} 
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export function RecentTransactions({
  title,
  transactions,
  loading = false,
  showAllTransactionsButton = false,
  onTransactionPress,
  onViewAllPress,
}: RecentTransactionsProps) {
  const sortedTransactions = useMemo(() => {
    return sortTransactionsByDate(transactions);
  }, [transactions]);

  if (loading) {
    return (
      <View className="flex flex-col w-full">
        <View className="flex-row items-center justify-between border-t border-gray-200 py-4 px-7">
          <View className="w-32 h-5 bg-gray-200 rounded" />
          {showAllTransactionsButton && (
            <View className="w-20 h-5 bg-gray-200 rounded" />
          )}
        </View>
        
        {Array.from({ length: 3 }).map((_, index) => (
          <View key={index} className="flex-row items-center justify-between py-4 px-7" style={{ borderTopWidth: 1, borderTopColor: '#e5e7eb' }}>
            <View className="flex-1">
              <View className="w-48 h-4 bg-gray-200 rounded mb-2" />
              <View className="w-24 h-3 bg-gray-200 rounded" />
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="w-20 h-4 bg-gray-200 rounded" />
              <View className="w-8 h-8 bg-gray-200 rounded" />
            </View>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View className="flex flex-col w-full">
      <View className="flex-row items-center justify-between border-t border-gray-200 py-4 px-7">
        <Text className="font-medium text-base text-gray-900">
          {title}
        </Text>
        {showAllTransactionsButton && (
          <TouchableOpacity onPress={onViewAllPress}>
            <Text className="text-sm font-medium" style={{ color: '#553860' }}>
              Ver todas →
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View>
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onPress={onTransactionPress}
            />
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

export default RecentTransactions;