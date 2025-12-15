import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

/**
 * Props do componente BalanceCard
 */
export interface BalanceCardProps {
  /** Valor do saldo */
  balance: number;
  /** Se está carregando */
  loading?: boolean;
  /** Se deve esconder o valor inicialmente */
  initiallyHidden?: boolean;
  /** Callback quando visibilidade muda */
  onVisibilityChange?: (isVisible: boolean) => void;
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
 * Card de saldo com funcionalidade de esconder/mostrar valor
 *
 * Funcionalidades:
 * - Exibição do saldo atual
 * - Botão para esconder/mostrar valor
 * - Estado de loading
 * - Cores dinâmicas baseadas no valor (positivo/negativo)
 *
 * @param props Propriedades do componente
 * @returns JSX.Element
 *
 * @example
 * ```tsx
 * <BalanceCard
 *   balance={15460.75}
 *   loading={false}
 *   initiallyHidden={false}
 *   onVisibilityChange={(visible) => console.log('Visível:', visible)}
 * />
 * ```
 */
export function BalanceCard({
  balance,
  loading = false,
  initiallyHidden = false,
  onVisibilityChange,
}: BalanceCardProps) {
  const [isVisible, setIsVisible] = useState(!initiallyHidden);

  const handleToggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    onVisibilityChange?.(newVisibility);
  };

  const displayValue = isVisible ? formatCurrency(balance) : 'R$ *********';

  if (loading) {
    return (
      <View className="items-center">
        <View className="w-12 h-4 bg-gray-200 rounded mb-2" />
        <View className="w-32 h-10 bg-gray-200 rounded" />
      </View>
    );
  }

  return (
    <View className="items-center">
      <Text className="font-medium text-base mb-1 text-primary-light">
        Saldo
      </Text>

      <View className="flex-row items-center gap-4">
        <Text
          className="text-4xl font-semibold break-words max-w-full text-primary-light"
          accessible={true}
          accessibilityLabel={`Saldo atual: ${isVisible ? formatCurrency(balance) : 'valor oculto'}`}
        >
          {displayValue}
        </Text>

        <TouchableOpacity
          onPress={handleToggleVisibility}
          className="w-8 h-8 items-center justify-center"
          accessible={true}
          accessibilityLabel={isVisible ? 'Esconder saldo' : 'Mostrar saldo'}
          accessibilityHint="Toque para alternar a visibilidade do saldo"
        >
          <Ionicons
            name={isVisible ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={Colors.light.primaryLight}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default BalanceCard;
