import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

/**
 * Dados para exibição de entrada ou saída
 */
export interface IncomeExpenseItem {
  value: number;
  percentage: number;
  label: string;
}

/**
 * Props do componente IncomeExpenseSummaryCard
 */
export interface IncomeExpenseSummaryCardProps {
  /** Dados das entradas */
  income: IncomeExpenseItem;
  /** Dados das saídas */
  expense: IncomeExpenseItem;
  /** Se está carregando */
  loading?: boolean;
  /** Se há dados para exibir */
  hasData?: boolean;
}

/**
 * Formata valor monetário para exibição
 */
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Componente de ícone para entradas (seta para cima)
 */
const IncomeIcon = () => (
  <View className="w-3 h-3 border border-gray-800 rounded-sm items-center justify-center">
    <Ionicons name="arrow-up" size={8} color="#241B28" />
  </View>
);

/**
 * Componente de ícone para saídas (seta para baixo)
 */
const ExpenseIcon = () => (
  <View className="w-3 h-3 border border-gray-800 rounded-sm items-center justify-center">
    <Ionicons name="arrow-down" size={8} color="#241B28" />
  </View>
);

/**
 * Barra de progresso horizontal mostrando proporção entrada vs saída
 * Design baseado no Figma: altura 27px, borderRadius 13.5px
 */
const ProgressBar: React.FC<{ incomePercentage: number; expensePercentage: number }> = ({
  incomePercentage,
  expensePercentage,
}) => {
  return (
    <View 
      className="w-full flex-row overflow-hidden"
      style={{ 
        height: 27,
        borderRadius: 13.5,
      }}
    >
      {incomePercentage > 0 && (
        <View 
          className="items-center justify-center"
          style={{ 
            width: `${incomePercentage}%`,
            backgroundColor: '#664373',
            borderTopLeftRadius: 13.5,
            borderBottomLeftRadius: 13.5,
          }}
        >
          <Text 
            className="font-normal"
            style={{ 
              fontSize: 12,
              color: '#F1FFF3',
              lineHeight: 14,
            }}
          >
            {incomePercentage.toFixed(2)}%
          </Text>
        </View>
      )}
      
      {expensePercentage > 0 && (
        <View 
          className="items-center justify-center"
          style={{ 
            width: `${expensePercentage}%`,
            backgroundColor: '#CDADD9',
            borderTopRightRadius: 13.5,
            borderBottomRightRadius: 13.5,
          }}
        >
          <Text 
            className="font-medium text-right"
            style={{ 
              fontSize: 13,
              color: '#241B28',
              lineHeight: 15,
            }}
          >
            {expensePercentage.toFixed(2)}%
          </Text>
        </View>
      )}
    </View>
  );
};

/**
 * Card de resumo de entradas e saídas com barra percentual
 */
export default function IncomeExpenseSummaryCard({
  income,
  expense,
  loading = false,
  hasData = false,
}: IncomeExpenseSummaryCardProps) {
  
  if (loading) {
    return (
      <View className="p-6">
        <View className="flex-row justify-center gap-9 mb-6">
          <View className="items-start flex-1">
            <View className="w-16 h-4 bg-gray-200 rounded mb-2" />
            <View className="w-24 h-6 bg-gray-200 rounded mb-1" />
            <View className="w-20 h-3 bg-gray-200 rounded" />
          </View>
          <View className="w-px h-10 bg-gray-200" />
          <View className="items-start flex-1">
            <View className="w-16 h-4 bg-gray-200 rounded mb-2" />
            <View className="w-24 h-6 bg-gray-200 rounded mb-1" />
            <View className="w-20 h-3 bg-gray-200 rounded" />
          </View>
        </View>
        <View className="h-7 bg-gray-200 rounded-full" />
      </View>
    );
  }

  if (!hasData) {
    return (
      <View className="p-6 items-center">
        <Text className="text-sm text-gray-500 text-center">
          Nenhuma movimentação encontrada
        </Text>
        <Text className="text-xs text-gray-400 text-center mt-1">
          Suas entradas e saídas aparecerão aqui
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-col items-center" style={{ gap: 18 }}>
      <View className="flex-row justify-center" style={{ gap: 36 }}>
        <View className="items-start" style={{ height: 46 }}>
          <View className="flex-row items-center mb-2">
            <IncomeIcon />
            <Text 
              className="uppercase ml-2"
              style={{ 
                fontSize: 12,
                fontWeight: '400',
                color: '#241B28',
                lineHeight: 14,
              }}
            >
              {income.label}
            </Text>
          </View>
          <Text 
            className="font-bold"
            style={{ 
              fontSize: 24,
              color: Colors.light.primaryLight,
              lineHeight: 28,
            }}
          >
            {formatCurrency(income.value)}
          </Text>
        </View>

        <View style={{ width: 1, height: 42, backgroundColor: '#DFF7E2' }} />

        <View className="items-start" style={{ height: 45 }}>
          <View className="flex-row items-center mb-2">
            <ExpenseIcon />
            <Text 
              className="uppercase ml-2"
              style={{ 
                fontSize: 12,
                fontWeight: '400',
                color: '#241B28',
                lineHeight: 14,
              }}
            >
              {expense.label}
            </Text>
          </View>
          <Text 
            className="font-semibold"
            style={{ 
              fontSize: 24,
              color: Colors.light.primary,
              lineHeight: 28,
            }}
          >
            {formatCurrency(-expense.value)}
          </Text>
        </View>
      </View>

      <View style={{ width: 349.75 }}>
        <ProgressBar 
          incomePercentage={income.percentage}
          expensePercentage={expense.percentage}
        />
      </View>
    </View>
  );
}
