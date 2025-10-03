import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FiltersState } from '@/hooks/useTransactions';
import { TransactionType } from '@fiap-tech-challenge/models';
import CalendarPicker from './CalendarPicker';

/**
 * Propriedades do componente TransactionFilters
 * 
 * @interface TransactionFiltersProps
 */
interface TransactionFiltersProps {
  /** Estado atual dos filtros aplicados */
  filters: FiltersState;
  
  /** Callback para atualizar os filtros */
  onFiltersChange: (filters: FiltersState) => void;
  
  /** Callback para aplicar os filtros atuais */
  onApplyFilters: () => void;
  
  /** Callback para limpar todos os filtros */
  onClearFilters: () => void;
}

/**
 * Componente de filtros para transações
 * 
 * Fornece interface para filtrar transações por:
 * - Termo de busca textual
 * - Tipo de transação (Todos, Depósito, Saque)
 * - Intervalo de datas (de/até)
 * 
 * @param {TransactionFiltersProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente de filtros
 * 
 * @example
 * ```tsx
 * <TransactionFilters
 *   filters={filters}
 *   onFiltersChange={updateFilters}
 *   onApplyFilters={() => fetchTransactions()}
 *   onClearFilters={() => resetFilters()}
 * />
 * ```
 */
export default function TransactionFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
}: TransactionFiltersProps) {
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);

  const handleSearchTermChange = (text: string) => {
    onFiltersChange({ ...filters, searchTerm: text });
  };

  const handleTypeFilterChange = (type: string) => {
    onFiltersChange({ ...filters, typeFilter: type });
  };

  const handleFromDateSelect = (selectedDate: Date) => {
    const maxDate = filters.dateRange?.to || undefined;
    const finalDate = maxDate && selectedDate > maxDate ? maxDate : selectedDate;
    
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        from: finalDate,
      },
    });
  };

  const handleToDateSelect = (selectedDate: Date) => {
    const minDate = filters.dateRange?.from || undefined;
    const finalDate = minDate && selectedDate < minDate ? minDate : selectedDate;
    
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        to: finalDate,
      },
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const clearDateRange = () => {
    onFiltersChange({
      ...filters,
      dateRange: undefined,
    });
  };

  return (
    <View className="flex-col gap-4 w-full">
      <View className="flex-col gap-4 w-full">
        <View className="relative">
          <Text className="text-xs text-gray-500 mb-2">
            Buscar transações
          </Text>
          <TextInput
            className="border border-gray-300 rounded-md px-3 py-2 bg-white w-full"
            placeholder="Digite o valor ou nome da transação"
            placeholderTextColor="#9ca3af"
            value={filters.searchTerm}
            onChangeText={handleSearchTermChange}
          />
        </View>

        <View className="relative">
          <View className="border border-gray-300 rounded-md bg-white">
            <View className="flex-row w-full">
              <TouchableOpacity
                onPress={() => handleTypeFilterChange('')}
                className={`flex-1 py-3 px-4 border-r border-gray-300 ${
                  !filters.typeFilter ? 'bg-gray-100' : 'bg-transparent'
                }`}
              >
                <Text className={`text-center text-sm ${
                  !filters.typeFilter ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Todos
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleTypeFilterChange(TransactionType.CREDIT)}
                className={`flex-1 py-3 px-4 border-r border-gray-300 ${
                  filters.typeFilter === TransactionType.CREDIT ? 'bg-gray-100' : 'bg-transparent'
                }`}
              >
                <Text className={`text-center text-sm ${
                  filters.typeFilter === TransactionType.CREDIT ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Depósito
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => handleTypeFilterChange(TransactionType.DEBIT)}
                className={`flex-1 py-3 px-4 ${
                  filters.typeFilter === TransactionType.DEBIT ? 'bg-gray-100' : 'bg-transparent'
                }`}
              >
                <Text className={`text-center text-sm ${
                  filters.typeFilter === TransactionType.DEBIT ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Transferência
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="relative">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-xs text-gray-500">
              Período
            </Text>
            {(filters.dateRange?.from || filters.dateRange?.to) && (
              <TouchableOpacity onPress={clearDateRange}>
                <Text className="text-xs underline" style={{ color: '#664373' }}>
                  Limpar datas
                </Text>
              </TouchableOpacity>
            )}
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => setShowFromCalendar(true)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-white flex-row items-center justify-between"
            >
              <Text className={`text-sm ${
                filters.dateRange?.from ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {filters.dateRange?.from ? formatDate(filters.dateRange.from) : 'Data inicial'}
              </Text>
              <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => setShowToCalendar(true)}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-white flex-row items-center justify-between"
            >
              <Text className={`text-sm ${
                filters.dateRange?.to ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {filters.dateRange?.to ? formatDate(filters.dateRange.to) : 'Data final'}
              </Text>
              <Ionicons name="calendar-outline" size={16} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={onApplyFilters}
          className="flex-1 rounded-md py-2"
          style={{ backgroundColor: '#664373' }}
        >
          <Text className="text-white font-semibold text-center text-sm">
            Buscar
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={onClearFilters}
          className="flex-1 bg-transparent border border-gray-300 rounded-md py-2"
        >
          <Text className="text-gray-700 font-semibold text-center text-sm">
            Limpar filtros
          </Text>
        </TouchableOpacity>
      </View>

      <CalendarPicker
        visible={showFromCalendar}
        onClose={() => setShowFromCalendar(false)}
        onDateSelect={handleFromDateSelect}
        selectedDate={filters.dateRange?.from}
        maximumDate={filters.dateRange?.to || new Date()}
        title="Selecionar data inicial"
      />

      <CalendarPicker
        visible={showToCalendar}
        onClose={() => setShowToCalendar(false)}
        onDateSelect={handleToDateSelect}
        selectedDate={filters.dateRange?.to}
        minimumDate={filters.dateRange?.from}
        maximumDate={new Date()}
        title="Selecionar data final"
      />
    </View>
  );
}
